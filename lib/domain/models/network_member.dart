class NetworkMember {
  final String memberId;
  final String username;
  final double trustWeight;
  final DateTime joinedAt;
  final bool isActive;
  final DateTime? lastActive;

  const NetworkMember({
    required this.memberId,
    required this.username,
    required this.trustWeight,
    required this.joinedAt,
    required this.isActive,
    this.lastActive,
  });

  Map<String, dynamic> toJson() {
    return {
      'memberId': memberId,
      'username': username,
      'trustWeight': trustWeight,
      'joinedAt': joinedAt.toIso8601String(),
      'isActive': isActive,
      'lastActive': lastActive?.toIso8601String(),
    };
  }

  factory NetworkMember.fromJson(Map<String, dynamic> json) {
    return NetworkMember(
      memberId: json['memberId'] as String,
      username: json['username'] as String,
      trustWeight: (json['trustWeight'] as num).toDouble(),
      joinedAt: DateTime.parse(json['joinedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      lastActive: json['lastActive'] != null
          ? DateTime.parse(json['lastActive'] as String)
          : null,
    );
  }
}
