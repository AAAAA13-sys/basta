class SariSariListaItem {
  final String id;
  final String storeName; // e.g. "Tindahan ni Aling Nena", "Canteen Kuya Ed"
  final String itemsList;  // e.g. "2 Lucky Me Chili Mansi, 1 Itlog, 1 Kopiko Brown"
  final double amount;
  final DateTime dateIncurred;
  final String targetSettlementDate; // e.g. "On Payday 15th"
  final bool isSettled;
  final DateTime? settledAt;

  const SariSariListaItem({
    required this.id,
    required this.storeName,
    required this.itemsList,
    required this.amount,
    required this.dateIncurred,
    required this.targetSettlementDate,
    this.isSettled = false,
    this.settledAt,
  });

  SariSariListaItem copyWith({
    String? id,
    String? storeName,
    String? itemsList,
    double? amount,
    DateTime? dateIncurred,
    String? targetSettlementDate,
    bool? isSettled,
    DateTime? settledAt,
  }) {
    return SariSariListaItem(
      id: id ?? this.id,
      storeName: storeName ?? this.storeName,
      itemsList: itemsList ?? this.itemsList,
      amount: amount ?? this.amount,
      dateIncurred: dateIncurred ?? this.dateIncurred,
      targetSettlementDate: targetSettlementDate ?? this.targetSettlementDate,
      isSettled: isSettled ?? this.isSettled,
      settledAt: settledAt ?? this.settledAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'storeName': storeName,
    'itemsList': itemsList,
    'amount': amount,
    'dateIncurred': dateIncurred.toIso8601String(),
    'targetSettlementDate': targetSettlementDate,
    'isSettled': isSettled,
    'settledAt': settledAt?.toIso8601String(),
  };

  factory SariSariListaItem.fromJson(Map<String, dynamic> json) {
    return SariSariListaItem(
      id: json['id'] as String,
      storeName: json['storeName'] as String,
      itemsList: json['itemsList'] as String,
      amount: (json['amount'] as num).toDouble(),
      dateIncurred: DateTime.parse(json['dateIncurred'] as String),
      targetSettlementDate: json['targetSettlementDate'] as String,
      isSettled: json['isSettled'] as bool? ?? false,
      settledAt: json['settledAt'] != null ? DateTime.parse(json['settledAt'] as String) : null,
    );
  }

  static List<SariSariListaItem> defaultSamples() {
    final now = DateTime.now();
    return [
      SariSariListaItem(
        id: 'lista-1',
        storeName: 'Tindahan ni Aling Nena',
        itemsList: '2 Pancit Canton Kalamansi, 1 Itlog, 1 Nescafe 3-in-1',
        amount: 58.0,
        dateIncurred: now.subtract(const Duration(days: 1)),
        targetSettlementDate: 'Bayaran sa 15th (Sahod)',
        isSettled: false,
      ),
    ];
  }
}
