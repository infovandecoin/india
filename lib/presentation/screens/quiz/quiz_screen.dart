import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/vdc_card.dart';
import '../../../domain/models/quiz_question.dart';
import '../../providers/app_state_providers.dart';
import '../../providers/core_providers.dart';

class QuizScreen extends ConsumerStatefulWidget {
  const QuizScreen({super.key});

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  int _currentIndex = 0;
  final Map<String, int> _selectedAnswers = {};
  bool _showingExplanation = false;
  bool _isSubmitted = false;
  QuizResult? _result;
  bool _isLoading = false;

  void _selectOption(int optionIndex, List<QuizQuestion> questions) {
    if (_showingExplanation || _isSubmitted) return;
    setState(() {
      _selectedAnswers[questions[_currentIndex].id] = optionIndex;
      _showingExplanation = true;
    });
  }

  void _nextQuestion(List<QuizQuestion> questions) {
    if (_currentIndex < questions.length - 1) {
      setState(() {
        _currentIndex++;
        _showingExplanation = false;
      });
    } else {
      _submitQuiz();
    }
  }

  Future<void> _submitQuiz() async {
    setState(() => _isLoading = true);
    final user = ref.read(authStateProvider).value;
    if (user != null) {
      final repo = ref.read(quizRepositoryProvider);
      final res = await repo.submitDailyQuiz(
        uid: user.uid,
        answers: _selectedAnswers,
      );
      ref.invalidate(ledgerEntriesProvider);
      ref.invalidate(verifiedBalanceProvider);
      setState(() {
        _result = res;
        _isSubmitted = true;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final quizRepo = ref.watch(quizRepositoryProvider);

    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('VandeQuiz: Web3 Education'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: FutureBuilder<List<QuizQuestion>>(
        future: quizRepo.getDailyQuiz('default-user'),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: ChakraSpinner());
          }

          final questions = snapshot.data!;
          if (_isSubmitted && _result != null) {
            return _buildResultsView(_result!);
          }

          final currentQ = questions[_currentIndex];
          final selectedIdx = _selectedAnswers[currentQ.id];

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Progress Bar & Counter
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Question ${_currentIndex + 1} of ${questions.length}',
                      style: const TextStyle(
                        color: AppColors.gold,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                    ),
                    const Text(
                      '+0.50 VDC per correct answer',
                      style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 11),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: (_currentIndex + 1) / questions.length,
                  backgroundColor: AppColors.darkBorder,
                  valueColor: const AlwaysStoppedAnimation(AppColors.gold),
                  borderRadius: BorderRadius.circular(4),
                ),

                const SizedBox(height: 24),

                // Question Prompt Card
                VdcCard(
                  padding: const EdgeInsets.all(18),
                  child: Text(
                    currentQ.prompt,
                    style: AppTypography.h3.copyWith(
                      color: Colors.white,
                      height: 1.4,
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Options List
                ...List.generate(currentQ.options.length, (optIdx) {
                  final optionText = currentQ.options[optIdx];
                  final isSelected = selectedIdx == optIdx;
                  final isCorrect = currentQ.correctIndex == optIdx;

                  Color borderColor = AppColors.darkBorder;
                  Color bgColor = AppColors.darkSurfaceElevated;

                  if (_showingExplanation) {
                    if (isCorrect) {
                      borderColor = AppColors.greenLight;
                      bgColor = AppColors.greenPrimary.withOpacity(0.15);
                    } else if (isSelected) {
                      borderColor = AppColors.error;
                      bgColor = AppColors.error.withOpacity(0.15);
                    }
                  } else if (isSelected) {
                    borderColor = AppColors.gold;
                    bgColor = AppColors.gold.withOpacity(0.12);
                  }

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: InkWell(
                      onTap: () => _selectOption(optIdx, questions),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: bgColor,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor, width: 1.5),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 28,
                              height: 28,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isSelected ? AppColors.gold : AppColors.darkBorder,
                              ),
                              child: Center(
                                child: Text(
                                  String.fromCharCode(65 + optIdx),
                                  style: TextStyle(
                                    color: isSelected ? Colors.black : Colors.white,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Text(
                                optionText,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),

                // Explanation Box
                if (_showingExplanation) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.gold.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.lightbulb_outline, color: AppColors.gold, size: 18),
                            SizedBox(width: 8),
                            Text(
                              'Educational Insight',
                              style: TextStyle(
                                color: AppColors.gold,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          currentQ.explanation,
                          style: const TextStyle(
                            color: AppColors.textSecondaryDark,
                            fontSize: 12,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  VdcButton(
                    text: _currentIndex < questions.length - 1
                        ? 'Next Question'
                        : 'Submit Quiz & Claim VDC',
                    isLoading: _isLoading,
                    onPressed: () => _nextQuestion(questions),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildResultsView(QuizResult result) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.gold.withOpacity(0.15),
              ),
              child: const Icon(Icons.stars, size: 64, color: AppColors.gold),
            ),
            const SizedBox(height: 20),
            Text(
              'Quiz Completed!',
              style: AppTypography.h1.copyWith(color: Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              'You scored ${result.score} out of ${result.totalQuestions} questions correctly.',
              style: const TextStyle(color: AppColors.textSecondaryDark, fontSize: 14),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              decoration: BoxDecoration(
                color: AppColors.darkSurfaceElevated,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.greenLight.withOpacity(0.4)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.check_circle, color: AppColors.greenLight, size: 24),
                  const SizedBox(width: 12),
                  Text(
                    '+${result.vdcEarned.toStringAsFixed(2)} VDC Credited to Ledger',
                    style: const TextStyle(
                      color: AppColors.greenLight,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 36),
            VdcButton(
              text: 'Return to Home',
              onPressed: () => context.go('/home'),
            ),
          ],
        ),
      ),
    );
  }
}
