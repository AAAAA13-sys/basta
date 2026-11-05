import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/petsa_model.dart';
import '../models/byahe_model.dart';
import '../models/kkb_abono_model.dart';
import '../models/sari_sari_model.dart';
import '../models/somatic_model.dart';
import '../providers/compass_state.dart';
import '../theme/app_colors.dart';

class TodayCockpitScreen extends StatefulWidget {
  final CompassStore store;

  const TodayCockpitScreen({super.key, required this.store});

  @override
  State<TodayCockpitScreen> createState() => _TodayCockpitScreenState();
}

class _TodayCockpitScreenState extends State<TodayCockpitScreen> {
  @override
  void initState() {
    super.initState();
    widget.store.addListener(_onStoreChanged);
  }

  @override
  void dispose() {
    widget.store.removeListener(_onStoreChanged);
    super.dispose();
  }

  void _onStoreChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final state = widget.store.state;
    final petsa = state.petsa;
    final routine = state.activeRoutineSlot;

    return Scaffold(
      backgroundColor: AppColors.bgCanvas,
      appBar: AppBar(
        backgroundColor: AppColors.bgCanvas,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.manilaSkyBlue.withOpacity(0.18),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.manilaSkyBlue.withOpacity(0.4)),
              ),
              child: const Text(
                '🧭 Daily Compass',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.bambooSage.withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'Pinoy Edition',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.bambooSage,
                ),
              ),
            ),
          ],
        ),
        actions: [
          // 1-Tap Brain Fog SOS Trigger Button
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: TextButton.icon(
              onPressed: () => _openBrainFogSosSheet(context),
              style: TextButton.styleFrom(
                backgroundColor: AppColors.bambooSage.withOpacity(0.15),
                foregroundColor: AppColors.bambooSageSoft,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: const BorderSide(color: AppColors.bambooSage, width: 1),
                ),
              ),
              icon: const Text('🌿', style: TextStyle(fontSize: 14)),
              label: const Text(
                'Pahinga Muna',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          children: [
            // --- TOP CLOCK & ROUTINE ANCHOR ---
            _buildClockRoutineBanner(routine),
            const SizedBox(height: 16),

            // --- PETSA DE PELIGRO & PAMASAHE VAULT ---
            _buildPetsaDePeligroCard(petsa),
            const SizedBox(height: 16),

            // --- MULTI-LEG BYAHE & BEEP CARD ---
            _buildByaheCommuteCard(state),
            const SizedBox(height: 16),

            // --- ABONO & KKB SPLIT TRACKER ---
            _buildKkbAbonoCard(state),
            const SizedBox(height: 16),

            // --- SARI-SARI STORE & LISTA TAB ---
            _buildSariSariListaCard(state),
            const SizedBox(height: 16),

            // --- 5-GALLON WATER DISPENSER & HYDRATION ---
            _buildWaterHydrationCard(state),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // --- 1. Clock & Active Routine Anchor ---
  Widget _buildClockRoutineBanner(PinoyRoutineSlot routine) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                routine.tagalogLabel,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.calamansiAmber,
                ),
              ),
              Text(
                _formatCurrentTime(),
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            routine.guidanceMessage,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textPrimary,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }

  // --- 2. Petsa de Peligro & Pamasahe Vault Card ---
  Widget _buildPetsaDePeligroCard(PetsaDePeligroState petsa) {
    final severityColor = petsa.severity == PetsaSeverity.ayosPa
        ? AppColors.bambooSage
        : petsa.severity == PetsaSeverity.ingatLang
            ? AppColors.calamansiAmber
            : AppColors.jeepneyCoral;

    final severityLabel = petsa.severity == PetsaSeverity.ayosPa
        ? 'Ayos Pa (Safe)'
        : petsa.severity == PetsaSeverity.ingatLang
            ? 'Ingat Lang (Moderate)'
            : 'Petsa de Peligro Mode (Tight)';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: severityColor.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Text('💰', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 8),
                  Text(
                    'Petsa de Peligro Cockpit',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: severityColor,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: severityColor.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${petsa.daysRemainingUntilPayday}d until Payday',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: severityColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Untouchable Pamasahe Locked Vault
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.calamansiAmber.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.calamansiAmber.withOpacity(0.35)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Text('🔒', style: TextStyle(fontSize: 14)),
                    SizedBox(width: 6),
                    Text(
                      'Untouchable Pamasahe Reserve:',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.calamansiAmber,
                      ),
                    ),
                  ],
                ),
                Text(
                  '₱${petsa.untouchablePamasaheReserve.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: AppColors.calamansiAmber,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Main "Pwede Gastusin Ngayon" Metric
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Pwede Gastusin Ngayon (Daily Safe-to-Spend)',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '₱${petsa.pwedeGastusinToday.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: severityColor,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'Total Wallet',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '₱${petsa.totalWalletBalance.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),

          Text(
            'Status: $severityLabel',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: severityColor,
            ),
          ),
          const SizedBox(height: 14),

          // 1-Tap Quick Log Expense Pills
          const Text(
            'One-Tap Quick Log:',
            style: TextStyle(fontSize: 12, color: AppColors.textMuted),
          ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildQuickLogPill(15.0, '₱15 Jeep'),
              _buildQuickLogPill(25.0, '₱25 Trike'),
              _buildQuickLogPill(60.0, '₱60 Jollijeep'),
              _buildQuickLogPill(35.0, '₱35 Canteen Snack'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickLogPill(double amount, String label) {
    return InkWell(
      onTap: () {
        HapticFeedback.lightImpact();
        widget.store.logQuickExpense(amount, label);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Logged $label (-₱${amount.toStringAsFixed(0)})'),
            duration: const Duration(seconds: 1),
            backgroundColor: AppColors.bgCardElevated,
          ),
        );
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.bgCanvas,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ),
    );
  }

  // --- 3. Multi-Leg Byahe & Commute Card ---
  Widget _buildByaheCommuteCard(DailyCompassPinoyState state) {
    final beep = state.beepCard;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Text('🚐', style: TextStyle(fontSize: 18)),
                  SizedBox(width: 8),
                  Text(
                    'Multi-Leg Byahe Tracker',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.manilaSkyBlue,
                    ),
                  ),
                ],
              ),
              // Beep Card Mini Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: beep.isLowBalance
                      ? AppColors.jeepneyCoral.withOpacity(0.2)
                      : AppColors.beepMint.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: beep.isLowBalance ? AppColors.jeepneyCoral : AppColors.beepMint,
                  ),
                ),
                child: Text(
                  'Beep: ₱${beep.balance.toStringAsFixed(0)} (${beep.estimatedRidesRemaining} rides)',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: beep.isLowBalance ? AppColors.jeepneyCoral : AppColors.beepMint,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Commute Legs List
          ...state.commuteLegs.map((leg) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: InkWell(
                onTap: () {
                  HapticFeedback.selectionClick();
                  widget.store.toggleCommuteLeg(leg.id);
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    color: leg.isCompleted
                        ? AppColors.bambooSage.withOpacity(0.1)
                        : AppColors.bgCanvas,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: leg.isCompleted ? AppColors.bambooSage : AppColors.borderSubtle,
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(leg.mode.iconGlyph, style: const TextStyle(fontSize: 16)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              leg.title,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                decoration:
                                    leg.isCompleted ? TextDecoration.lineThrough : null,
                                color: leg.isCompleted
                                    ? AppColors.textMuted
                                    : AppColors.textPrimary,
                              ),
                            ),
                            if (leg.notes != null)
                              Text(
                                leg.notes!,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                          ],
                        ),
                      ),
                      Text(
                        leg.estimatedFare > 0
                            ? '₱${leg.estimatedFare.toStringAsFixed(0)}'
                            : 'Free',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: leg.isCompleted
                              ? AppColors.bambooSage
                              : AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Icon(
                        leg.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                        size: 18,
                        color: leg.isCompleted
                            ? AppColors.bambooSage
                            : AppColors.textMuted,
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),

          const SizedBox(height: 8),

          // EDC Survival Checklist (Payong, Bimpo, Barya)
          const Text(
            'Byahe EDC Survival Kit:',
            style: TextStyle(fontSize: 12, color: AppColors.textMuted),
          ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: state.survivalKit.map((item) {
              return InkWell(
                onTap: () {
                  HapticFeedback.selectionClick();
                  widget.store.toggleSurvivalItem(item.id);
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: item.isChecked
                        ? AppColors.bambooSage.withOpacity(0.15)
                        : AppColors.bgCanvas,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: item.isChecked ? AppColors.bambooSage : AppColors.borderSubtle,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(item.icon, style: const TextStyle(fontSize: 12)),
                      const SizedBox(width: 4),
                      Text(
                        item.name,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: item.isChecked
                              ? AppColors.bambooSageSoft
                              : AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // --- 4. Abono & KKB Split Tracker Card ---
  Widget _buildKkbAbonoCard(DailyCompassPinoyState state) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Text('🤝', style: TextStyle(fontSize: 18)),
                  SizedBox(width: 8),
                  Text(
                    'KKB & Abono ("Ako Muna")',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.gcashCyan,
                    ),
                  ),
                ],
              ),
              Text(
                'May Utang: ₱${state.totalOwedToMe.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.bambooSage,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          ...state.abonoList.take(3).map((abono) {
            final isPending = abono.status == AbonoStatus.pending;
            return Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${abono.debtorName} (${abono.occasion})',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: isPending ? AppColors.textPrimary : AppColors.textMuted,
                          ),
                        ),
                        Text(
                          abono.status.label,
                          style: TextStyle(
                            fontSize: 11,
                            color: isPending ? AppColors.calamansiAmber : AppColors.bambooSage,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '₱${abono.amount.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: isPending ? AppColors.textPrimary : AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(width: 8),
                  if (isPending)
                    TextButton(
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        final reminder = abono.generateFriendlyReminder(
                          myName: 'Ivan',
                          myGcashNumber: '0917-XXX-XXXX',
                        );
                        Clipboard.setData(ClipboardData(text: reminder));
                        widget.store.settleAbono(abono.id, AbonoStatus.paidGCash);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Marked Paid via GCash & reminder copied!'),
                            duration: Duration(seconds: 2),
                          ),
                        );
                      },
                      style: TextButton.styleFrom(
                        backgroundColor: AppColors.gcashCyan.withOpacity(0.15),
                        foregroundColor: AppColors.gcashCyan,
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        minimumSize: Size.zero,
                      ),
                      child: const Text('Paid GCash', style: TextStyle(fontSize: 11)),
                    ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // --- 5. Sari-Sari Store Lista Card ---
  Widget _buildSariSariListaCard(DailyCompassPinoyState state) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Text('🏪', style: TextStyle(fontSize: 18)),
                  SizedBox(width: 8),
                  Text(
                    'Sari-Sari Store Lista',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.mayaViolet,
                    ),
                  ),
                ],
              ),
              Text(
                'Lista Total: ₱${state.totalSariSariLista.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.mayaViolet,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          ...state.sariSariList.map((item) {
            return Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.storeName,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      Text(
                        item.itemsList,
                        style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                Text(
                  '₱${item.amount.toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                ),
              ],
            );
          }),
        ],
      ),
    );
  }

  // --- 6. 5-Gallon Water Refill & Hydration Card ---
  Widget _buildWaterHydrationCard(DailyCompassPinoyState state) {
    final water = state.waterTracker;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Text('💧', style: TextStyle(fontSize: 18)),
                  SizedBox(width: 8),
                  Text(
                    '5-Gallon Blue Jug & Hydration',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.beepMint,
                    ),
                  ),
                ],
              ),
              Text(
                '${water.glassesConsumedToday}/8 Glasses (${water.millilitersDrank}ml)',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Water jug refill status
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: water.needsRefillSoon
                  ? AppColors.jeepneyCoral.withOpacity(0.15)
                  : AppColors.bgCanvas,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  water.needsRefillSoon
                      ? '⚠️ ${water.daysLeftInJug} araw na lang sa jug — Magpa-refill na!'
                      : '✅ May ~${water.daysLeftInJug} araw pa bago maubos ang 5-gal jug.',
                  style: TextStyle(
                    fontSize: 12,
                    color: water.needsRefillSoon
                        ? AppColors.jeepneyCoral
                        : AppColors.textSecondary,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    widget.store.refillWaterJug();
                  },
                  child: const Text('Refill Reset', style: TextStyle(fontSize: 11)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Action buttons: +1 Glass / +1 Tumbler
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    widget.store.drinkGlassOfWater();
                  },
                  icon: const Text('🥛', style: TextStyle(fontSize: 14)),
                  label: const Text('+1 Baso (250ml)', style: TextStyle(fontSize: 12)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    widget.store.drinkTumblerOfWater();
                  },
                  icon: const Text('🫗', style: TextStyle(fontSize: 14)),
                  label: const Text('+1 Tumbler (500ml)', style: TextStyle(fontSize: 12)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- 7. "Pahinga Muna" Brain Fog SOS Bottom Sheet ---
  void _openBrainFogSosSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.bgCardElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final currentStep = widget.store.state.brainFogState.activeQuestionIndex;

            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Text('🌿', style: TextStyle(fontSize: 20)),
                          SizedBox(width: 8),
                          Text(
                            'Pahinga Muna, Dahan-Dahan Lang',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: AppColors.bambooSage,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(ctx),
                        icon: const Icon(Icons.close, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  if (currentStep == 0) ...[
                    const Text(
                      'Hakbang 1: Kamusta ang Katawan Mo?',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Nabilad ka ba sa init ng byahe o trapik? Uminom ka muna ng malamig na tubig at punasan ang pawis gamit ang bimpo.',
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        widget.store.drinkGlassOfWater();
                        widget.store.nextBrainFogStep();
                        setModalState(() {});
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.bambooSage,
                        foregroundColor: AppColors.textInverse,
                        minimumSize: const Size.fromHeight(44),
                      ),
                      child: const Text('Uminom na ako ng tubig 💧'),
                    ),
                  ] else if (currentStep == 1) ...[
                    const Text(
                      'Hakbang 2: Kamusta ang Paligid?',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Masyado bang maingay o masikip ang paligid? Isuot ang earphones o magpahinga sa isang tahimik na sulok.',
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        widget.store.nextBrainFogStep();
                        setModalState(() {});
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.manilaSkyBlue,
                        foregroundColor: AppColors.textPrimary,
                        minimumSize: const Size.fromHeight(44),
                      ),
                      child: const Text('Tahimik na ang paligid 🎧'),
                    ),
                  ] else ...[
                    const Text(
                      'Hakbang 3: Isang Malumanay na Hakbang',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Huwag pilitin ang lahat ngayon. Pumili ng isang 2-minutong micro-action para makabawi ang lakas.',
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        widget.store.nextBrainFogStep();
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Safe Harbor activated: 30 minutes rest. Pahinga muna! 🌿'),
                            duration: Duration(seconds: 3),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.bambooSage,
                        foregroundColor: AppColors.textInverse,
                        minimumSize: const Size.fromHeight(44),
                      ),
                      child: const Text('Ipikit ang mata nang 5 minuto 😴'),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  String _formatCurrentTime() {
    final now = widget.store.state.currentTime;
    final hour = now.hour;
    final minute = now.minute.toString().padLeft(2, '0');
    final period = hour >= 12 ? 'PM' : 'AM';
    final formattedHour = hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    return '$formattedHour:$minute $period';
  }
}
