enum LedgerCategory {
  mining('PoP Mining', '24h participation reward'),
  quiz('VandeQuiz', 'Daily educational quiz reward'),
  streak('Daily Streak', 'Consecutive check-in bonus'),
  referral('Referral Network', 'Invitation reward'),
  welcome('Welcome Bonus', 'New pioneer account setup'),
  bonus('Ecosystem Bonus', 'Special community incentive');

  final String label;
  final String description;
  const LedgerCategory(this.label, this.description);
}

enum LedgerStatus { completed, pending, reversed }

/// Immutable transaction record for VDC simulated rewards.
class LedgerEntry {
  final String txId;
  final String refKey; // Idempotency key
  final LedgerCategory category;
  final String description;
  final double amount; // VDC amount
  final DateTime timestamp;
  final LedgerStatus status;
  final Map<String, dynamic>? metadata;

  const LedgerEntry({
    required this.txId,
    required this.refKey,
    required this.category,
    required this.description,
    required this.amount,
    required this.timestamp,
    this.status = LedgerStatus.completed,
    this.metadata,
  });

  Map<String, dynamic> toJson() {
    return {
      'txId': txId,
      'refKey': refKey,
      'category': category.name,
      'description': description,
      'amount': amount,
      'timestamp': timestamp.toIso8601String(),
      'status': status.name,
      'metadata': metadata,
    };
  }

  factory LedgerEntry.fromJson(Map<String, dynamic> json) {
    return LedgerEntry(
      txId: json['txId'] as String,
      refKey: json['refKey'] as String,
      category: LedgerCategory.values.firstWhere(
        (e) => e.name == json['category'],
        orElse: () => LedgerCategory.mining,
      ),
      description: json['description'] as String? ?? 'Reward Entry',
      amount: (json['amount'] as num).toDouble(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      status: LedgerStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => LedgerStatus.completed,
      ),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }
}
