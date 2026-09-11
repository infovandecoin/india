import '../../domain/models/quiz_question.dart';
import '../../domain/repositories/quiz_repository.dart';
import '../datasources/mock_data_source.dart';

class QuizRepositoryImpl implements QuizRepository {
  final MockDataSource _dataSource;

  QuizRepositoryImpl({required MockDataSource dataSource})
      : _dataSource = dataSource;

  @override
  Future<List<QuizQuestion>> getDailyQuiz(String uid) async {
    return _dataSource.getDailyQuizQuestions();
  }

  @override
  Future<bool> hasCompletedTodayQuiz(String uid) async {
    return _dataSource.hasCompletedTodayQuiz(uid);
  }

  @override
  Future<QuizResult> submitDailyQuiz({
    required String uid,
    required Map<String, int> answers,
  }) async {
    return _dataSource.submitQuizAnswers(uid, answers);
  }
}
