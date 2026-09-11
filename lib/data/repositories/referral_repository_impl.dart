import '../../domain/models/referral_data.dart';
import '../../domain/models/network_member.dart';
import '../../domain/repositories/referral_repository.dart';
import '../datasources/mock_data_source.dart';

class ReferralRepositoryImpl implements ReferralRepository {
  final MockDataSource _dataSource;

  ReferralRepositoryImpl({required MockDataSource dataSource})
      : _dataSource = dataSource;

  @override
  Future<ReferralData> getReferralData(String uid) async {
    final user = _dataSource.currentUser;
    final code = user?.referralCode ?? 'VDC-PIONEER';
    final members = _dataSource.getCircleMembers(uid);

    return ReferralData(
      referralCode: code,
      totalInvited: members.length + 2,
      verifiedInvited: members.where((m) => m.isActive).length,
      totalVdcEarned: members.length * 10.0,
      shareLink: 'https://vandecoin.network/join?ref=$code',
    );
  }

  @override
  Future<bool> validateReferralCode(String code) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final trimmed = code.trim().toUpperCase();
    return trimmed.startsWith('VDC-') && trimmed.length >= 6;
  }

  @override
  Future<void> applyReferralCode(String uid, String code) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }

  @override
  Future<List<NetworkMember>> getCircleMembers(String uid) async {
    return _dataSource.getCircleMembers(uid);
  }

  @override
  Future<void> addCircleMember(String uid, String identifier) async {
    _dataSource.addCircleMember(uid, identifier);
  }

  @override
  Future<void> removeCircleMember(String uid, String memberId) async {
    _dataSource.removeCircleMember(uid, memberId);
  }
}
