import '../../domain/models/ledger_entry.dart';
import '../../domain/repositories/ledger_repository.dart';
import '../datasources/mock_data_source.dart';

class LedgerRepositoryImpl implements LedgerRepository {
  final MockDataSource _dataSource;

  LedgerRepositoryImpl({required MockDataSource dataSource})
      : _dataSource = dataSource;

  @override
  Future<List<LedgerEntry>> getLedgerEntries(String uid) async {
    return _dataSource.getLedgerEntries(uid);
  }

  @override
  Future<double> getVerifiedBalance(String uid) async {
    return _dataSource.calculateVerifiedBalance(uid);
  }

  @override
  Future<double> getUnverifiedBalance(String uid) async {
    return _dataSource.calculateUnverifiedBalance(uid);
  }

  @override
  Future<double> getEligibleBalance(String uid) async {
    return _dataSource.calculateEligibleBalance(uid);
  }

  @override
  Future<LedgerEntry> recordTransaction({
    required String uid,
    required String refKey,
    required LedgerCategory category,
    required String description,
    required double amount,
    Map<String, dynamic>? metadata,
  }) async {
    return _dataSource.recordTransaction(
      uid: uid,
      refKey: refKey,
      category: category,
      description: description,
      amount: amount,
      metadata: metadata,
    );
  }
}
