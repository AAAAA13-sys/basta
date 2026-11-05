enum AbonoStatus {
  pending,
  paidGCash,
  paidMaya,
  paidCash,
  waivedLibre,
}

extension AbonoStatusExtension on AbonoStatus {
  String get label {
    switch (this) {
      case AbonoStatus.pending:
        return 'Pending';
      case AbonoStatus.paidGCash:
        return 'Paid via GCash';
      case AbonoStatus.paidMaya:
        return 'Paid via Maya';
      case AbonoStatus.paidCash:
        return 'Paid in Cash';
      case AbonoStatus.waivedLibre:
        return 'Libre (Waived)';
    }
  }

  bool get isSettled => this != AbonoStatus.pending;
}

class AbonoItem {
  final String id;
  final String debtorName;
  final String occasion; // e.g. "Lunch sa Jollijeep", "Kopiko / Milktea", "Printing fee"
  final double amount;
  final AbonoStatus status;
  final String? gcashNumber;
  final DateTime createdAt;
  final DateTime? settledAt;
  final String? notes;

  const AbonoItem({
    required this.id,
    required this.debtorName,
    required this.occasion,
    required this.amount,
    this.status = AbonoStatus.pending,
    this.gcashNumber,
    required this.createdAt,
    this.settledAt,
    this.notes,
  });

  /// Generates a polite, non-awkward message to copy to clipboard for Messenger / SMS
  String generateFriendlyReminder({
    required String myName,
    required String myGcashNumber,
  }) {
    return 'Hi $debtorName! Share mo pala kanina for "$occasion" is ₱${amount.toStringAsFixed(2)}. '
        'Pwede pa-send sa GCash: $myGcashNumber ($myName) pag convenient sayo. Maraming salamat! 🙏';
  }

  AbonoItem copyWith({
    String? id,
    String? debtorName,
    String? occasion,
    double? amount,
    AbonoStatus? status,
    String? gcashNumber,
    DateTime? createdAt,
    DateTime? settledAt,
    String? notes,
  }) {
    return AbonoItem(
      id: id ?? this.id,
      debtorName: debtorName ?? this.debtorName,
      occasion: occasion ?? this.occasion,
      amount: amount ?? this.amount,
      status: status ?? this.status,
      gcashNumber: gcashNumber ?? this.gcashNumber,
      createdAt: createdAt ?? this.createdAt,
      settledAt: settledAt ?? this.settledAt,
      notes: notes ?? this.notes,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'debtorName': debtorName,
    'occasion': occasion,
    'amount': amount,
    'status': status.index,
    'gcashNumber': gcashNumber,
    'createdAt': createdAt.toIso8601String(),
    'settledAt': settledAt?.toIso8601String(),
    'notes': notes,
  };

  factory AbonoItem.fromJson(Map<String, dynamic> json) {
    return AbonoItem(
      id: json['id'] as String,
      debtorName: json['debtorName'] as String,
      occasion: json['occasion'] as String,
      amount: (json['amount'] as num).toDouble(),
      status: AbonoStatus.values[json['status'] as int],
      gcashNumber: json['gcashNumber'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      settledAt: json['settledAt'] != null ? DateTime.parse(json['settledAt'] as String) : null,
      notes: json['notes'] as String?,
    );
  }

  static List<AbonoItem> defaultSampleList() {
    final now = DateTime.now();
    return [
      AbonoItem(
        id: 'abono-1',
        debtorName: 'Mark (Seatmate)',
        occasion: 'Jollijeep Sisig + Rice',
        amount: 85.0,
        status: AbonoStatus.pending,
        createdAt: now.subtract(const Duration(hours: 3)),
        notes: 'Paid first because card reader was down',
      ),
      AbonoItem(
        id: 'abono-2',
        debtorName: 'Bea (Colleague)',
        occasion: 'Kopiko 78 / Milktea run',
        amount: 75.0,
        status: AbonoStatus.pending,
        createdAt: now.subtract(const Duration(days: 1)),
      ),
      AbonoItem(
        id: 'abono-3',
        debtorName: 'Kuya Carlo',
        occasion: 'Thesis group photocopying',
        amount: 120.0,
        status: AbonoStatus.paidGCash,
        createdAt: now.subtract(const Duration(days: 2)),
        settledAt: now.subtract(const Duration(days: 1)),
      ),
    ];
  }
}
