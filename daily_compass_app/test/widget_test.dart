import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../lib/main.dart';
import '../lib/providers/compass_state.dart';

void main() {
  testWidgets('Daily Compass Pinoy UI Smoke and Interaction Test', (WidgetTester tester) async {
    // Set realistic mobile phone viewport (e.g. 1080x2400 modern Android/iOS)
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final store = CompassStore();

    // Pump the app
    await tester.pumpWidget(DailyCompassPinoyApp(store: store));
    await tester.pumpAndSettle();

    // 1. Verify Header & Badges
    expect(find.text('🧭 Daily Compass'), findsOneWidget);
    expect(find.text('Pinoy Edition'), findsOneWidget);
    expect(find.text('Pahinga Muna'), findsOneWidget);

    // 2. Verify Petsa de Peligro Card & Pamasahe Vault
    expect(find.text('Petsa de Peligro Cockpit'), findsOneWidget);
    expect(find.text('Untouchable Pamasahe Reserve:'), findsOneWidget);
    expect(find.textContaining('Pwede Gastusin Ngayon'), findsOneWidget);

    // 3. Verify Quick Log Pills
    expect(find.text('₱15 Jeep'), findsOneWidget);
    expect(find.text('₱60 Jollijeep'), findsOneWidget);

    // 4. Tap "+ ₱15 Jeep" pill and verify state changes
    final initialCash = store.state.petsa.cashOnHand;
    await tester.tap(find.text('₱15 Jeep'));
    await tester.pump(); // Triggers SnackBar and state update

    expect(store.state.petsa.expensesLoggedToday, equals(15.0));
    expect(store.state.petsa.cashOnHand, equals(initialCash - 15.0));

    // 5. Verify Multi-Leg Commute Tracker & Beep Card
    expect(find.text('Multi-Leg Byahe Tracker'), findsOneWidget);
    expect(find.textContaining('Beep:'), findsOneWidget);
    expect(find.textContaining('Payong (Umbrella)'), findsOneWidget);

    // 6. Verify KKB & Abono Section
    expect(find.text('KKB & Abono ("Ako Muna")'), findsOneWidget);

    // 7. Verify 5-Gallon Blue Jug & Hydration Section
    expect(find.text('5-Gallon Blue Jug & Hydration'), findsOneWidget);
    expect(find.text('+1 Baso (250ml)'), findsOneWidget);

    // Tap +1 Baso
    final initialGlasses = store.state.waterTracker.glassesConsumedToday;
    await tester.tap(find.text('+1 Baso (250ml)'));
    await tester.pump();
    expect(store.state.waterTracker.glassesConsumedToday, equals(initialGlasses + 1));

    // 8. Test "Pahinga Muna" Emergency Reset Modal
    await tester.tap(find.text('Pahinga Muna'));
    await tester.pumpAndSettle();

    // Verify modal is visible
    expect(find.text('Pahinga Muna, Dahan-Dahan Lang'), findsOneWidget);
    expect(find.text('Hakbang 1: Kamusta ang Katawan Mo?'), findsOneWidget);

    // Step 1: Drink cold water
    await tester.tap(find.text('Uminom na ako ng tubig 💧'));
    await tester.pumpAndSettle();

    // Step 2: Environment
    expect(find.text('Hakbang 2: Kamusta ang Paligid?'), findsOneWidget);
    await tester.tap(find.text('Tahimik na ang paligid 🎧'));
    await tester.pumpAndSettle();

    // Step 3: Gentle micro-action
    expect(find.text('Hakbang 3: Isang Malumanay na Hakbang'), findsOneWidget);
    await tester.tap(find.text('Ipikit ang mata nang 5 minuto 😴'));
    await tester.pumpAndSettle();

    // Modal dismissed, Safe Harbor active
    expect(store.state.brainFogState.safeHarborActive, isTrue);
  });
}
