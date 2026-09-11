import '../../core/services/biometric_service.dart';
import '../../core/services/storage_service.dart';
import '../../domain/models/user_profile.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/mock_data_source.dart';

class AuthRepositoryImpl implements AuthRepository {
  final MockDataSource _dataSource;
  final StorageService _storage;
  final BiometricService _biometrics;

  AuthRepositoryImpl({
    required MockDataSource dataSource,
    required StorageService storage,
    required BiometricService biometrics,
  })  : _dataSource = dataSource,
        _storage = storage,
        _biometrics = biometrics;

  @override
  Future<UserProfile?> getCurrentUser() async {
    final cachedUid = await _storage.readSecure('current_uid');
    if (cachedUid == null) return null;
    return _dataSource.currentUser;
  }

  @override
  Future<UserProfile> loginWithEmail(String email, String password) async {
    final user = await _dataSource.loginWithEmail(email, password);
    await _storage.writeSecure('current_uid', user.uid);
    await _storage.writeSecure('user_email', email);
    return user;
  }

  @override
  Future<UserProfile> registerWithEmail({
    required String email,
    required String password,
    required String displayName,
    String? referralCode,
  }) async {
    final user = await _dataSource.registerWithEmail(
      email: email,
      password: password,
      displayName: displayName,
      referralCode: referralCode,
    );
    await _storage.writeSecure('current_uid', user.uid);
    await _storage.writeSecure('user_email', email);
    return user;
  }

  @override
  Future<void> sendPhoneOtp(String phoneNumber) async {
    await Future.delayed(const Duration(milliseconds: 500));
    // Simulated OTP dispatched
  }

  @override
  Future<UserProfile> verifyPhoneOtp(String phoneNumber, String otp) async {
    await Future.delayed(const Duration(milliseconds: 400));
    if (otp.length != 6) {
      throw Exception('Invalid verification code. Please enter 6 digits.');
    }
    final emailFromPhone = '$phoneNumber@vandecoin.network';
    return await loginWithEmail(emailFromPhone, 'phone-otp-auth');
  }

  @override
  Future<bool> authenticateBiometric() async {
    return await _biometrics.authenticate(
      reason: 'Authenticate with biometrics to unlock your VandeCoin wallet',
    );
  }

  @override
  Future<void> logout() async {
    await _dataSource.logout();
    await _storage.deleteSecure('current_uid');
  }
}
