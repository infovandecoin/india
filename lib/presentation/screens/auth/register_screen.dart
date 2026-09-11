import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/vdc_button.dart';
import '../../providers/app_state_providers.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _referralController = TextEditingController();

  bool _obscurePassword = true;
  bool _acceptedTerms = false;
  bool _acceptedSimulatedNotice = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _referralController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_acceptedTerms || !_acceptedSimulatedNotice) {
      setState(() => _errorMessage = 'Please accept all compliance acknowledgments to continue.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authStateProvider.notifier).register(
            email: _emailController.text.trim(),
            password: _passwordController.text.trim(),
            displayName: _nameController.text.trim(),
            referralCode: _referralController.text.trim().isEmpty
                ? null
                : _referralController.text.trim(),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        title: const Text('Pioneer Registration'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header badge
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.gold.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.card_giftcard, color: AppColors.gold, size: 22),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Join now to receive your +25.00 VDC Pioneer Welcome Reward!',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.gold,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
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

                // Display Name
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Full Name or Pioneer Alias',
                    prefixIcon: Icon(Icons.person_outline, color: AppColors.gold),
                    hintText: 'e.g. Aarav Sharma',
                  ),
                  validator: (val) {
                    if (val == null || val.trim().length < 2) {
                      return 'Please enter your name or alias';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Email
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email Address',
                    prefixIcon: Icon(Icons.email_outlined, color: AppColors.gold),
                    hintText: 'name@example.com',
                  ),
                  validator: (val) {
                    if (val == null || !val.contains('@')) {
                      return 'Please enter a valid email address';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Password
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
                    hintText: 'Minimum 8 characters',
                  ),
                  validator: (val) {
                    if (val == null || val.length < 8) {
                      return 'Password must be at least 8 characters long';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Optional Referral Code
                TextFormField(
                  controller: _referralController,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'Referral Code (Optional)',
                    prefixIcon: Icon(Icons.groups_outlined, color: AppColors.gold),
                    hintText: 'e.g. VDC-BHARAT-108',
                    helperText: 'Earn an additional +10.00 VDC bonus if invited',
                  ),
                ),
                const SizedBox(height: 24),

                // Compliance Checkboxes (Un-preselected)
                CheckboxListTile(
                  value: _acceptedTerms,
                  onChanged: (val) => setState(() => _acceptedTerms = val ?? false),
                  activeColor: AppColors.gold,
                  checkColor: Colors.black,
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                  title: const Text(
                    'I agree to the VandeCoin Terms of Service and Privacy Policy.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondaryDark),
                  ),
                ),
                CheckboxListTile(
                  value: _acceptedSimulatedNotice,
                  onChanged: (val) => setState(() => _acceptedSimulatedNotice = val ?? false),
                  activeColor: AppColors.gold,
                  checkColor: Colors.black,
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                  title: const Text(
                    'I acknowledge that VDC tokens represent simulated in-app participation rewards with NO monetary, cash, or secondary exchange value.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondaryDark),
                  ),
                ),
                const SizedBox(height: 24),

                VdcButton(
                  text: 'Claim +25 VDC & Create Account',
                  isLoading: _isLoading,
                  onPressed: _handleRegister,
                ),
                const SizedBox(height: 16),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Already registered?',
                      style: TextStyle(color: AppColors.textSecondaryDark, fontSize: 13),
                    ),
                    TextButton(
                      onPressed: () => context.pushReplacement('/auth/login'),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(color: AppColors.gold, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
