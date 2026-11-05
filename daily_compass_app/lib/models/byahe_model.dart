enum TransitMode {
  tricycle,
  jeepneyTraditional,
  jeepneyModern,
  mrt3,
  lrt1,
  lrt2,
  edsaCarousel,
  busProvincial,
  uvExpress,
  angkasJoyride,
  walking,
}

extension TransitModeExtension on TransitMode {
  String get displayName {
    switch (this) {
      case TransitMode.tricycle:
        return 'Tricycle TODA';
      case TransitMode.jeepneyTraditional:
        return 'Traditional Jeep';
      case TransitMode.jeepneyModern:
        return 'Modern E-Jeep';
      case TransitMode.mrt3:
        return 'MRT-3 Line';
      case TransitMode.lrt1:
        return 'LRT-1 Line';
      case TransitMode.lrt2:
        return 'LRT-2 Line';
      case TransitMode.edsaCarousel:
        return 'EDSA Carousel Bus';
      case TransitMode.busProvincial:
        return 'City / Provincial Bus';
      case TransitMode.uvExpress:
        return 'UV Express Van';
      case TransitMode.angkasJoyride:
        return 'Angkas / JoyRide / MoveIt';
      case TransitMode.walking:
        return 'Walking / Lakad';
    }
  }

  String get iconGlyph {
    switch (this) {
      case TransitMode.tricycle:
        return '🛺';
      case TransitMode.jeepneyTraditional:
      case TransitMode.jeepneyModern:
        return '🚐';
      case TransitMode.mrt3:
      case TransitMode.lrt1:
      case TransitMode.lrt2:
        return '🚊';
      case TransitMode.edsaCarousel:
      case TransitMode.busProvincial:
        return '🚌';
      case TransitMode.uvExpress:
        return '🚐';
      case TransitMode.angkasJoyride:
        return '🛵';
      case TransitMode.walking:
        return '🚶';
    }
  }
}

class CommuteLeg {
  final String id;
  final String title;
  final TransitMode mode;
  final double estimatedFare;
  final double? actualFare;
  final bool isCompleted;
  final int order;
  final String? notes;

  const CommuteLeg({
    required this.id,
    required this.title,
    required this.mode,
    required this.estimatedFare,
    this.actualFare,
    this.isCompleted = false,
    required this.order,
    this.notes,
  });

  CommuteLeg copyWith({
    String? id,
    String? title,
    TransitMode? mode,
    double? estimatedFare,
    double? actualFare,
    bool? isCompleted,
    int? order,
    String? notes,
  }) {
    return CommuteLeg(
      id: id ?? this.id,
      title: title ?? this.title,
      mode: mode ?? this.mode,
      estimatedFare: estimatedFare ?? this.estimatedFare,
      actualFare: actualFare ?? this.actualFare,
      isCompleted: isCompleted ?? this.isCompleted,
      order: order ?? this.order,
      notes: notes ?? this.notes,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'mode': mode.index,
    'estimatedFare': estimatedFare,
    'actualFare': actualFare,
    'isCompleted': isCompleted,
    'order': order,
    'notes': notes,
  };

  factory CommuteLeg.fromJson(Map<String, dynamic> json) {
    return CommuteLeg(
      id: json['id'] as String,
      title: json['title'] as String,
      mode: TransitMode.values[json['mode'] as int],
      estimatedFare: (json['estimatedFare'] as num).toDouble(),
      actualFare: (json['actualFare'] as num?)?.toDouble(),
      isCompleted: json['isCompleted'] as bool? ?? false,
      order: json['order'] as int,
      notes: json['notes'] as String?,
    );
  }
}

class BeepCard {
  final double balance;
  final String lastTapStation;
  final DateTime lastUpdated;

  const BeepCard({
    required this.balance,
    required this.lastTapStation,
    required this.lastUpdated,
  });

  bool get isLowBalance => balance < 50.0;

  int get estimatedRidesRemaining => (balance / 24.0).floor();

  BeepCard copyWith({
    double? balance,
    String? lastTapStation,
    DateTime? lastUpdated,
  }) {
    return BeepCard(
      balance: balance ?? this.balance,
      lastTapStation: lastTapStation ?? this.lastTapStation,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }

  Map<String, dynamic> toJson() => {
    'balance': balance,
    'lastTapStation': lastTapStation,
    'lastUpdated': lastUpdated.toIso8601String(),
  };

  factory BeepCard.fromJson(Map<String, dynamic> json) {
    return BeepCard(
      balance: (json['balance'] as num).toDouble(),
      lastTapStation: json['lastTapStation'] as String,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
    );
  }
}

class ByaheSurvivalItem {
  final String id;
  final String name;
  final String icon;
  final bool isChecked;
  final String description;

  const ByaheSurvivalItem({
    required this.id,
    required this.name,
    required this.icon,
    this.isChecked = false,
    required this.description,
  });

  ByaheSurvivalItem copyWith({
    String? id,
    String? name,
    String? icon,
    bool? isChecked,
    String? description,
  }) {
    return ByaheSurvivalItem(
      id: id ?? this.id,
      name: name ?? this.name,
      icon: icon ?? this.icon,
      isChecked: isChecked ?? this.isChecked,
      description: description ?? this.description,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'icon': icon,
    'isChecked': isChecked,
    'description': description,
  };

  factory ByaheSurvivalItem.fromJson(Map<String, dynamic> json) {
    return ByaheSurvivalItem(
      id: json['id'] as String,
      name: json['name'] as String,
      icon: json['icon'] as String,
      isChecked: json['isChecked'] as bool? ?? false,
      description: json['description'] as String,
    );
  }

  static List<ByaheSurvivalItem> defaultSurvivalKit() {
    return const [
      ByaheSurvivalItem(
        id: 'edc-payong',
        name: 'Payong (Umbrella)',
        icon: '☂️',
        isChecked: true,
        description: 'Protection from sudden tropical downpours or 34°C sunburn',
      ),
      ByaheSurvivalItem(
        id: 'edc-bimpo',
        name: 'Bimpo / Handkerchief',
        icon: '🧖',
        isChecked: true,
        description: 'For wiping sweat and dust during humid jeepney rides',
      ),
      ByaheSurvivalItem(
        id: 'edc-barya',
        name: 'Barya (Exact Coins)',
        icon: '🪙',
        isChecked: false,
        description: 'Exact ₱15 / ₱25 coins ready to avoid driver delay',
      ),
      ByaheSurvivalItem(
        id: 'edc-powerbank',
        name: 'Powerbank (>50%)',
        icon: '🔋',
        isChecked: true,
        description: 'Keeps phone alive during 2-hour EDSA traffic gridlocks',
      ),
      ByaheSurvivalItem(
        id: 'edc-alcohol',
        name: 'Pocket Alcohol',
        icon: '🧴',
        isChecked: false,
        description: 'Hand hygiene after holding train handles and passing coins',
      ),
      ByaheSurvivalItem(
        id: 'edc-earphones',
        name: 'Earphones / Earplugs',
        icon: '🎧',
        isChecked: false,
        description: 'Sensory shielding against diesel engines, loud horns, and crowds',
      ),
    ];
  }
}

