/// Application and API configuration constants.
class ApiConstants {
  ApiConstants._();

  static const String appName = 'VandeCoin';
  static const String appVersion = '1.0.0';
  static const String packageId = 'network.vandecoin.app';
  static const String termsUrl = 'https://vandecoin.network/terms';
  static const String privacyUrl = 'https://vandecoin.network/privacy';
  static const String whitepaperUrl = 'https://vandecoin.network/whitepaper';

  // Network & Environment configuration via --dart-define
  static const bool useMockBackend = bool.fromEnvironment(
    'USE_MOCK_BACKEND',
    defaultValue: true,
  );

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.vandecoin.network/v1',
  );

  static const int networkTimeoutSeconds = 15;
  static const int otpResendCooldownSeconds = 60;
}
