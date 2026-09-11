import 'dart:math';
import '../../core/constants/reward_constants.dart';
import '../../domain/models/user_profile.dart';
import '../../domain/models/ledger_entry.dart';
import '../../domain/models/mining_session.dart';
import '../../domain/models/quiz_question.dart';
import '../../domain/models/network_member.dart';

/// Server-authoritative data engine simulating cloud backend logic with real business rules.
class MockDataSource {
  UserProfile? _currentUser;
  final List<LedgerEntry> _ledger = [];
  MiningSession? _activeMiningSession;
  final List<NetworkMember> _circleMembers = [];
  final Set<String> _completedQuizDays = {};
  final Set<String> _usedRefKeys = {};

  // Standard BIP-39 subset dictionary for realistic 12-word mnemonic generation
  static const List<String> _bip39Words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
    'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
    'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
    'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
    'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
    'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
    'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
    'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
    'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
    'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
    'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
    'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis',
    'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball',
    'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base',
    'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become'
  ];

  static const List<QuizQuestion> _dailyQuizBank = [
    QuizQuestion(
      id: 'q1',
      prompt: 'What consensus mechanism does VandeCoin use to protect device battery life?',
      options: [
        'Proof-of-Work (PoW)',
        'Proof-of-Participation (PoP)',
        'Proof-of-Stake (PoS)',
        'Proof-of-Authority (PoA)',
      ],
      correctIndex: 1,
      explanation: 'VandeCoin uses Proof-of-Participation (PoP), which models daily ecosystem engagement without running battery-draining CPU hashing loops.',
    ),
    QuizQuestion(
      id: 'q2',
      prompt: 'During the concept and product-development stage, what do VDC tokens represent?',
      options: [
        'Tradeable fiat currency',
        'Simulated in-app participation rewards',
        'Guaranteed dividend bonds',
        'Commodity investment futures',
      ],
      correctIndex: 1,
      explanation: 'VDC tokens strictly represent simulated in-app participation rewards with no cash value and no exchange redeemability.',
    ),
    QuizQuestion(
      id: 'q3',
      prompt: 'What is the duration of a standard VandeCoin Proof-of-Participation mining session?',
      options: ['1 Hour', '6 Hours', '12 Hours', '24 Hours'],
      correctIndex: 3,
      explanation: 'PoP sessions run for exactly 24 hours (86,400 seconds) before requiring the user to settle and restart.',
    ),
    QuizQuestion(
      id: 'q4',
      prompt: 'How many seed words are typically used in a cryptographic BIP-39 recovery phrase?',
      options: ['6 Words', '12 Words', '20 Words', '32 Words'],
      correctIndex: 1,
      explanation: 'A 12-word mnemonic phrase derived from 128 bits of entropy provides robust cryptographic protection for non-custodial ownership.',
    ),
    QuizQuestion(
      id: 'q5',
      prompt: 'How does VandeCircle boost your daily participation reward rate?',
      options: [
        'By running background calculations',
        'By adding trusted connections to your peer circle',
        'By purchasing premium subscription passes',
        'By sharing phone contacts with third parties',
      ],
      correctIndex: 1,
      explanation: 'Each verified active member in your VandeCircle contributes a +0.02 VDC/h boost up to 5 members (+0.10 VDC/h max).',
    ),
    QuizQuestion(
      id: 'q6',
      prompt: 'What happens if you miss one daily check-in while having an active Streak Shield?',
      options: [
        'Your streak resets to day 0 immediately',
        'The shield is consumed to protect your consecutive streak',
        'Your total account balance is reduced',
        'Your mining rate is permanently lowered',
      ],
      correctIndex: 1,
      explanation: 'Streak Shields automatically forgive 1 missed calendar day, keeping your hard-earned streak intact.',
    ),
    QuizQuestion(
      id: 'q7',
      prompt: 'Where are your simulated rewards permanently and immutably recorded?',
      options: [
        'Only in browser temporary cookies',
        'In the server-authoritative ledger with idempotency keys',
        'In public social media accounts',
        'In plain unencrypted local text files',
      ],
      correctIndex: 1,
      explanation: 'Every credit transaction is verified against an immutable ledger with unique refKey idempotency preventing double-claims.',
    ),
    QuizQuestion(
      id: 'q8',
      prompt: 'What is the maximum daily reward cap for completing the VandeQuiz?',
      options: ['1.00 VDC', '5.00 VDC', '15.00 VDC', '50.00 VDC'],
      correctIndex: 1,
      explanation: 'Users can earn up to 5.00 VDC daily (0.50 VDC per correct question across 10 educational questions).',
    ),
    QuizQuestion(
      id: 'q9',
      prompt: 'Why are all reward balances classified into Unverified and Verified tiers?',
      options: [
        'To add artificial delays',
        'To prevent sybil attacks, bot networks, and ensure identity trust',
        'To deduct transaction fees',
        'To force user paid upgrades',
      ],
      correctIndex: 1,
      explanation: 'Tiered balances ensure that unverified referral bonuses cannot be exploited by bots or unverified multi-accounts.',
    ),
    QuizQuestion(
      id: 'q10',
      prompt: 'What symbol is used as the universal loading indicator and brand progress mark in VandeCoin?',
      options: [
        'A spinning dollar sign',
        'The 24-spoke Ashoka Chakra',
        'An hourglass icon',
        'A generic bouncing dot',
      ],
      correctIndex: 1,
      explanation: 'The 24-spoke Ashoka Chakra is the official canonical loading spinner and brand emblem for the VDC ecosystem.',
    ),
  ];

  // Auth Operations
  UserProfile? get currentUser => _currentUser;

  Future<UserProfile> loginWithEmail(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _currentUser = UserProfile(
      uid: 'vdc-user-${email.hashCode.abs()}',
      email: email,
      displayName: email.split('@').first,
      referralCode: 'VDC-${email.split('@').first.toUpperCase()}-729',
      trustLevel: VandeTrustLevel.level1,
      streakDays: 3,
      streakShields: 2,
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    );

    // Initial welcome reward if ledger is empty
    if (_ledger.isEmpty) {
      _ledger.add(
        LedgerEntry(
          txId: 'tx-welcome-${DateTime.now().millisecondsSinceEpoch}',
          refKey: 'welcome-${_currentUser!.uid}',
          category: LedgerCategory.welcome,
          description: 'Welcome Pioneer Bonus',
          amount: RewardConstants.welcomeOnboardingReward,
          timestamp: DateTime.now().subtract(const Duration(days: 3)),
        ),
      );
    }
    return _currentUser!;
  }

  Future<UserProfile> registerWithEmail({
    required String email,
    required String password,
    required String displayName,
    String? referralCode,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final uid = 'vdc-${DateTime.now().millisecondsSinceEpoch}';
    final userRefCode = 'VDC-${displayName.toUpperCase().replaceAll(' ', '')}-${Random().nextInt(900) + 100}';

    _currentUser = UserProfile(
      uid: uid,
      email: email,
      displayName: displayName,
      referralCode: userRefCode,
      trustLevel: VandeTrustLevel.level1,
      streakDays: 1,
      streakShields: 2,
      createdAt: DateTime.now(),
    );

    // Credit Welcome Reward
    _ledger.add(
      LedgerEntry(
        txId: 'tx-welcome-${DateTime.now().millisecondsSinceEpoch}',
        refKey: 'welcome-$uid',
        category: LedgerCategory.welcome,
        description: 'Pioneer Welcome Reward',
        amount: RewardConstants.welcomeOnboardingReward,
        timestamp: DateTime.now(),
      ),
    );

    // If referral code applied, credit bonus
    if (referralCode != null && referralCode.trim().isNotEmpty) {
      _ledger.add(
        LedgerEntry(
          txId: 'tx-ref-${DateTime.now().millisecondsSinceEpoch}',
          refKey: 'referral-bonus-$uid',
          category: LedgerCategory.referral,
          description: 'Invitee Welcome Bonus (Ref: $referralCode)',
          amount: RewardConstants.referralInviteeBonus,
          timestamp: DateTime.now(),
        ),
      );
    }

    return _currentUser!;
  }

  Future<void> logout() async {
    _currentUser = null;
    _activeMiningSession = null;
  }

  // Ledger Operations
  List<LedgerEntry> getLedgerEntries(String uid) {
    return List.unmodifiable(_ledger.reversed.toList());
  }

  double calculateVerifiedBalance(String uid) {
    return _ledger.fold(0.0, (acc, tx) => acc + tx.amount);
  }

  double calculateUnverifiedBalance(String uid) {
    // Unverified rewards from pending referrals
    return 20.0;
  }

  double calculateEligibleBalance(String uid) {
    final verified = calculateVerifiedBalance(uid);
    // 80% of verified balance is eligible for staging
    return (verified * 0.85);
  }

  LedgerEntry recordTransaction({
    required String uid,
    required String refKey,
    required LedgerCategory category,
    required String description,
    required double amount,
    Map<String, dynamic>? metadata,
  }) {
    if (_usedRefKeys.contains(refKey)) {
      throw Exception('Duplicate transaction refKey: $refKey');
    }
    _usedRefKeys.add(refKey);

    final entry = LedgerEntry(
      txId: 'tx-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(1000)}',
      refKey: refKey,
      category: category,
      description: description,
      amount: amount,
      timestamp: DateTime.now(),
      metadata: metadata,
    );
    _ledger.add(entry);
    return entry;
  }

  // Mining Operations
  MiningSession? getActiveMiningSession(String uid) {
    if (_activeMiningSession != null && _activeMiningSession!.isExpired && !_activeMiningSession!.settled) {
      // Auto settle expired session
      settleMiningSession(uid);
    }
    return _activeMiningSession;
  }

  MiningSession startMiningSession({
    required String uid,
    required double baseRate,
    double streakBonus = 0.0,
    double circleBonus = 0.0,
  }) {
    final now = DateTime.now();
    final expires = now.add(Duration(seconds: RewardConstants.miningSessionDurationSeconds));

    _activeMiningSession = MiningSession(
      sessionId: 'sess-${now.millisecondsSinceEpoch}',
      startedAt: now,
      expiresAt: expires,
      baseRate: baseRate,
      streakBonus: streakBonus,
      circleBonus: circleBonus,
    );

    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(isMiningActive: true);
    }

    return _activeMiningSession!;
  }

  double settleMiningSession(String uid) {
    if (_activeMiningSession == null) return 0.0;
    final earned = _activeMiningSession!.currentAccumulatedVdc;

    if (earned > 0) {
      recordTransaction(
        uid: uid,
        refKey: 'pop-session-${_activeMiningSession!.sessionId}',
        category: LedgerCategory.mining,
        description: 'Proof-of-Participation 24h Session',
        amount: double.parse(earned.toStringAsFixed(2)),
      );
    }

    _activeMiningSession = null;
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(isMiningActive: false);
    }
    return earned;
  }

  // Quiz Operations
  List<QuizQuestion> getDailyQuizQuestions() => _dailyQuizBank;

  bool hasCompletedTodayQuiz(String uid) {
    final today = DateTime.now().toIso8601String().substring(0, 10);
    return _completedQuizDays.contains('$uid-$today');
  }

  QuizResult submitQuizAnswers(String uid, Map<String, int> answers) {
    final today = DateTime.now().toIso8601String().substring(0, 10);
    _completedQuizDays.add('$uid-$today');

    int correctCount = 0;
    for (final q in _dailyQuizBank) {
      if (answers[q.id] == q.correctIndex) {
        correctCount++;
      }
    }

    final vdcEarned = correctCount * RewardConstants.quizPerQuestionReward;

    if (vdcEarned > 0) {
      recordTransaction(
        uid: uid,
        refKey: 'daily-quiz-$today-$uid',
        category: LedgerCategory.quiz,
        description: 'VandeQuiz Daily ($correctCount/10 correct)',
        amount: vdcEarned,
      );
    }

    return QuizResult(
      attemptId: 'att-${DateTime.now().millisecondsSinceEpoch}',
      score: correctCount,
      totalQuestions: _dailyQuizBank.length,
      vdcEarned: vdcEarned,
      timestamp: DateTime.now(),
    );
  }

  // Network & Circle Operations
  List<NetworkMember> getCircleMembers(String uid) {
    if (_circleMembers.isEmpty) {
      _circleMembers.addAll([
        NetworkMember(
          memberId: 'mem-1',
          username: 'Aarav Sharma',
          trustWeight: 1.0,
          joinedAt: DateTime.now().subtract(const Duration(days: 12)),
          isActive: true,
          lastActive: DateTime.now().subtract(const Duration(minutes: 15)),
        ),
        NetworkMember(
          memberId: 'mem-2',
          username: 'Priya Patel',
          trustWeight: 1.0,
          joinedAt: DateTime.now().subtract(const Duration(days: 8)),
          isActive: true,
          lastActive: DateTime.now().subtract(const Duration(hours: 1)),
        ),
        NetworkMember(
          memberId: 'mem-3',
          username: 'Vikram Singh',
          trustWeight: 1.0,
          joinedAt: DateTime.now().subtract(const Duration(days: 5)),
          isActive: false,
          lastActive: DateTime.now().subtract(const Duration(days: 1)),
        ),
      ]);
    }
    return List.unmodifiable(_circleMembers);
  }

  void addCircleMember(String uid, String identifier) {
    if (_circleMembers.any((m) => m.username.toLowerCase() == identifier.toLowerCase())) {
      throw Exception('Member already in your VandeCircle');
    }
    _circleMembers.add(
      NetworkMember(
        memberId: 'mem-${DateTime.now().millisecondsSinceEpoch}',
        username: identifier,
        trustWeight: 1.0,
        joinedAt: DateTime.now(),
        isActive: true,
        lastActive: DateTime.now(),
      ),
    );
  }

  void removeCircleMember(String uid, String memberId) {
    _circleMembers.removeWhere((m) => m.memberId == memberId);
  }

  // Recovery Phrase & Security
  List<String> generate12WordMnemonic(String uid) {
    final random = Random(uid.hashCode);
    final phrase = <String>[];
    for (int i = 0; i < 12; i++) {
      phrase.add(_bip39Words[random.nextInt(_bip39Words.length)]);
    }
    return phrase;
  }
}
