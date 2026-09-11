import '../models/quiz_question.dart';

abstract class QuizRepository {
  Future<List<QuizQuestion>> getDailyQuiz(String uid);
  Future<bool> hasCompletedTodayQuiz(String uid);
  Future<QuizResult> submitDailyQuiz({
    required String uid,
    required Map<String, int> answers,
  });
}
