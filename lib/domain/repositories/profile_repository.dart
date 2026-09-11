import '../models/user_profile.dart';

abstract class ProfileRepository {
  Future<UserProfile> getUserProfile(String uid);
  Future<void> updateDisplayName(String uid, String newName);
  Future<void> claimDailyStreak(String uid);
  Future<List<String>> generateRecoveryPhrase(String uid);
  Future<bool> verifyRecoveryPhrase(String uid, List<String> phrase);
  Future<bool> hasCompletedRecoveryBackup(String uid);
}
