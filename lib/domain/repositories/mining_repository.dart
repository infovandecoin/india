import '../models/mining_session.dart';

abstract class MiningRepository {
  Future<MiningSession?> getActiveSession(String uid);
  Future<MiningSession> startSession({
    required String uid,
    required double baseRate,
    double streakBonus = 0.0,
    double circleBonus = 0.0,
  });
  Future<double> settleSession(String uid);
}
