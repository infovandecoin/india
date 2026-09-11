import '../models/ledger_entry.dart';

abstract class LedgerRepository {
  Future<List<LedgerEntry>> getLedgerEntries(String uid);
  Future<double> getVerifiedBalance(String uid);
  Future<double> getUnverifiedBalance(String uid);
  Future<double> getEligibleBalance(String uid);
  Future<LedgerEntry> recordTransaction({
    required String uid,
    required String refKey,
    required LedgerCategory category,
    required String description,
    required double amount,
    Map<String, dynamic>? metadata,
  });
}
