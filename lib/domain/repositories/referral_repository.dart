import '../models/referral_data.dart';
import '../models/network_member.dart';

abstract class ReferralRepository {
  Future<ReferralData> getReferralData(String uid);
  Future<bool> validateReferralCode(String code);
  Future<void> applyReferralCode(String uid, String code);
  Future<List<NetworkMember>> getCircleMembers(String uid);
  Future<void> addCircleMember(String uid, String identifier);
  Future<void> removeCircleMember(String uid, String memberId);
}
