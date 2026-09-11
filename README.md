# VandeCoin (VDC) - Multi-Platform Flutter Application

> **Official Production-Grade MVP**: Built for Android, iOS, and responsive Flutter Web from a single unified codebase.  
> **Package Identifier**: `network.vandecoin.app`  
> **Tagline**: *"Built for a Brighter India."*

---

## 1. Regulatory & Compliance Notice

> [!IMPORTANT]
> **Simulated In-App Rewards Notice**:
> VandeCoin is in the **concept and product-development stage**. All VDC balances and rewards within this application represent **simulated in-app participation rewards** designed to test ecosystem dynamics and educate pioneers on decentralized concepts.
> 
> VDC carries **NO monetary value**, cannot be redeemed or traded for INR, USD, or cryptocurrency, and cannot be exchanged for commercial goods. Nothing in this software constitutes an investment offering or promise of financial return.

---

## 2. Architecture Overview

This project adheres to **Clean Architecture** principles and is structured into distinct, testable layers:

```
lib/
├── app.dart                        # MaterialApp.router with localization and theme
├── main.dart                       # Entry point, pre-flight storage initialization
├── core/
│   ├── constants/                  # RewardConstants, ApiConstants
│   ├── router/                     # GoRouter configuration & auth guard redirect
│   ├── services/                   # StorageService, BiometricService
│   ├── theme/                      # AppColors, AppTypography, AppTheme (Dark & Light)
│   └── widgets/                    # ChakraSpinner, CoinMedallion, CircuitBackground, VdcCard, VdcButton
├── domain/
│   ├── models/                     # UserProfile, LedgerEntry, MiningSession, QuizQuestion, ReferralData
│   └── repositories/               # AuthRepository, LedgerRepository, MiningRepository, QuizRepository, ...
├── data/
│   ├── datasources/                # MockDataSource (Authoritative in-memory / encrypted persistence)
│   └── repositories/               # Concrete repository implementations
└── presentation/
    ├── providers/                  # Riverpod state notifiers & dependency injection
    └── screens/                    # Splash, Onboarding, Auth, Home, Earn, Network, Wallet, Profile, Quiz, ...
```

---

## 3. Brand & Visual Identity

- **Canonical Spinner**: 24-spoke Ashoka Chakra vector animated spinner (`ChakraSpinner`).
- **Minted Medallion**: 3D gold minted coin (`CoinMedallion`) with knurled gold rim and rim text (*"VANDECOIN • PEOPLE • PROGRESS • PROSPERITY"*).
- **Backgrounds**: Obsidian `#0A0A0C` background with radiating golden circuit traces (`CircuitBoardBackground`) and ambient Tiranga halos.
- **Themes**: Obsidian Dark (default) and Light theme via Material 3.

---

## 4. Configuration & `--dart-define` Flags

You can customize the runtime environment using Flutter's compile-time `--dart-define` parameters:

| Flag | Default | Description |
| :--- | :--- | :--- |
| `USE_MOCK_BACKEND` | `true` | When `true`, uses the server-authoritative mock data engine. When `false`, connects to the live API. |
| `API_BASE_URL` | `https://api.vandecoin.network/v1` | Root URL for the production REST / gRPC gateway. |

### Running with custom configurations:
```bash
# Debug with mock backend (default)
flutter run

# Debug against staging backend
flutter run --dart-define=USE_MOCK_BACKEND=false --dart-define=API_BASE_URL=https://staging-api.vandecoin.network/v1
```

---

## 5. Swapping from Mock to Live Backend

To replace the simulated local engine with your production backend:

1. Open [`lib/presentation/providers/core_providers.dart`](file:///C:/Users/infor/.gemini/antigravity/scratch/vandecoin-flutter/lib/presentation/providers/core_providers.dart).
2. Implement your remote data source (e.g. `RemoteApiDataSource` using `dio` or `http`).
3. Swap the repository implementations in `core_providers.dart`:
```dart
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  if (ApiConstants.useMockBackend) {
    return AuthRepositoryImpl(
      dataSource: ref.watch(mockDataSourceProvider),
      storage: ref.watch(storageServiceProvider),
      biometrics: ref.watch(biometricServiceProvider),
    );
  } else {
    return RemoteAuthRepositoryImpl(
      apiClient: ref.watch(apiClientProvider),
      storage: ref.watch(storageServiceProvider),
    );
  }
});
```

---

## 6. Building for Production

### Android (APK & App Bundle):
```bash
# Build Android App Bundle (.aab) for Google Play Store upload
flutter build appbundle --release

# Build universal release APK
flutter build apk --release
```
The output files will be generated in:
- AAB: `build/app/outputs/bundle/release/app-release.aab`
- APK: `build/app/outputs/flutter-apk/app-release.apk`

### Flutter Web:
```bash
flutter build web --release --base-href /
```
The output static bundle will be generated in `build/web/`.

### iOS:
```bash
flutter build ipa --release
```

---

## 7. Testing

Run the automated test suite covering ledger immutability, PoP session accumulation, quiz evaluation, and widget rendering:
```bash
flutter test
```

---

## 8. Formal Audit Trail

For complete documentation of all tokenomics figures, session timers, and architectural decisions, refer to [DECISIONS.md](file:///C:/Users/infor/.gemini/antigravity/scratch/vandecoin-flutter/DECISIONS.md).
