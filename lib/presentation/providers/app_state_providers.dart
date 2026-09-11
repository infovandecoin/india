import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/reward_constants.dart';
import '../../domain/models/user_profile.dart';
import '../../domain/models/ledger_entry.dart';
import '../../domain/models/mining_session.dart';
import '../../domain/models/network_member.dart';
import '../../domain/models/referral_data.dart';
import 'core_providers.dart';

// Theme Mode Provider
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.dark);

// Auth State Controller
class AuthStateNotifier extends StateNotifier<AsyncValue<UserProfile?>> {
  final Ref _ref;

  AuthStateNotifier(this._ref) : super(const AsyncValue.loading()) {
    checkCurrentUser();
  }

  Future<void> checkCurrentUser() async {
    try {
      final repo = _ref.read(authRepositoryProvider);
      final user = await repo.getCurrentUser();
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final repo = _ref.read(authRepositoryProvider);
      final user = await repo.loginWithEmail(email, password);
      state = AsyncValue.data(user);
      _ref.invalidate(ledgerEntriesProvider);
      _ref.invalidate(activeMiningSessionProvider);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String displayName,
    String? referralCode,
  }) async {
    state = const AsyncValue.loading();
    try {
      final repo = _ref.read(authRepositoryProvider);
      final user = await repo.registerWithEmail(
        email: email,
        password: password,
        displayName: displayName,
        referralCode: referralCode,
      );
      state = AsyncValue.data(user);
      _ref.invalidate(ledgerEntriesProvider);
      _ref.invalidate(activeMiningSessionProvider);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> logout() async {
    final repo = _ref.read(authRepositoryProvider);
    await repo.logout();
    state = const AsyncValue.data(null);
  }
}

final authStateProvider =
    StateNotifierProvider<AuthStateNotifier, AsyncValue<UserProfile?>>((ref) {
  return AuthStateNotifier(ref);
});

// Ledger Entries Provider
final ledgerEntriesProvider = FutureProvider<List<LedgerEntry>>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) return [];
  final repo = ref.watch(ledgerRepositoryProvider);
  return repo.getLedgerEntries(user.uid);
});

// Balances
final verifiedBalanceProvider = FutureProvider<double>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) return 0.0;
  final repo = ref.watch(ledgerRepositoryProvider);
  return repo.getVerifiedBalance(user.uid);
});

final unverifiedBalanceProvider = FutureProvider<double>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) return 0.0;
  final repo = ref.watch(ledgerRepositoryProvider);
  return repo.getUnverifiedBalance(user.uid);
});

final eligibleBalanceProvider = FutureProvider<double>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) return 0.0;
  final repo = ref.watch(ledgerRepositoryProvider);
  return repo.getEligibleBalance(user.uid);
});

// Active Mining Session Provider
class MiningSessionNotifier extends StateNotifier<AsyncValue<MiningSession?>> {
  final Ref _ref;

  MiningSessionNotifier(this._ref) : super(const AsyncValue.loading()) {
    loadSession();
  }

  Future<void> loadSession() async {
    final auth = _ref.read(authStateProvider);
    final user = auth.value;
    if (user == null) {
      state = const AsyncValue.data(null);
      return;
    }
    try {
      final repo = _ref.read(miningRepositoryProvider);
      final session = await repo.getActiveSession(user.uid);
      state = AsyncValue.data(session);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> startMining() async {
    final auth = _ref.read(authStateProvider);
    final user = auth.value;
    if (user == null) return;

    try {
      final repo = _ref.read(miningRepositoryProvider);
      final members = await _ref.read(circleMembersProvider.future);
      final activeCircleCount = members.where((m) => m.isActive).length;
      final circleBonus = activeCircleCount * RewardConstants.circleBonusPerMemberPerHour;
      final streakBonus = (user.streakDays ~/ 5) * 0.01;

      final session = await repo.startSession(
        uid: user.uid,
        baseRate: RewardConstants.baseMiningRatePerHour,
        streakBonus: streakBonus,
        circleBonus: circleBonus,
      );
      state = AsyncValue.data(session);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<double> settleMining() async {
    final auth = _ref.read(authStateProvider);
    final user = auth.value;
    if (user == null) return 0.0;

    try {
      final repo = _ref.read(miningRepositoryProvider);
      final earned = await repo.settleSession(user.uid);
      state = const AsyncValue.data(null);
      _ref.invalidate(ledgerEntriesProvider);
      _ref.invalidate(verifiedBalanceProvider);
      return earned;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

final activeMiningSessionProvider =
    StateNotifierProvider<MiningSessionNotifier, AsyncValue<MiningSession?>>((ref) {
  return MiningSessionNotifier(ref);
});

// Circle Members Provider
final circleMembersProvider = FutureProvider<List<NetworkMember>>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) return [];
  final repo = ref.watch(referralRepositoryProvider);
  return repo.getCircleMembers(user.uid);
});

// Referral Data Provider
final referralDataProvider = FutureProvider<ReferralData>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) {
    return const ReferralData(
      referralCode: 'VDC-PIONEER',
      totalInvited: 0,
      verifiedInvited: 0,
      totalVdcEarned: 0.0,
      shareLink: 'https://vandecoin.network',
    );
  }
  final repo = ref.watch(referralRepositoryProvider);
  return repo.getReferralData(user.uid);
});
