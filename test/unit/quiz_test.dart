import 'package:flutter_test/flutter_test.dart';
import 'package:vandecoin_flutter/data/datasources/mock_data_source.dart';

void main() {
  group('VandeQuiz Education Tests', () {
    late MockDataSource dataSource;

    setUp(() {
      dataSource = MockDataSource();
    });

    test('Validates 10 educational questions with 5.00 VDC maximum cap', () {
      const uid = 'quiz-tester-1';
      final questions = dataSource.getDailyQuizQuestions();

      expect(questions.length, equals(10));

      // Perfect score submission
      final perfectAnswers = <String, int>{};
      for (final q in questions) {
        perfectAnswers[q.id] = q.correctIndex;
      }

      final result = dataSource.submitQuizAnswers(uid, perfectAnswers);
      expect(result.score, equals(10));
      expect(result.vdcEarned, equals(5.0));

      final balance = dataSource.calculateVerifiedBalance(uid);
      expect(balance, equals(5.0));

      // Cannot submit twice on same calendar day
      expect(dataSource.hasCompletedTodayQuiz(uid), isTrue);
    });
  });
}
