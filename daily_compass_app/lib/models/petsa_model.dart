enum PetsaCycle {
  quincena1530,
  weeklyBaonMonday,
  weeklyBaonFriday,
  monthlyStipend,
}

enum PetsaSeverity {
  ayosPa,       // Safe: >= ₱200/day
  ingatLang,    // Moderate: ₱80 - ₱199/day
  petsaDePeligro, // Tight: < ₱80/day
}

class PendingFixedBill {
  final String id;
  final String title;
  final double amount;
  final String dueDate; // YYYY-MM-DD
  final bool isPaid;

  const PendingFixedBill({
    required this.id,
    required this.title,
    required this.amount,
    required this.dueDate,
    this.isPaid = false,
  });

  PendingFixedBill copyWith({
    String? id,
    String? title,
    double? amount,
    String? dueDate,
    bool? isPaid,
  }) {
    return PendingFixedBill(
      id: id ?? this.id,
      title: title ?? this.title,
      amount: amount ?? this.amount,
      dueDate: dueDate ?? this.dueDate,
      isPaid: isPaid ?? this.isPaid,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'amount': amount,
    'dueDate': dueDate,
    'isPaid': isPaid,
  };

  factory PendingFixedBill.fromJson(Map<String, dynamic> json) {
    return PendingFixedBill(
      id: json['id'] as String,
      title: json['title'] as String,
      amount: (json['amount'] as num).toDouble(),
      dueDate: json['dueDate'] as String,
      isPaid: json['isPaid'] as bool? ?? false,
    );
  }
}

class PetsaDePeligroState {
  final double cashOnHand;
  final double gcashBalance;
  final double mayaBalance;
  final double dailyCommuteBenchmark; // e.g. ₱140.00 roundtrip
  final PetsaCycle cycle;
  final List<PendingFixedBill> pendingBills;
  final double expensesLoggedToday;
  final DateTime now;

  const PetsaDePeligroState({
    required this.cashOnHand,
    required this.gcashBalance,
    required this.mayaBalance,
    required this.dailyCommuteBenchmark,
    required this.cycle,
    required this.pendingBills,
    required this.expensesLoggedToday,
    required this.now,
  });

  /// Total liquid assets
  double get totalWalletBalance => cashOnHand + gcashBalance + mayaBalance;

  /// Calculate days remaining until next payday
  int get daysRemainingUntilPayday {
    final currentDay = now.day;
    final currentYear = now.year;
    final currentMonth = now.month;

    switch (cycle) {
      case PetsaCycle.quincena1530:
        if (currentDay < 15) {
          return 15 - currentDay;
        } else {
          // Days until last day of month or 30th
          final daysInMonth = DateTime(currentYear, currentMonth + 1, 0).day;
          final cutoff = daysInMonth >= 30 ? 30 : daysInMonth;
          if (currentDay < cutoff) {
            return cutoff - currentDay;
          } else {
            // Next month 15th
            final daysLeftThisMonth = daysInMonth - currentDay;
            return daysLeftThisMonth + 15;
          }
        }
      case PetsaCycle.weeklyBaonMonday:
        // Next Monday (weekday 1)
        final diff = (DateTime.monday - now.weekday + 7) % 7;
        return diff == 0 ? 7 : diff;
      case PetsaCycle.weeklyBaonFriday:
        // Next Friday (weekday 5)
        final diff = (DateTime.friday - now.weekday + 7) % 7;
        return diff == 0 ? 7 : diff;
      case PetsaCycle.monthlyStipend:
        final daysInMonth = DateTime(currentYear, currentMonth + 1, 0).day;
        return daysInMonth - currentDay + 1;
    }
  }

  /// Untouchable pamasahe reserve locked in vault
  double get untouchablePamasaheReserve {
    final days = daysRemainingUntilPayday > 0 ? daysRemainingUntilPayday : 1;
    return days * dailyCommuteBenchmark;
  }

  /// Total unpaid fixed bills (e.g. prepaid wifi load, 5-gal water refill)
  double get totalPendingBills {
    return pendingBills
        .where((b) => !b.isPaid)
        .fold(0.0, (acc, bill) => acc + bill.amount);
  }

  /// Discretionary spending pool after protecting fare and bills
  double get discretionaryPool {
    final pool = totalWalletBalance - untouchablePamasaheReserve - totalPendingBills;
    return pool > 0 ? pool : 0.0;
  }

  /// Safe-to-spend daily allowance ("Pwede Gastusin Ngayon")
  double get pwedeGastusinToday {
    final days = daysRemainingUntilPayday > 0 ? daysRemainingUntilPayday : 1;
    final dailyShare = discretionaryPool / days;
    final remainingToday = dailyShare - expensesLoggedToday;
    return remainingToday;
  }

  /// Current Petsa Severity
  PetsaSeverity get severity {
    final safe = pwedeGastusinToday;
    if (safe >= 200.0) {
      return PetsaSeverity.ayosPa;
    } else if (safe >= 80.0) {
      return PetsaSeverity.ingatLang;
    } else {
      return PetsaSeverity.petsaDePeligro;
    }
  }

  PetsaDePeligroState copyWith({
    double? cashOnHand,
    double? gcashBalance,
    double? mayaBalance,
    double? dailyCommuteBenchmark,
    PetsaCycle? cycle,
    List<PendingFixedBill>? pendingBills,
    double? expensesLoggedToday,
    DateTime? now,
  }) {
    return PetsaDePeligroState(
      cashOnHand: cashOnHand ?? this.cashOnHand,
      gcashBalance: gcashBalance ?? this.gcashBalance,
      mayaBalance: mayaBalance ?? this.mayaBalance,
      dailyCommuteBenchmark: dailyCommuteBenchmark ?? this.dailyCommuteBenchmark,
      cycle: cycle ?? this.cycle,
      pendingBills: pendingBills ?? this.pendingBills,
      expensesLoggedToday: expensesLoggedToday ?? this.expensesLoggedToday,
      now: now ?? this.now,
    );
  }

  static PetsaDePeligroState defaultSample() {
    return PetsaDePeligroState(
      cashOnHand: 450.0,
      gcashBalance: 820.0,
      mayaBalance: 180.0,
      dailyCommuteBenchmark: 70.0, // ₱70 daily fare roundtrip
      cycle: PetsaCycle.quincena1530,
      pendingBills: [
        const PendingFixedBill(
          id: 'bill-water',
          title: '5-Gallon Water Refill',
          amount: 35.0,
          dueDate: '2026-11-08',
        ),
        const PendingFixedBill(
          id: 'bill-load',
          title: 'Prepaid Data (Go59)',
          amount: 59.0,
          dueDate: '2026-11-10',
        ),
      ],
      expensesLoggedToday: 0.0,
      now: DateTime.now(),
    );
  }
}
