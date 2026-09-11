import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../../core/widgets/chakra_spinner.dart';
import '../../providers/app_state_providers.dart';
import '../../providers/core_providers.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Email form
  final _emailFormKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'pioneer@vandecoin.network');
  final _passwordController = TextEditingController(text: 'Password123!');
  bool _obscurePassword = true;

  // Phone OTP form
  final _phoneController = TextEditingController(text: '9876543210');
  final _otpController = TextEditingController();
  bool _otpSent = false;

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _handleEmailLogin() async {
    if (!_emailFormKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authStateProvider.notifier).login(
            _emailController.text.trim(),
            _passwordController.text.trim(),
          );
      if (mounted) context.go('/home');
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleSendOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.length < 10) {
      setState(() => _errorMessage = 'Please enter a valid 10-digit mobile number');
      return;
    }
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    await Future.delayed(const Duration(milliseconds: 600));
    setState(() {
      _isLoading = false;
      _otpSent = true;
    });
  }

  Future<void> _handleVerifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.length != 6) {
      setState(() => _errorMessage = 'Enter the 6-digit OTP code');
      return;
    }
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final phone = _phoneController.text.trim();
      await ref.read(authStateProvider.notifier).login(
            '$phone@vandecoin.network',
            'phone-otp-auth',
          );
      if (mounted) context.go('/home');
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleBiometricAuth() async {
    final bio = ref.read(biometricServiceProvider);
    final success = await bio.authenticate();
    if (success && mounted) {
      await ref.read(authStateProvider.notifier).login(
            'pioneer@vandecoin.network',
            'biometric-login',
          );
      if (mounted) context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Sign In to VandeCoin'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Logo
              Center(
                child: Image.asset(
                  'assets/images/vdc-mark.png',
                  height: 56,
                  errorBuilder: (c, e, s) => const Icon(
                    Icons.shield,
                    size: 48,
                    color: AppColors.gold,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  'Access your simulated rewards and VandeCircle',
                  textAlign: TextAlign.center,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondaryDark,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Tab Switcher
              Container(
                decoration: BoxDecoration(
                  color: AppColors.darkSurfaceElevated,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.darkBorder),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicatorSize: TabBarIndicatorSize.tab,
                  indicator: BoxDecoration(
                    color: AppColors.gold,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  labelColor: Colors.black,
                  unselectedLabelColor: AppColors.textSecondaryDark,
                  labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                  tabs: const [
                    Tab(text: 'Mobile OTP'),
                    Tab(text: 'Email & Password'),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              if (_errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.error.withOpacity(0.4)),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: AppColors.error, fontSize: 12),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Tab Views
              SizedBox(
                height: 320,
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    // Phone OTP View
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        TextFormField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          enabled: !_otpSent,
                          decoration: InputDecoration(
                            labelText: 'Mobile Number',
                            prefixIcon: const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                              child: Text(
                                '+91',
                                style: TextStyle(
                                  color: AppColors.gold,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            hintText: '9876543210',
                          ),
                        ),
                        const SizedBox(height: 16),

                        if (_otpSent) ...[
                          TextFormField(
                            controller: _otpController,
                            keyboardType: TextInputType.number,
                            maxLength: 6,
                            decoration: const InputDecoration(
                              labelText: '6-Digit Verification Code',
                              prefixIcon: Icon(Icons.lock_clock, color: AppColors.gold),
                              hintText: '123456',
                            ),
                          ),
                          const SizedBox(height: 16),
                          VdcButton(
                            text: 'Verify & Sign In',
                            isLoading: _isLoading,
                            onPressed: _handleVerifyOtp,
                          ),
                          const SizedBox(height: 8),
                          TextButton(
                            onPressed: () => setState(() => _otpSent = false),
                            child: const Text('Change phone number'),
                          ),
                        ] else ...[
                          VdcButton(
                            text: 'Send Verification Code',
                            isLoading: _isLoading,
                            onPressed: _handleSendOtp,
                          ),
                        ],
                      ],
                    ),

                    // Email / Password View
                    Form(
                      key: _emailFormKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: const InputDecoration(
                              labelText: 'Email Address',
                              prefixIcon: Icon(Icons.email_outlined, color: AppColors.gold),
                            ),
                            validator: (val) {
                              if (val == null || !val.contains('@')) {
                                return 'Enter a valid email address';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              prefixIcon: const Icon(Icons.lock_outline, color: AppColors.gold),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                  color: AppColors.textSecondaryDark,
                                ),
                                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                              ),
                            ),
                            validator: (val) {
                              if (val == null || val.length < 6) {
                                return 'Password must be at least 6 characters';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 24),
                          VdcButton(
                            text: 'Sign In',
                            isLoading: _isLoading,
                            onPressed: _handleEmailLogin,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Biometric fast-path button
              Center(
                child: IconButton(
                  iconSize: 44,
                  icon: const Icon(Icons.fingerprint, color: AppColors.gold),
                  tooltip: 'Biometric Fast Unlock',
                  onPressed: _handleBiometricAuth,
                ),
              ),
              const Center(
                child: Text(
                  'Biometric Fast Unlock',
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondaryDark),
                ),
              ),

              const SizedBox(height: 24),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    "Don't have an account?",
                    style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 13),
                  ),
                  TextButton(
                    onPressed: () => context.pushReplacement('/auth/register'),
                    child: const Text(
                      'Create Pioneer Account',
                      style: TextStyle(color: AppColors.gold, fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
