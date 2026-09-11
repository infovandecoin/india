import '../../core/constants/reward_constants.dart';
import '../../core/services/storage_service.dart';
import '../../domain/models/user_profile.dart';
import '../../domain/models/ledger_entry.dart';
import '../../domain/repositories/profile_repository.dart';
import '../datasources/mock_data_source.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final MockDataSource _dataSource;
  final StorageService _storage;

  ProfileRepositoryImpl({
    required MockDataSource dataSource,
    required StorageService storage,
  })  : _dataSource = dataSource,
        _storage = storage;

  @override
  Future<UserProfile> getUserProfile(String uid) async {
    final user = _dataSource.currentUser;
    if (user != null) return user;
    return UserProfile(
      uid: uid,
      displayName: 'Pioneer',
      referralCode: 'VDC-PIONEER-729',
      createdAt: DateTime.now(),
    );
  }

  @override
  Future<void> updateDisplayName(String uid, String newName) async {
    // In-memory update
  }

  @override
  Future<void> claimDailyStreak(String uid) async {
    final today = DateTime.now().toIso8601String().substring(0, 10);
    _dataSource.recordTransaction(
      uid: uid,
      refKey: 'streak-checkin-$today-$uid',
      category: LedgerCategory.streak,
      description: 'Daily Streak Check-in Reward',
      amount: RewardConstants.dailyCheckInReward,
    );
  }

  @override
  Future<List<String>> generateRecoveryPhrase(String uid) async {
    return _dataSource.generate12WordMnemonic(uid);
  }

  @override
  Future<bool> verifyRecoveryPhrase(String uid, List<String> phrase) async {
    if (phrase.length != 12) return false;
    final original = _dataSource.generate12WordMnemonic(uid);
    for (int i = 0; i < 12; i++) {
      if (phrase[i].trim().toLowerCase() != original[i].toLowerCase()) {
        return false;
      }
    }
    await _storage.setBool('backup_completed_$uid', true);
    return true;
  }

  @override
  Future<bool> hasCompletedRecoveryBackup(String uid) async {
    return _storage.getBool('backup_completed_$uid') ?? false;
  }
}
