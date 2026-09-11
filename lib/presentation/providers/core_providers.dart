import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/biometric_service.dart';
import '../../core/services/storage_service.dart';
import '../../data/datasources/mock_data_source.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/ledger_repository_impl.dart';
import '../../data/repositories/mining_repository_impl.dart';
import '../../data/repositories/quiz_repository_impl.dart';
import '../../data/repositories/referral_repository_impl.dart';
import '../../data/repositories/profile_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/ledger_repository.dart';
import '../../domain/repositories/mining_repository.dart';
import '../../domain/repositories/quiz_repository.dart';
import '../../domain/repositories/referral_repository.dart';
import '../../domain/repositories/profile_repository.dart';

// Low-level dependencies
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences must be overridden in main()');
});

final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage();
});

final biometricServiceProvider = Provider<BiometricService>((ref) {
  return BiometricService();
});

final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService(
    secureStorage: ref.watch(secureStorageProvider),
    prefs: ref.watch(sharedPreferencesProvider),
  );
});

final mockDataSourceProvider = Provider<MockDataSource>((ref) {
  return MockDataSource();
});

// Repositories
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    dataSource: ref.watch(mockDataSourceProvider),
    storage: ref.watch(storageServiceProvider),
    biometrics: ref.watch(biometricServiceProvider),
  );
});

final ledgerRepositoryProvider = Provider<LedgerRepository>((ref) {
  return LedgerRepositoryImpl(
    dataSource: ref.watch(mockDataSourceProvider),
  );
});

final miningRepositoryProvider = Provider<MiningRepository>((ref) {
  return MiningRepositoryImpl(
    dataSource: ref.watch(mockDataSourceProvider),
  );
});

final quizRepositoryProvider = Provider<QuizRepository>((ref) {
  return QuizRepositoryImpl(
    dataSource: ref.watch(mockDataSourceProvider),
  );
});

final referralRepositoryProvider = Provider<ReferralRepository>((ref) {
  return ReferralRepositoryImpl(
    dataSource: ref.watch(mockDataSourceProvider),
  );
});

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepositoryImpl(
    dataSource: ref.watch(mockDataSourceProvider),
    storage: ref.watch(storageServiceProvider),
  );
});
