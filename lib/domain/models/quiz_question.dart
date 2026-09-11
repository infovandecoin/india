/// Educational Web3 / VDC quiz question model.
class QuizQuestion {
  final String id;
  final String prompt;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  const QuizQuestion({
    required this.id,
    required this.prompt,
    required this.options,
    required this.correctIndex,
    required this.explanation,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'prompt': prompt,
      'options': options,
      'correctIndex': correctIndex,
      'explanation': explanation,
    };
  }

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      id: json['id'] as String,
      prompt: json['prompt'] as String,
      options: List<String>.from(json['options'] as List),
      correctIndex: json['correctIndex'] as int,
      explanation: json['explanation'] as String,
    );
  }
}

class QuizResult {
  final String attemptId;
  final int score;
  final int totalQuestions;
  final double vdcEarned;
  final DateTime timestamp;

  const QuizResult({
    required this.attemptId,
    required this.score,
    required this.totalQuestions,
    required this.vdcEarned,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'attemptId': attemptId,
      'score': score,
      'totalQuestions': totalQuestions,
      'vdcEarned': vdcEarned,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
