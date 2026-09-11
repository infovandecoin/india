/// Domain model for a 24-hour Proof-of-Participation (PoP) session.
class MiningSession {
  final String sessionId;
  final DateTime startedAt;
  final DateTime expiresAt;
  final double baseRate; // e.g. 0.20 VDC/h
  final double streakBonus; // e.g. +0.02 VDC/h
  final double circleBonus; // e.g. +0.06 VDC/h
  final bool settled;

  const MiningSession({
    required this.sessionId,
    required this.startedAt,
    required this.expiresAt,
    required this.baseRate,
    this.streakBonus = 0.0,
    this.circleBonus = 0.0,
    this.settled = false,
  });

  double get totalRatePerHour => baseRate + streakBonus + circleBonus;

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  Duration get remainingDuration {
    final now = DateTime.now();
    if (now.isAfter(expiresAt)) return Duration.zero;
    return expiresAt.difference(now);
  }

  /// Calculates accumulated simulated VDC based on elapsed time capped at 24 hours.
  double get currentAccumulatedVdc {
    final now = DateTime.now();
    final effectiveEnd = now.isAfter(expiresAt) ? expiresAt : now;
    if (effectiveEnd.isBefore(startedAt)) return 0.0;
    final elapsedSeconds = effectiveEnd.difference(startedAt).inSeconds;
    final earned = (elapsedSeconds / 3600.0) * totalRatePerHour;
    return earned;
  }

  Map<String, dynamic> toJson() {
    return {
      'sessionId': sessionId,
      'startedAt': startedAt.toIso8601String(),
      'expiresAt': expiresAt.toIso8601String(),
      'baseRate': baseRate,
      'streakBonus': streakBonus,
      'circleBonus': circleBonus,
      'settled': settled,
    };
  }

  factory MiningSession.fromJson(Map<String, dynamic> json) {
    return MiningSession(
      sessionId: json['sessionId'] as String,
      startedAt: DateTime.parse(json['startedAt'] as String),
      expiresAt: DateTime.parse(json['expiresAt'] as String),
      baseRate: (json['baseRate'] as num).toDouble(),
      streakBonus: (json['streakBonus'] as num?)?.toDouble() ?? 0.0,
      circleBonus: (json['circleBonus'] as num?)?.toDouble() ?? 0.0,
      settled: json['settled'] as bool? ?? false,
    );
  }
}
