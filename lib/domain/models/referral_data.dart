class ReferralData {
  final String referralCode;
  final int totalInvited;
  final int verifiedInvited;
  final double totalVdcEarned;
  final String shareLink;

  const ReferralData({
    required this.referralCode,
    required this.totalInvited,
    required this.verifiedInvited,
    required this.totalVdcEarned,
    required this.shareLink,
  });

  Map<String, dynamic> toJson() {
    return {
      'referralCode': referralCode,
      'totalInvited': totalInvited,
      'verifiedInvited': verifiedInvited,
      'totalVdcEarned': totalVdcEarned,
      'shareLink': shareLink,
    };
  }
}
