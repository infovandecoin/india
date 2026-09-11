import '../../domain/models/mining_session.dart';
import '../../domain/repositories/mining_repository.dart';
import '../datasources/mock_data_source.dart';

class MiningRepositoryImpl implements MiningRepository {
  final MockDataSource _dataSource;

  MiningRepositoryImpl({required MockDataSource dataSource})
      : _dataSource = dataSource;

  @override
  Future<MiningSession?> getActiveSession(String uid) async {
    return _dataSource.getActiveMiningSession(uid);
  }

  @override
  Future<MiningSession> startSession({
    required String uid,
    required double baseRate,
    double streakBonus = 0.0,
    double circleBonus = 0.0,
  }) async {
    return _dataSource.startMiningSession(
      uid: uid,
      baseRate: baseRate,
      streakBonus: streakBonus,
      circleBonus: circleBonus,
    );
  }

  @override
  Future<double> settleSession(String uid) async {
    return _dataSource.settleMiningSession(uid);
  }
}
