import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../presentation/providers/app_state_providers.dart';
import '../../presentation/screens/splash/splash_screen.dart';
import '../../presentation/screens/onboarding/onboarding_screen.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/main_navigation_shell.dart';
import '../../presentation/screens/home/home_screen.dart';
import '../../presentation/screens/earn/earn_screen.dart';
import '../../presentation/screens/network/network_screen.dart';
import '../../presentation/screens/wallet/wallet_screen.dart';
import '../../presentation/screens/profile/profile_screen.dart';
import '../../presentation/screens/quiz/quiz_screen.dart';
import '../../presentation/screens/referral/referral_screen.dart';
import '../../presentation/screens/streaks/streaks_screen.dart';
import '../../presentation/screens/security/security_screen.dart';

final rootNavigatorKey = GlobalKey<NavigatorState>();
final shellNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/splash',
    redirect: (context, state) {
      final isAuthLoading = authState.isLoading;
      final isAuthenticated = authState.value != null;
      final isGoingToSplash = state.matchedLocation == '/splash';
      final isGoingToOnboarding = state.matchedLocation == '/onboarding';
      final isGoingToAuth = state.matchedLocation.startsWith('/auth');

      if (isAuthLoading) {
        return isGoingToSplash ? null : '/splash';
      }

      if (!isAuthenticated) {
        if (isGoingToOnboarding || isGoingToAuth) {
          return null;
        }
        return '/onboarding';
      }

      // Authenticated user trying to access onboarding or auth
      if (isGoingToSplash || isGoingToOnboarding || isGoingToAuth) {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // Main Tab Navigation Shell
      ShellRoute(
        navigatorKey: shellNavigatorKey,
        builder: (context, state, child) {
          return MainNavigationShell(child: child);
        },
        routes: [
          GoRoute(
            path: '/home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomeScreen(),
            ),
          ),
          GoRoute(
            path: '/earn',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: EarnScreen(),
            ),
          ),
          GoRoute(
            path: '/network',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: NetworkScreen(),
            ),
          ),
          GoRoute(
            path: '/wallet',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: WalletScreen(),
            ),
          ),
          GoRoute(
            path: '/profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ProfileScreen(),
            ),
          ),
        ],
      ),

      // Full-screen Modals & Deep Views
      GoRoute(
        path: '/quiz',
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const QuizScreen(),
      ),
      GoRoute(
        path: '/referral',
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const ReferralScreen(),
      ),
      GoRoute(
        path: '/streaks',
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const StreaksScreen(),
      ),
      GoRoute(
        path: '/security',
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const SecurityScreen(),
      ),
    ],
  );
});
