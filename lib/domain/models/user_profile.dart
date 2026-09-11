enum VandeTrustLevel {
  level0('L0: Visitor', 'Unverified account'),
  level1('L1: Pioneer', 'Phone / Email verified'),
  level2('L2: Secured', '12-word mnemonic backup secured'),
  level3('L3: VandeCircle', '3+ trusted network connections'),
  level4('L4: KYC Ready', 'Reserved for future ecosystem migration');

  final String title;
  final String description;
  const VandeTrustLevel(this.title, this.description);
}

class UserProfile {
  final String uid;
  final String? email;
  final String? phone;
  final String displayName;
  final String referralCode;
  final VandeTrustLevel trustLevel;
  final int streakDays;
  final int streakShields;
  final bool biometricEnabled;
  final bool isMiningActive;
  final DateTime createdAt;

  const UserProfile({
    required this.uid,
    this.email,
    this.phone,
    required this.displayName,
    required this.referralCode,
    this.trustLevel = VandeTrustLevel.level1,
    this.streakDays = 1,
    this.streakShields = 2,
    this.biometricEnabled = false,
    this.isMiningActive = false,
    required this.createdAt,
  });

  UserProfile copyWith({
    String? uid,
    String? email,
    String? phone,
    String? displayName,
    String? referralCode,
    VandeTrustLevel? trustLevel,
    int? streakDays,
    int? streakShields,
    bool? biometricEnabled,
    bool? isMiningActive,
    DateTime? createdAt,
  }) {
    return UserProfile(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      displayName: displayName ?? this.displayName,
      referralCode: referralCode ?? this.referralCode,
      trustLevel: trustLevel ?? this.trustLevel,
      streakDays: streakDays ?? this.streakDays,
      streakShields: streakShields ?? this.streakShields,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
      isMiningActive: isMiningActive ?? this.isMiningActive,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'uid': uid,
      'email': email,
      'phone': phone,
      'displayName': displayName,
      'referralCode': referralCode,
      'trustLevel': trustLevel.name,
      'streakDays': streakDays,
      'streakShields': streakShields,
      'biometricEnabled': biometricEnabled,
      'isMiningActive': isMiningActive,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      uid: json['uid'] as String,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      displayName: json['displayName'] as String? ?? 'Pioneer',
      referralCode: json['referralCode'] as String? ?? 'VDC-PIONEER',
      trustLevel: VandeTrustLevel.values.firstWhere(
        (e) => e.name == json['trustLevel'],
        orElse: () => VandeTrustLevel.level1,
      ),
      streakDays: (json['streakDays'] as num?)?.toInt() ?? 1,
      streakShields: (json['streakShields'] as num?)?.toInt() ?? 2,
      biometricEnabled: json['biometricEnabled'] as bool? ?? false,
      isMiningActive: json['isMiningActive'] as bool? ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }
}
