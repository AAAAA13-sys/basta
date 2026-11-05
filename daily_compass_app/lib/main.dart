import 'package:flutter/material.dart';
import 'providers/compass_state.dart';
import 'screens/today_cockpit_screen.dart';
import 'theme/app_colors.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final store = CompassStore();
  runApp(DailyCompassPinoyApp(store: store));
}

class DailyCompassPinoyApp extends StatelessWidget {
  final CompassStore store;

  const DailyCompassPinoyApp({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Daily Compass Pinoy',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.bgCanvas,
        colorScheme: AppColors.darkColorScheme,
        cardColor: AppColors.bgCard,
        dividerColor: AppColors.borderSubtle,
        fontFamily: 'Inter',
        useMaterial3: true,
      ),
      home: TodayCockpitScreen(store: store),
    );
  }
}
