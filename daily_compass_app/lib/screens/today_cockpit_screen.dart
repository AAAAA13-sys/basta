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
        titleSpacing: 16,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '🧭 Daily Compass',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.bambooSage.withOpacity(0.15),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text(
                'Pinoy',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openAddExpenseSheet(context),
        backgroundColor: AppColors.bambooSage,
        foregroundColor: AppColors.textInverse,
        icon: const Icon(Icons.add_rounded, size: 20),
        label: const Text(
          'Mag-Log',
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
        ),
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
              const Expanded(
                child: Row(
                  children: [
                    Text('🚐', style: TextStyle(fontSize: 18)),
                    SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        'Byahe Tracker',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.manilaSkyBlue,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Beep Card Interactive Mini Badge
              InkWell(
                onTap: () => _openBeepTopUpSheet(context),
                borderRadius: BorderRadius.circular(8),
                child: Container(
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
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Beep: ₱${beep.balance.toStringAsFixed(0)} (${beep.estimatedRidesRemaining} rides)',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: beep.isLowBalance ? AppColors.jeepneyCoral : AppColors.beepMint,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.add_circle_outline_rounded,
                        size: 13,
                        color: beep.isLowBalance ? AppColors.jeepneyCoral : AppColors.beepMint,
                      ),
                    ],
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
              const Expanded(
                child: Row(
                  children: [
                    Text('🤝', style: TextStyle(fontSize: 18)),
                    SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        'KKB & Abono ("Ako Muna")',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.gcashCyan,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  Text(
                    'May Utang: ₱${state.totalOwedToMe.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: AppColors.bambooSage,
                    ),
                  ),
                  const SizedBox(width: 6),
                  InkWell(
                    onTap: () => _openAddAbonoSheet(context),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.gcashCyan.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.add_rounded, size: 14, color: AppColors.gcashCyan),
                          Text(
                            'Add',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: AppColors.gcashCyan,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
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
                  if (isPending) ...[
                    IconButton(
                      icon: const Icon(Icons.copy_rounded, size: 15, color: AppColors.gcashCyan),
                      tooltip: 'Copy reminder message for Messenger',
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () {
                        HapticFeedback.selectionClick();
                        final reminder = abono.generateFriendlyReminder(
                          myName: 'Ivan',
                          myGcashNumber: '0917-XXX-XXXX',
                        );
                        Clipboard.setData(ClipboardData(text: reminder));
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Copied friendly reminder for ${abono.debtorName}! 💬'),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 6),
                    TextButton(
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        widget.store.settleAbono(abono.id, AbonoStatus.paidGCash);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${abono.debtorName} marked Paid via GCash! ✓'),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      style: TextButton.styleFrom(
                        backgroundColor: AppColors.gcashCyan.withOpacity(0.15),
                        foregroundColor: AppColors.gcashCyan,
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        minimumSize: Size.zero,
                      ),
                      child: const Text('Paid', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
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

  void _openBeepTopUpSheet(BuildContext context) {
    final beep = widget.store.state.beepCard;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.bgCardElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Text('💳', style: TextStyle(fontSize: 20)),
                      SizedBox(width: 8),
                      Text(
                        'Beep Card Reload Telemetry',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.beepMint,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A3A), Color(0xFF152A2A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.beepMint.withOpacity(0.4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'beep™',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: AppColors.beepMint,
                          ),
                        ),
                        Text(
                          'LRT-1 • LRT-2 • MRT-3 • BGC Bus',
                          style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '₱${beep.balance.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                        color: AppColors.beepMint,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '~${beep.estimatedRidesRemaining} train rides remaining • Last: ${beep.lastTapStation ?? "Cubao"}',
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                'Mabilisang Dagdag (Quick Top-Up):',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 8),

              Wrap(
                spacing: 8,
                children: [50, 100, 200, 500].map((amt) {
                  return ActionChip(
                    backgroundColor: AppColors.bgCanvas,
                    side: const BorderSide(color: AppColors.beepMint),
                    label: Text(
                      '+₱$amt',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.beepMint,
                      ),
                    ),
                    onPressed: () {
                      HapticFeedback.lightImpact();
                      widget.store.updateBeepCardBalance(beep.balance + amt);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Reloaded +₱$amt to Beep Card! Bagong Balanse: ₱${(beep.balance + amt).toStringAsFixed(0)}'),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
            ],
          ),
        );
      },
    );
  }

  void _openAddAbonoSheet(BuildContext context) {
    final nameCtrl = TextEditingController();
    final occasionCtrl = TextEditingController();
    final amountCtrl = TextEditingController();
    final gcashCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.bgCardElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Text('🤝', style: TextStyle(fontSize: 20)),
                      SizedBox(width: 8),
                      Text(
                        'Bagong Abono ("Ako Muna")',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.gcashCyan,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameCtrl,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Pangalan ng May Utang (e.g. Ken, Bea, Mark)',
                  labelStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  filled: true,
                  fillColor: AppColors.bgCanvas,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: occasionCtrl,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Saan Ginastos (e.g. Mang Inasal lunch, Coffee)',
                  labelStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  filled: true,
                  fillColor: AppColors.bgCanvas,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: amountCtrl,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  labelText: 'Halaga (₱)',
                  prefixText: '₱ ',
                  labelStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  filled: true,
                  fillColor: AppColors.bgCanvas,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                onPressed: () {
                  final name = nameCtrl.text.trim();
                  final occasion = occasionCtrl.text.trim();
                  final amt = double.tryParse(amountCtrl.text.trim()) ?? 0.0;
                  if (name.isEmpty || amt <= 0) return;

                  HapticFeedback.lightImpact();
                  widget.store.addAbono(
                    debtorName: name,
                    occasion: occasion.isEmpty ? 'Pinasabay' : occasion,
                    amount: amt,
                    gcashNumber: gcashCtrl.text.trim().isNotEmpty ? gcashCtrl.text.trim() : null,
                  );
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Nailista si $name para sa ₱${amt.toStringAsFixed(2)}! 📝'),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                icon: const Icon(Icons.check_rounded),
                label: const Text('Ilista ang Abono', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.gcashCyan,
                  foregroundColor: AppColors.textPrimary,
                  minimumSize: const Size.fromHeight(44),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _openAddExpenseSheet(BuildContext context) {
    final amtCtrl = TextEditingController();
    final noteCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.bgCardElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Text('💸', style: TextStyle(fontSize: 20)),
                      SizedBox(width: 8),
                      Text(
                        'Mag-Log ng Gastos',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.bambooSage,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              const Text(
                'Piliin ang karaniwang bilihin:',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 8),

              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: [
                  {'icon': '🚐', 'label': 'Jeep', 'amt': 15.0},
                  {'icon': '🛺', 'label': 'Trike', 'amt': 25.0},
                  {'icon': '🚆', 'label': 'MRT', 'amt': 24.0},
                  {'icon': '🍗', 'label': 'Jollijeep', 'amt': 60.0},
                  {'icon': '🍲', 'label': 'Karinderya', 'amt': 75.0},
                  {'icon': '🧋', 'label': 'Milktea', 'amt': 95.0},
                  {'icon': '🥤', 'label': 'Tubig', 'amt': 15.0},
                  {'icon': '🏪', 'label': 'Sari-Sari', 'amt': 40.0},
                ].map((item) {
                  return ActionChip(
                    backgroundColor: AppColors.bgCanvas,
                    side: const BorderSide(color: AppColors.borderSubtle),
                    avatar: Text(item['icon'] as String, style: const TextStyle(fontSize: 12)),
                    label: Text(
                      '${item['label']} ₱${(item['amt'] as double).toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                    ),
                    onPressed: () {
                      HapticFeedback.lightImpact();
                      widget.store.logExpense(item['amt'] as double, category: item['label'] as String);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Nai-record: ₱${(item['amt'] as double).toStringAsFixed(0)} para sa ${item['label']}!'),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 14),

              TextField(
                controller: amtCtrl,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 18),
                decoration: InputDecoration(
                  labelText: 'Ibang Halaga (Custom Amount ₱)',
                  prefixText: '₱ ',
                  labelStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  filled: true,
                  fillColor: AppColors.bgCanvas,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: noteCtrl,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: 'Deskripsyon (optional)',
                  labelStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  filled: true,
                  fillColor: AppColors.bgCanvas,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 14),

              ElevatedButton.icon(
                onPressed: () {
                  final amt = double.tryParse(amtCtrl.text.trim()) ?? 0.0;
                  if (amt <= 0) return;
                  final note = noteCtrl.text.trim();

                  HapticFeedback.lightImpact();
                  widget.store.logExpense(amt, category: 'Custom', note: note.isNotEmpty ? note : null);
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Nai-record: ₱${amt.toStringAsFixed(2)}!'),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                icon: const Icon(Icons.check_rounded),
                label: const Text('I-record ang Gastos', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.bambooSage,
                  foregroundColor: AppColors.textInverse,
                  minimumSize: const Size.fromHeight(44),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
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

