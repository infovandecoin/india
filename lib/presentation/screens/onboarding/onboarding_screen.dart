import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/circuit_board_background.dart';
import '../../../core/widgets/coin_medallion.dart';
import '../../../core/widgets/vdc_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  bool _acceptedTerms = false;
  String _selectedLanguage = 'English';

  final List<Map<String, String>> _slides = [
    {
      'title': 'Eco-Friendly Participation',
      'subtitle':
          'Experience 24-hour Proof-of-Participation (PoP) rewards with zero battery drain, zero CPU hashing, and zero environmental impact.',
      'badge': 'PROOF-OF-PARTICIPATION',
    },
    {
      'title': 'VandeCircle Trust Network',
      'subtitle':
          'Forge trusted connections with verified pioneers across India. Boost your participation score collaboratively.',
      'badge': 'COMMUNITY-FIRST',
    },
    {
      'title': 'Learn Web3, Grow Together',
      'subtitle':
          'Master blockchain concepts with daily educational quizzes and transparent cryptographic identity safeguards.',
      'badge': 'EDUCATION & EMPOWERMENT',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      body: CircuitBoardBackground(
        child: SafeArea(
          child: Column(
            children: [
              // Top Bar: Language Selector
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Brand mark
                    Image.asset(
                      'assets/images/vdc-mark.png',
                      height: 32,
                      errorBuilder: (c, e, s) => const Icon(
                        Icons.shield,
                        color: AppColors.gold,
                        size: 28,
                      ),
                    ),
                    // Language Switcher Chip
                    PopupMenuButton<String>(
                      initialValue: _selectedLanguage,
                      onSelected: (val) {
                        setState(() => _selectedLanguage = val);
                      },
                      color: AppColors.darkSurfaceElevated,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: AppColors.darkBorder),
                      ),
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'English',
                          child: Text('English', style: TextStyle(color: Colors.white)),
                        ),
                        const PopupMenuItem(
                          value: 'हिंदी',
                          child: Text('हिंदी (Hindi)', style: TextStyle(color: Colors.white)),
                        ),
                      ],
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.darkSurfaceElevated,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.darkBorder),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.language, size: 16, color: AppColors.gold),
                            const SizedBox(width: 6),
                            Text(
                              _selectedLanguage,
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.textPrimaryDark,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // 3D Coin Medallion Hero
              const Hero(
                tag: 'coin-medallion',
                child: CoinMedallion(size: 150),
              ),

              const SizedBox(height: 32),

              // Carousel PageView
              SizedBox(
                height: 180,
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (idx) => setState(() => _currentPage = idx),
                  itemCount: _slides.length,
                  itemBuilder: (context, index) {
                    final slide = _slides[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.gold.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              slide['badge']!,
                              style: const TextStyle(
                                color: AppColors.gold,
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            slide['title']!,
                            textAlign: TextAlign.center,
                            style: AppTypography.h2.copyWith(
                              color: AppColors.textPrimaryDark,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            slide['subtitle']!,
                            textAlign: TextAlign.center,
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondaryDark,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),

              // Dots indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_slides.length, (idx) {
                  final isActive = idx == _currentPage;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: isActive ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isActive ? AppColors.gold : AppColors.darkBorderLight,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  );
                }),
              ),

              const Spacer(),

              // Compliance Checkbox (Un-preselected)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: InkWell(
                  onTap: () => setState(() => _acceptedTerms = !_acceptedTerms),
                  borderRadius: BorderRadius.circular(8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Checkbox(
                        value: _acceptedTerms,
                        onChanged: (val) => setState(() => _acceptedTerms = val ?? false),
                        activeColor: AppColors.gold,
                        checkColor: Colors.black,
                        side: const BorderSide(color: AppColors.darkBorderLight, width: 1.5),
                      ),
                      const Expanded(
                        child: Text(
                          'I acknowledge that VDC represents simulated in-app participation rewards during the concept stage, carrying no cash or monetary value and no exchange redemption.',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondaryDark,
                            height: 1.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Action Buttons
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    VdcButton(
                      text: 'Create Pioneer Account',
                      onPressed: _acceptedTerms
                          ? () => context.push('/auth/register')
                          : null,
                    ),
                    const SizedBox(height: 10),
                    VdcButton(
                      text: 'Already have an account? Sign In',
                      variant: VdcButtonVariant.ghost,
                      onPressed: () => context.push('/auth/login'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
