import 'package:flutter_test/flutter_test.dart';
import '../lib/models/petsa_model.dart';
import '../lib/models/byahe_model.dart';
import '../lib/models/kkb_abono_model.dart';
import '../lib/models/sari_sari_model.dart';
import '../lib/models/somatic_model.dart';
import '../lib/providers/compass_state.dart';

void main() {
  group('Petsa de Peligro & Pamasahe Reserve Suite', () {
    test('Calculates untouchable pamasahe reserve and pwede gastusin accurately', () {
      final state = PetsaDePeligroState(
        cashOnHand: 500.0,
        gcashBalance: 800.0,
        mayaBalance: 150.0, // Total = ₱1,450.00
        dailyCommuteBenchmark: 70.0,
        cycle: PetsaCycle.quincena1530,
        pendingBills: [
          const PendingFixedBill(
            id: 'bill-1',
            title: 'Water refill',
            amount: 35.0,
            dueDate: '2026-11-10',
          ),
          const PendingFixedBill(
            id: 'bill-2',
            title: 'Phone Load',
            amount: 50.0,
            dueDate: '2026-11-12',
          ),
        ], // Total bills = ₱85.00
        expensesLoggedToday: 0.0,
        now: DateTime(2026, 11, 11), // 4 days until 15th
      );

      expect(state.totalWalletBalance, equals(1450.0));
      expect(state.daysRemainingUntilPayday, equals(4));

      // Reserve = 4 days * ₱70 = ₱280.00
      expect(state.untouchablePamasaheReserve, equals(280.0));

      // Discretionary pool = 1450 - 280 - 85 = 1085.00
      expect(state.discretionaryPool, equals(1085.0));

      // Daily Safe-to-Spend = 1085 / 4 = 271.25
      expect(state.pwedeGastusinToday, equals(271.25));
      expect(state.severity, equals(PetsaSeverity.ayosPa));
    });

    test('Transitions to petsaDePeligro when safe daily spend falls below ₱80', () {
      final state = PetsaDePeligroState(
        cashOnHand: 100.0,
        gcashBalance: 150.0,
        mayaBalance: 50.0, // Total = ₱300.00
        dailyCommuteBenchmark: 40.0,
        cycle: PetsaCycle.quincena1530,
        pendingBills: [],
        expensesLoggedToday: 0.0,
        now: DateTime(2026, 11, 11), // 4 days until 15th (Reserve = 4 * 40 = ₱160)
      );

      // Discretionary = 300 - 160 = ₱140
      // Daily safe = 140 / 4 = ₱35/day (< ₱80)
      expect(state.pwedeGastusinToday, equals(35.0));
      expect(state.severity, equals(PetsaSeverity.petsaDePeligro));
    });
  });

  group('Byahe & Commute Module Suite', () {
    test('Beep card accurately detects low balance threshold (< ₱50)', () {
      final dummyDate = DateTime(2026, 11, 5);
      final cardNormal = BeepCard(
        balance: 78.0,
        lastTapStation: 'MRT Cubao',
        lastUpdated: dummyDate,
      );
      expect(cardNormal.isLowBalance, isFalse);
      expect(cardNormal.estimatedRidesRemaining, equals(3));

      final cardLow = BeepCard(
        balance: 32.0,
        lastTapStation: 'MRT Ayala',
        lastUpdated: dummyDate,
      );
      expect(cardLow.isLowBalance, isTrue);
      expect(cardLow.estimatedRidesRemaining, equals(1));
    });

    test('Store handles commute leg completion and deducts fare correctly', () {
      final store = CompassStore();
      final initialCash = store.state.petsa.cashOnHand;
      final initialBeep = store.state.beepCard.balance;

      // Leg 1 is tricycle (₱25)
      store.toggleCommuteLeg('leg-1');
      expect(store.state.commuteLegs[0].isCompleted, isTrue);
      expect(store.state.petsa.cashOnHand, equals(initialCash - 25.0));
      expect(store.state.petsa.expensesLoggedToday, equals(25.0));

      // Leg 2 is MRT-3 (₱24)
      store.toggleCommuteLeg('leg-2');
      expect(store.state.commuteLegs[1].isCompleted, isTrue);
      expect(store.state.beepCard.balance, equals(initialBeep - 24.0));
    });
  });

  group('KKB & Abono Module Suite', () {
    test('Generates polite GCash reminder without social friction', () {
      final abono = AbonoItem(
        id: 'ab-1',
        debtorName: 'Mark',
        occasion: 'Jollijeep Sisig',
        amount: 85.0,
        createdAt: DateTime(2026, 11, 5),
      );

      final reminder = abono.generateFriendlyReminder(
        myName: 'Ivan',
        myGcashNumber: '0917-123-4567',
      );

      expect(reminder, contains('Mark'));
      expect(reminder, contains('₱85.00'));
      expect(reminder, contains('Jollijeep Sisig'));
      expect(reminder, contains('0917-123-4567'));
      expect(reminder, contains('Ivan'));
    });

    test('Store updates Abono status upon settlement', () {
      final store = CompassStore();
      final initialOwed = store.state.totalOwedToMe;

      expect(initialOwed, greaterThan(0));

      // Settle first item via GCash
      final firstItemId = store.state.abonoList.first.id;
      store.settleAbono(firstItemId, AbonoStatus.paidGCash);

      final settledItem = store.state.abonoList.firstWhere((a) => a.id == firstItemId);
      expect(settledItem.status, equals(AbonoStatus.paidGCash));
      expect(settledItem.settledAt, isNotNull);
      expect(store.state.totalOwedToMe, lessThan(initialOwed));
    });
  });

  group('Somatic Pacing & Philippine Rhythm Suite', () {
    test('Matches 24h clock to appropriate Philippine routine slot', () {
      final store = CompassStore();

      // 07:00 -> Agahan
      store.updateCurrentTime(DateTime(2026, 11, 5, 7, 0));
      expect(store.state.activeRoutineSlot, equals(PinoyRoutineSlot.agahan));
      expect(store.state.activeRoutineSlot.tagalogLabel, contains('Almusal / Agahan'));

      // 12:30 -> Tanghalian
      store.updateCurrentTime(DateTime(2026, 11, 5, 12, 30));
      expect(store.state.activeRoutineSlot, equals(PinoyRoutineSlot.tanghalian));

      // 16:00 -> Merienda
      store.updateCurrentTime(DateTime(2026, 11, 5, 16, 0));
      expect(store.state.activeRoutineSlot, equals(PinoyRoutineSlot.merienda));

      // 21:00 -> Pahinga
      store.updateCurrentTime(DateTime(2026, 11, 5, 21, 0));
      expect(store.state.activeRoutineSlot, equals(PinoyRoutineSlot.pahinga));
    });

    test('Hydration tracker increments glasses and milliliters', () {
      final store = CompassStore();
      final initialGlasses = store.state.waterTracker.glassesConsumedToday;

      store.drinkGlassOfWater();
      expect(store.state.waterTracker.glassesConsumedToday, equals(initialGlasses + 1));
      expect(store.state.waterTracker.millilitersDrank, equals((initialGlasses + 1) * 250));

      store.drinkTumblerOfWater();
      expect(store.state.waterTracker.glassesConsumedToday, equals(initialGlasses + 3));
    });

    test('Brain Fog SOS modal navigates through 3 steps to Safe Harbor', () {
      final store = CompassStore();

      store.openBrainFogSos();
      expect(store.state.brainFogState.isOpen, isTrue);
      expect(store.state.brainFogState.activeQuestionIndex, equals(0));

      store.nextBrainFogStep();
      expect(store.state.brainFogState.activeQuestionIndex, equals(1));

      store.nextBrainFogStep();
      expect(store.state.brainFogState.activeQuestionIndex, equals(2));

      store.nextBrainFogStep();
      expect(store.state.brainFogState.isOpen, isFalse);
      expect(store.state.brainFogState.safeHarborActive, isTrue);
    });
  });
}
