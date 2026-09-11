/// Centralized reward, mining, and economic constants for VandeCoin.
/// NOTE: All values are calibrated placeholders for the concept/development MVP.
class RewardConstants {
  RewardConstants._();

  // Proof-of-Participation Mining
  static const double baseMiningRatePerHour = 0.20; // VDC / hour
  static const int miningSessionDurationHours = 24;
  static const int miningSessionDurationSeconds = 24 * 3600;

  // Streak & Daily Check-in
  static const double dailyCheckInReward = 1.00; // VDC
  static const double streak7DayBonus = 15.00; // VDC
  static const double streak14DayBonus = 30.00; // VDC
  static const double streak30DayBonus = 150.00; // VDC
  static const int streakShieldGraceDays = 1;

  // VandeQuiz
  static const double quizDailyRewardCap = 5.00; // VDC
  static const double quizPerQuestionReward = 0.50; // VDC (10 questions = 5.00 VDC)
  static const int quizQuestionCount = 10;
  static const int quizSecondsPerQuestion = 30;

  // Referrals
  static const double referralInviterBonus = 10.00; // VDC (unverified until L1)
  static const double referralInviteeBonus = 10.00; // VDC

  // VandeCircle Trust Network
  static const double circleBonusPerMemberPerHour = 0.02; // VDC / hour
  static const int circleMaxBoostMembers = 5; // Max 5 members (+0.10 VDC/h)

  // Welcome Reward
  static const double welcomeOnboardingReward = 25.00; // VDC
}
