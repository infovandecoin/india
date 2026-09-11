import 'package:flutter_test/flutter_test.dart';
import 'package:vandecoin_flutter/data/datasources/mock_data_source.dart';
import 'package:vandecoin_flutter/domain/models/mining_session.dart';

void main() {
  group('Proof-of-Participation (PoP) Mining Tests', () {
    late MockDataSource dataSource;

    setUp(() {
      dataSource = MockDataSource();
    });

    test('Computes 24-hour total rate with streak and circle bonuses', () {
      const uid = 'pioneer-mining-1';

      final session = dataSource.startMiningSession(
        uid: uid,
        baseRate: 0.20,
        streakBonus: 0.01,
        circleBonus: 0.06,
      );

      expect(session.baseRate, equals(0.20));
      expect(session.streakBonus, equals(0.01));
      expect(session.circleBonus, equals(0.06));
      expect(session.totalRatePerHour, closeTo(0.27, 0.001));
      expect(session.isExpired, isFalse);
    });

    test('Accumulation caps accurately at 24 hours', () {
      final now = DateTime.now();
      final session = MiningSession(
        sessionId: 'test-sess',
        startedAt: now.subtract(const Duration(hours: 30)),
        expiresAt: now.subtract(const Duration(hours: 6)),
        baseRate: 0.20,
      );

      // Session ran for > 24 hours, accumulated must cap at 24 hours * 0.20 = 4.80 VDC
      expect(session.isExpired, isTrue);
      expect(session.currentAccumulatedVdc, closeTo(4.80, 0.01));
    });
  });
}
