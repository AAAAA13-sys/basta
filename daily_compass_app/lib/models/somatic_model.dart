enum PinoyRoutineSlot {
  agahan,          // Morning 06:30 - 08:30 (Silog / Hot Pandesal)
  byahePapunta,    // Commute Inbound 07:30 - 09:00
  trabahoKlase1,   // Morning Shift / Classes 09:00 - 12:00
  tanghalian,      // Lunch 12:00 - 13:30 (Kare-kare / Jollijeep)
  trabahoKlase2,   // Afternoon Shift 13:30 - 15:30
  merienda,        // Merienda Break 15:30 - 16:30 (Turon / Banana cue / Kopiko)
  byahePauwi,      // Commute Outbound 17:00 - 19:30
  hapunan,         // Dinner 19:30 - 20:30 (Home dinner)
  pahinga,         // Evening Rest & Screen Down 20:30 - 22:30
  tulog,           // Deep Sleep 22:30 - 06:30
}

extension PinoyRoutineSlotExtension on PinoyRoutineSlot {
  String get tagalogLabel {
    switch (this) {
      case PinoyRoutineSlot.agahan:
        return 'Almusal / Agahan 🍳';
      case PinoyRoutineSlot.byahePapunta:
        return 'Byahe Papasok 🚐';
      case PinoyRoutineSlot.trabahoKlase1:
        return 'Trabaho / Klase 🎯';
      case PinoyRoutineSlot.tanghalian:
        return 'Tanghalian 🍱';
      case PinoyRoutineSlot.trabahoKlase2:
        return 'Hapon Focus ⚡';
      case PinoyRoutineSlot.merienda:
        return 'Merienda Time 🥪';
      case PinoyRoutineSlot.byahePauwi:
        return 'Byahe Pauwi 🚌';
      case PinoyRoutineSlot.hapunan:
        return 'Hapunan 🍲';
      case PinoyRoutineSlot.pahinga:
        return 'Pahinga Muna 🌿';
      case PinoyRoutineSlot.tulog:
        return 'Oras ng Tulog 🌙';
    }
  }

  String get guidanceMessage {
    switch (this) {
      case PinoyRoutineSlot.agahan:
        return 'Kain ka muna ng agahan o mainit na pandesal bago sumabak sa byahe.';
      case PinoyRoutineSlot.byahePapunta:
        return 'Ihanda ang barya at Beep card. Ingat sa bag at phone.';
      case PinoyRoutineSlot.trabahoKlase1:
        return 'Focus muna sa pinakamahalagang isang gawain ngayong umaga.';
      case PinoyRoutineSlot.tanghalian:
        return 'Oras na para kumain at magpahinga ang mata sa screen.';
      case PinoyRoutineSlot.trabahoKlase2:
        return 'Dahan-dahan lang. Malapit na ang uwian.';
      case PinoyRoutineSlot.merienda:
        return 'Merienda break! Uminom ng tubig o magkape nang saglit.';
      case PinoyRoutineSlot.byahePauwi:
        return 'Pauwi ka na. Huwag magmadali, ang mahalaga makauwi nang ligtas.';
      case PinoyRoutineSlot.hapunan:
        return 'Mainit na sabaw at kanin kasama ang pamilya o tahimik na oras.';
      case PinoyRoutineSlot.pahinga:
        return 'I-off na ang work notifications. Pahinga muna ang utak.';
      case PinoyRoutineSlot.tulog:
        return 'Matulog nang mahimbing para may lakas sa susunod na byahe.';
    }
  }
}

class WaterRefillTracker {
  final int daysLeftInJug; // 5-gallon blue container estimate
  final int glassesConsumedToday;
  final int targetGlassesPerDay;

  const WaterRefillTracker({
    this.daysLeftInJug = 3,
    this.glassesConsumedToday = 4,
    this.targetGlassesPerDay = 8,
  });

  bool get needsRefillSoon => daysLeftInJug <= 2;

  double get hydrationProgress => (glassesConsumedToday / targetGlassesPerDay).clamp(0.0, 1.0);

  int get millilitersDrank => glassesConsumedToday * 250;

  WaterRefillTracker copyWith({
    int? daysLeftInJug,
    int? glassesConsumedToday,
    int? targetGlassesPerDay,
  }) {
    return WaterRefillTracker(
      daysLeftInJug: daysLeftInJug ?? this.daysLeftInJug,
      glassesConsumedToday: glassesConsumedToday ?? this.glassesConsumedToday,
      targetGlassesPerDay: targetGlassesPerDay ?? this.targetGlassesPerDay,
    );
  }
}

class BrainFogSosState {
  final bool isOpen;
  final int activeQuestionIndex; // 0, 1, or 2
  final String? chosenMicroAction;
  final bool safeHarborActive;

  const BrainFogSosState({
    this.isOpen = false,
    this.activeQuestionIndex = 0,
    this.chosenMicroAction,
    this.safeHarborActive = false,
  });

  BrainFogSosState copyWith({
    bool? isOpen,
    int? activeQuestionIndex,
    String? chosenMicroAction,
    bool? safeHarborActive,
  }) {
    return BrainFogSosState(
      isOpen: isOpen ?? this.isOpen,
      activeQuestionIndex: activeQuestionIndex ?? this.activeQuestionIndex,
      chosenMicroAction: chosenMicroAction ?? this.chosenMicroAction,
      safeHarborActive: safeHarborActive ?? this.safeHarborActive,
    );
  }
}

