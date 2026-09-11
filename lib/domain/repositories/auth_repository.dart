import '../models/user_profile.dart';

abstract class AuthRepository {
  Future<UserProfile?> getCurrentUser();
  Future<UserProfile> loginWithEmail(String email, String password);
  Future<UserProfile> registerWithEmail({
    required String email,
    required String password,
    required String displayName,
    String? referralCode,
  });
  Future<void> sendPhoneOtp(String phoneNumber);
  Future<UserProfile> verifyPhoneOtp(String phoneNumber, String otp);
  Future<bool> authenticateBiometric();
  Future<void> logout();
}
