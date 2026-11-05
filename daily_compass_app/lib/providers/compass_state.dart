import 'package:flutter/foundation.dart';
import '../models/petsa_model.dart';
import '../models/byahe_model.dart';
import '../models/kkb_abono_model.dart';
import '../models/sari_sari_model.dart';
import '../models/somatic_model.dart';

class DailyCompassPinoyState {
  final PetsaDePeligroState petsa;
  final List<CommuteLeg> commuteLegs;
  final BeepCard beepCard;
  final List<ByaheSurvivalItem> survivalKit;
  final List<AbonoItem> abonoList;
  final List<SariSariListaItem> sariSariList;
  final WaterRefillTracker waterTracker;
  final BrainFogSosState brainFogState;
  final DateTime currentTime;

  const DailyCompassPinoyState({
    required this.petsa,
    required this.commuteLegs,
    required this.beepCard,
    required this.survivalKit,
    required this.abonoList,
    required this.sariSariList,
    required this.waterTracker,
    required this.brainFogState,
    required this.currentTime,
  });

  /// Automatically derives current Pinoy routine slot based on 24h clock
  PinoyRoutineSlot get activeRoutineSlot {
    final hour = currentTime.hour;
    final minute = currentTime.minute;
    final timeInMinutes = hour * 60 + minute;

    if (timeInMinutes >= 390 && timeInMinutes < 450) {
      // 06:30 - 07:30
      return PinoyRoutineSlot.agahan;
    } else if (timeInMinutes >= 450 && timeInMinutes < 540) {
      // 07:30 - 09:00
      return PinoyRoutineSlot.byahePapunta;
    } else if (timeInMinutes >= 540 && timeInMinutes < 720) {
      // 09:00 - 12:00
      return PinoyRoutineSlot.trabahoKlase1;
    } else if (timeInMinutes >= 720 && timeInMinutes < 810) {
      // 12:00 - 13:30
      return PinoyRoutineSlot.tanghalian;
    } else if (timeInMinutes >= 810 && timeInMinutes < 930) {
      // 13:30 - 15:30
      return PinoyRoutineSlot.trabahoKlase2;
    } else if (timeInMinutes >= 930 && timeInMinutes < 990) {
      // 15:30 - 16:30
      return PinoyRoutineSlot.merienda;
    } else if (timeInMinutes >= 990 && timeInMinutes < 1170) {
      // 16:30 - 19:30
      return PinoyRoutineSlot.byahePauwi;
    } else if (timeInMinutes >= 1170 && timeInMinutes < 1230) {
      // 19:30 - 20:30
      return PinoyRoutineSlot.hapunan;
    } else if (timeInMinutes >= 1230 && timeInMinutes < 1350) {
      // 20:30 - 22:30
      return PinoyRoutineSlot.pahinga;
    } else {
      // 22:30 - 06:30
      return PinoyRoutineSlot.tulog;
    }
  }

  /// Total money owed to user from abono & group splits
  double get totalOwedToMe {
    return abonoList
        .where((a) => a.status == AbonoStatus.pending)
        .fold(0.0, (acc, item) => acc + item.amount);
  }

  /// Total unpaid sari-sari store lista
  double get totalSariSariLista {
    return sariSariList
        .where((s) => !s.isSettled)
        .fold(0.0, (acc, item) => acc + item.amount);
  }

  DailyCompassPinoyState copyWith({
    PetsaDePeligroState? petsa,
    List<CommuteLeg>? commuteLegs,
    BeepCard? beepCard,
    List<ByaheSurvivalItem>? survivalKit,
    List<AbonoItem>? abonoList,
    List<SariSariListaItem>? sariSariList,
    WaterRefillTracker? waterTracker,
    BrainFogSosState? brainFogState,
    DateTime? currentTime,
  }) {
    return DailyCompassPinoyState(
      petsa: petsa ?? this.petsa,
      commuteLegs: commuteLegs ?? this.commuteLegs,
      beepCard: beepCard ?? this.beepCard,
      survivalKit: survivalKit ?? this.survivalKit,
      abonoList: abonoList ?? this.abonoList,
      sariSariList: sariSariList ?? this.sariSariList,
      waterTracker: waterTracker ?? this.waterTracker,
      brainFogState: brainFogState ?? this.brainFogState,
      currentTime: currentTime ?? this.currentTime,
    );
  }

  static DailyCompassPinoyState initial() {
    final now = DateTime.now();
    return DailyCompassPinoyState(
      petsa: PetsaDePeligroState.defaultSample(),
      commuteLegs: [
        const CommuteLeg(
          id: 'leg-1',
          title: 'Tricycle to LRT-1 Katipunan / Bayan',
          mode: TransitMode.tricycle,
          estimatedFare: 25.0,
          isCompleted: false,
          order: 1,
          notes: 'Special trip ₱25; share is ₱15',
        ),
        const CommuteLeg(
          id: 'leg-2',
          title: 'MRT-3 Cubao to Ayala Station',
          mode: TransitMode.mrt3,
          estimatedFare: 24.0,
          isCompleted: false,
          order: 2,
          notes: 'Beep tap card',
        ),
        const CommuteLeg(
          id: 'leg-3',
          title: 'Lakad / Walk along Ayala walkway to Office',
          mode: TransitMode.walking,
          estimatedFare: 0.0,
          isCompleted: false,
          order: 3,
          notes: '8-minute covered walk',
        ),
      ],
      beepCard: BeepCard(
        balance: 78.0,
        lastTapStation: 'MRT-3 Cubao',
        lastUpdated: now.subtract(const Duration(hours: 1)),
      ),
      survivalKit: ByaheSurvivalItem.defaultSurvivalKit(),
      abonoList: AbonoItem.defaultSampleList(),
      sariSariList: SariSariListaItem.defaultSamples(),
      waterTracker: const WaterRefillTracker(),
      brainFogState: const BrainFogSosState(),
      currentTime: now,
    );
  }
}

class CompassStore extends ChangeNotifier {
  DailyCompassPinoyState _state = DailyCompassPinoyState.initial();

  DailyCompassPinoyState get state => _state;

  void updateCurrentTime(DateTime newTime) {
    _state = _state.copyWith(
      currentTime: newTime,
      petsa: _state.petsa.copyWith(now: newTime),
    );
    notifyListeners();
  }

  // --- Financial & Petsa de Peligro Actions ---

  void logExpense(double amount, {String? category, String? note}) {
    final newSpent = _state.petsa.expensesLoggedToday + amount;
    // Deduct from cash by default
    final newCash = (_state.petsa.cashOnHand - amount).clamp(0.0, double.infinity);
    _state = _state.copyWith(
      petsa: _state.petsa.copyWith(
        expensesLoggedToday: newSpent,
        cashOnHand: newCash,
      ),
    );
    notifyListeners();
  }

  void logQuickExpense(double amount, String label) {
    logExpense(amount, category: label, note: 'Quick pill ₱${amount.toStringAsFixed(0)}');
  }

  void updateWalletBalances({
    double? cash,
    double? gcash,
    double? maya,
    double? commuteBenchmark,
  }) {
    _state = _state.copyWith(
      petsa: _state.petsa.copyWith(
        cashOnHand: cash,
        gcashBalance: gcash,
        mayaBalance: maya,
        dailyCommuteBenchmark: commuteBenchmark,
      ),
    );
    notifyListeners();
  }

  // --- Commute & Byahe Actions ---

  void toggleCommuteLeg(String legId) {
    final updatedLegs = _state.commuteLegs.map((leg) {
      if (leg.id == legId) {
        final willComplete = !leg.isCompleted;
        // If completing, deduct fare
        if (willComplete && leg.estimatedFare > 0) {
          if (leg.mode == TransitMode.mrt3 || leg.mode == TransitMode.lrt1 || leg.mode == TransitMode.lrt2) {
            // Deduct from Beep card
            final newBeep = (_state.beepCard.balance - leg.estimatedFare).clamp(0.0, double.infinity);
            _state = _state.copyWith(
              beepCard: _state.beepCard.copyWith(balance: newBeep),
            );
          } else {
            // Deduct from cash
            logExpense(leg.estimatedFare, category: leg.mode.displayName, note: leg.title);
          }
        }
        return leg.copyWith(isCompleted: willComplete);
      }
      return leg;
    }).toList();

    _state = _state.copyWith(commuteLegs: updatedLegs);
    notifyListeners();
  }

  void updateBeepCardBalance(double newBalance) {
    _state = _state.copyWith(
      beepCard: _state.beepCard.copyWith(
        balance: newBalance,
        lastUpdated: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  void toggleSurvivalItem(String itemId) {
    final updatedKit = _state.survivalKit.map((item) {
      if (item.id == itemId) {
        return item.copyWith(isChecked: !item.isChecked);
      }
      return item;
    }).toList();

    _state = _state.copyWith(survivalKit: updatedKit);
    notifyListeners();
  }

  // --- KKB & Abono Actions ---

  void addAbono({
    required String debtorName,
    required String occasion,
    required double amount,
    String? gcashNumber,
    String? notes,
  }) {
    final newItem = AbonoItem(
      id: 'abono-${DateTime.now().millisecondsSinceEpoch}',
      debtorName: debtorName,
      occasion: occasion,
      amount: amount,
      gcashNumber: gcashNumber,
      createdAt: DateTime.now(),
      notes: notes,
    );
    _state = _state.copyWith(abonoList: [newItem, ..._state.abonoList]);
    notifyListeners();
  }

  void settleAbono(String itemId, AbonoStatus status) {
    final updatedList = _state.abonoList.map((item) {
      if (item.id == itemId) {
        return item.copyWith(
          status: status,
          settledAt: DateTime.now(),
        );
      }
      return item;
    }).toList();

    _state = _state.copyWith(abonoList: updatedList);
    notifyListeners();
  }

  // --- Sari-Sari Store Lista Actions ---

  void addSariSariItem({
    required String storeName,
    required String itemsList,
    required double amount,
    required String targetSettlementDate,
  }) {
    final newItem = SariSariListaItem(
      id: 'lista-${DateTime.now().millisecondsSinceEpoch}',
      storeName: storeName,
      itemsList: itemsList,
      amount: amount,
      dateIncurred: DateTime.now(),
      targetSettlementDate: targetSettlementDate,
      isSettled: false,
    );
    _state = _state.copyWith(sariSariList: [newItem, ..._state.sariSariList]);
    notifyListeners();
  }

  void settleSariSariItem(String id) {
    final updatedList = _state.sariSariList.map((item) {
      if (item.id == id) {
        return item.copyWith(
          isSettled: true,
          settledAt: DateTime.now(),
        );
      }
      return item;
    }).toList();

    _state = _state.copyWith(sariSariList: updatedList);
    notifyListeners();
  }

  // --- Somatic, Water & Grounding Actions ---

  void drinkGlassOfWater() {
    _state = _state.copyWith(
      waterTracker: _state.waterTracker.copyWith(
        glassesConsumedToday: _state.waterTracker.glassesConsumedToday + 1,
      ),
    );
    notifyListeners();
  }

  void drinkTumblerOfWater() {
    _state = _state.copyWith(
      waterTracker: _state.waterTracker.copyWith(
        glassesConsumedToday: _state.waterTracker.glassesConsumedToday + 2,
      ),
    );
    notifyListeners();
  }

  void refillWaterJug() {
    _state = _state.copyWith(
      waterTracker: _state.waterTracker.copyWith(daysLeftInJug: 10),
    );
    notifyListeners();
  }

  void openBrainFogSos() {
    _state = _state.copyWith(
      brainFogState: const BrainFogSosState(
        isOpen: true,
        activeQuestionIndex: 0,
      ),
    );
    notifyListeners();
  }

  void nextBrainFogStep() {
    final current = _state.brainFogState.activeQuestionIndex;
    if (current < 2) {
      _state = _state.copyWith(
        brainFogState: _state.brainFogState.copyWith(
          activeQuestionIndex: current + 1,
        ),
      );
    } else {
      _state = _state.copyWith(
        brainFogState: _state.brainFogState.copyWith(
          isOpen: false,
          safeHarborActive: true,
        ),
      );
    }
    notifyListeners();
  }

  void closeBrainFogSos() {
    _state = _state.copyWith(
      brainFogState: _state.brainFogState.copyWith(isOpen: false),
    );
    notifyListeners();
  }
}
