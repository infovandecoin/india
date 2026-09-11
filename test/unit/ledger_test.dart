import 'package:flutter_test/flutter_test.dart';
import 'package:vandecoin_flutter/data/datasources/mock_data_source.dart';
import 'package:vandecoin_flutter/domain/models/ledger_entry.dart';

void main() {
  group('Authoritative Ledger Engine Tests', () {
    late MockDataSource dataSource;

    setUp(() {
      dataSource = MockDataSource();
    });

    test('Records transaction and calculates verified balance correctly', () {
      const uid = 'test-user-1';

      dataSource.recordTransaction(
        uid: uid,
        refKey: 'welcome-test-user-1',
        category: LedgerCategory.welcome,
        description: 'Welcome Bonus',
        amount: 25.0,
      );

      dataSource.recordTransaction(
        uid: uid,
        refKey: 'checkin-day-1',
        category: LedgerCategory.streak,
        description: 'Day 1 Check-in',
        amount: 1.0,
      );

      final balance = dataSource.calculateVerifiedBalance(uid);
      expect(balance, equals(26.0));

      final entries = dataSource.getLedgerEntries(uid);
      expect(entries.length, equals(2));
    });

    test('Enforces refKey idempotency and prevents duplicate reward claims', () {
      const uid = 'test-user-2';

      dataSource.recordTransaction(
        uid: uid,
        refKey: 'quiz-2026-09-11-test-user-2',
        category: LedgerCategory.quiz,
        description: 'Daily Quiz',
        amount: 5.0,
      );

      // Attempting to record duplicate transaction with identical refKey must throw
      expect(
        () => dataSource.recordTransaction(
          uid: uid,
          refKey: 'quiz-2026-09-11-test-user-2',
          category: LedgerCategory.quiz,
          description: 'Duplicate Daily Quiz',
          amount: 5.0,
        ),
        throwsA(isA<Exception>()),
      );
    });
  });
}
