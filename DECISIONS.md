# VandeCoin (VDC) - Architectural & Economic Decisions (DECISIONS.md)

**Project Name**: VandeCoin (VDC)  
**Package Identifier**: `network.vandecoin.app`  
**Current Milestone**: Concept / Product-Development Stage (Production-Grade MVP)  
**Last Updated**: 2026-09-11  

---

## 1. Regulatory, Legal & Compliance Framing

### 1.1 Non-Financial Classification (Simulated In-App Rewards)
- **Status**: **MANDATORY & UNCOMPROMISING**
- **Decision**: VDC tokens are categorized strictly as **simulated in-app participation rewards**.
- **Prohibitions**:
  - The app, UI, code, and documentation MUST NEVER claim or imply that VDC is a transferable cryptocurrency, security, financial instrument, or speculative asset.
  - No claims of guaranteed economic value, future price appreciation, or guaranteed listing on secondary exchanges.
  - No mechanisms for direct cash redemption (INR, USD), crypto conversion, or direct redemption for commercial goods/merchandise are provided in this version.
- **In-App Disclaimers**:
  - Every screen displaying balances or rewards (Home, Earn, Wallet, Rewards Center) includes an explicit compliance notice:
    > *"VDC represents simulated in-app participation rewards during the concept stage. It holds no cash value and cannot be redeemed, traded, or transferred."*

---

## 2. Tokenomics & Economic Parameters (PLACEHOLDER SPECIFICATION)

> [!NOTE]
> All economic figures listed below are **design placeholders** intended to model ecosystem dynamics during testing and MVP evaluation. Actual production figures will be determined by network governance and regulatory counsel prior to testnet deployment.

| Metric / Parameter | Placeholder Value | Design Rationale |
| :--- | :--- | :--- |
| **Base Participation Rate** | `0.20 VDC / hour` | Calibrated for 4.80 VDC per complete 24-hour session. |
| **Session Duration** | `24 Hours (86,400s)` | Encourages daily retention without requiring continuous app focus. |
| **Daily Check-in Reward** | `1.00 VDC / day` | Simple daily activity retention mechanism. |
| **Streak Milestone (Day 7)** | `+15.00 VDC` | Milestone booster rewarding 1 full week of consistency. |
| **Streak Milestone (Day 14)**| `+30.00 VDC` | Bi-weekly consistency multiplier. |
| **Streak Milestone (Day 30)**| `+150.00 VDC` | Monthly loyalty celebration booster. |
| **Streak Shield Grace** | `1 Day Miss Forgiven` | Prevents churn if user misses exactly 1 calendar day. |
| **Daily VandeQuiz Cap** | `5.00 VDC / day` | 10 educational questions evaluated at 0.50 VDC per correct answer. |
| **Referral Inviter Reward** | `+10.00 VDC` | Credited to unverified balance until invitee reaches Level 1 trust. |
| **Referral Invitee Bonus** | `+10.00 VDC` | Immediate welcome attribution for using a verified invite code. |
| **VandeCircle Member Boost**| `+0.02 VDC / hour` | Up to 5 trusted circle members (+0.10 VDC/h maximum boost). |
| **Initial Welcome Reward** | `+25.00 VDC` | Awarded upon completing profile setup, 2FA, and first session. |

---

## 3. Consensus & Mining Architecture

### 3.1 Eco-Friendly Proof-of-Participation (PoP)
- **Problem**: Google Play and Apple App Store Developer Policies strictly prohibit background cryptocurrency mining that consumes battery, heats devices, or runs CPU-intensive hashing algorithms.
- **Decision**: Proof-of-Work (PoW) is strictly forbidden. VandeCoin utilizes a lightweight **Proof-of-Participation (PoP)** session model:
  1. User taps "Start Session" to initiate a 24-hour participation session.
  2. The session start time, active rate, and expiry are recorded in the server-authoritative ledger.
  3. The local client displays an interpolated visual ticker based on `(now - startedAt) * ratePerHour`.
  4. At session completion or app reopen, the server validates the elapsed time and issues an immutable credit transaction to the user's ledger.
  5. Zero background CPU hashing, zero device battery drain.

---

## 4. Ledger & Balance Integrity

### 4.1 Immutable Double-Entry Inspired Ledger
- **Decision**: User balance is NEVER stored as an arbitrary client-writable scalar.
- **Enforcement**:
  - All balance changes are derived from verified `LedgerEntry` transactions.
  - Every transaction requires:
    - `txId`: Cryptographically unique identifier.
    - `refKey`: Idempotency key (e.g. `quiz-2026-09-11-user123`) preventing duplicate reward claims.
    - `category`: `mining` | `quiz` | `streak` | `referral` | `welcome` | `bonus`.
    - `amount`: Decimal VDC value.
    - `timestamp`: UTC ISO-8601 millisecond timestamp.
  - Balance reconciliation is executed dynamically:
    $$\text{Balance} = \sum \text{Credit Entries} - \sum \text{Debit Entries}$$

### 4.2 Multi-Tier Balance Pipeline (Wallet Shell)
1. **Unverified Rewards**: Rewards earned from referrals or community interactions that have not yet fulfilled anti-bot verification or L1 identity.
2. **Verified Rewards**: Rewards derived from authenticated 24-hour PoP sessions and verified educational quizzes.
3. **Eligible Simulated Balance**: Verified balance approved for staging into future ecosystem milestones.

---

## 5. Security & Identity Framework (VandeID)

### 5.1 BIP-39 Cryptographic Recovery Phrase
- **Decision**: Users are provided a 12-word cryptographic recovery phrase generated from 128-bit cryptographically secure pseudorandom entropy.
- **Storage**: Mnemonic phrases are stored exclusively in hardware-backed secure storage (`flutter_secure_storage` via Android Keystore and iOS Keychain).
- **Verification**: Users must complete an interactive verification modal (confirming random words) before unlocking Level 2 trust status.

### 5.2 Trust Level Progression (L0 to L4)
- **Level 0 (Visitor)**: Anonymous or unverified visitor.
- **Level 1 (Pioneer)**: Phone OTP or Email verified. Daily mining unlocked.
- **Level 2 (Secured)**: 12-word mnemonic generated and verified. Biometrics enabled.
- **Level 3 (VandeCircle)**: 3+ verified trusted circle connections established.
- **Level 4 (KYC-Ready)**: Reserved for future mainnet/testnet compliance identity.

---

## 6. Frontend Architecture & State Management

- **Framework**: Flutter (Multi-platform: Android, iOS, Web).
- **State Management**: **Flutter Riverpod (`flutter_riverpod`)**:
  - Decoupled business logic from UI.
  - Compile-time safety and declarative dependency injection.
  - Unidirectional data flow.
- **Navigation**: **GoRouter (`go_router`)**:
  - Declarative routing with deep-link support (`vandecoin://...`).
  - Global `redirect` guard checking authentication state.
- **Design System**: Centralized design tokens in `lib/core/theme/`:
  - `AppColors`: Tiranga-inspired Saffron (`#FF9933`), India Green (`#138808`), and Imperial Metallic Gold (`#FFD700`).
  - Dark mode by default (`#0A0A0A` obsidian background).
  - Custom vector graphics: 24-spoke Ashoka Chakra spinner and knurled coin medallion.
