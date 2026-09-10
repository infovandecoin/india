# Google Play Store Listing & Submission Guide

Use this document to copy and paste metadata directly into your **Google Play Console** dashboard (`play.google.com/console`).

---

## 1. Store Listing Details

### App Name (30 characters max)
```
VandeCoin: Learn, Earn & Build
```

### Short Description (80 characters max)
```
Participate daily, learn blockchain concepts, build trust circles & earn VDC.
```

### Full Description (4000 characters max)
```
Welcome to VandeCoin (VDC) — an authentic, global participation-driven digital ecosystem engineered around our founding philosophy: LEARN • PARTICIPATE • EARN • BUILD.

VandeCoin is designed for individuals worldwide who believe digital progress should be inclusive, transparent, and rewarding. Whether you are discovering blockchain concepts for the first time or building a community network of trusted peers, VandeCoin empowers you to earn through everyday knowledge and collaboration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 CORE ECOSYSTEM PILLARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ECO-FRIENDLY DAILY PARTICIPATION (ZERO HARDWARE STRAIN)
• Activate your daily Proof-of-Participation session with a single tap.
• 100% Eco-Friendly: No CPU-heavy hashing, zero battery degradation, and zero background processing. Your device stays cool, fast, and secure.
• Real-time countdown timers and session status tracking.

2. VANDEQUIZ (LEARN & EARN)
• Master foundational concepts in Web3, decentralized networks, cryptography, and modern economics.
• Interactive quizzes with immediate explanations and instant knowledge feedback.
• Earn direct VDC bonus rewards for high accuracy and knowledge retention.

3. VANDECIRCLE (SOCIAL TRUST NETWORKS)
• Connect with verified pioneers to form your personal 10-member trust circle.
• Elevate your Circle Trust Strength and unlock collective network multiplier bonuses.
• Visual orbital graph to inspect connection health, trust scores, and mutual contributions.

4. 30-DAY STREAKS & SHIELDS
• Build lasting habits with daily consistency rewards.
• Multi-tiered streak ladders (7, 14, 30, and 90-day milestones).
• Protect your progress with Streak Shields so unexpected missed days never reset your hard work.

5. GLOBAL & NATIONAL LEADERBOARDS
• Compete with pioneers across India and worldwide.
• Filter rankings across Weekly, Monthly, and All-Time participation metrics.
• Live real-time rank updates powered by Cloud Firestore.

6. INSTITUTIONAL-GRADE SECURITY
• Native Passkey and biometric authentication support.
• Real-time cloud synchronization backed by Google Cloud infrastructure.
• Transparent offline-first cache with full local device data ownership.
• Google Play compliant account management with permanent self-service data deletion.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇮🇳 BOLD • TRUSTWORTHY • GLOBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Born with an Indian heart and built for a brighter global future, VandeCoin celebrates authentic human participation over speculative gambling.

Join millions of forward-thinking pioneers today. Download VandeCoin and start your journey!

---
Support & Community:
Website: https://vandecoin.network
Inquiries & Privacy: privacy@vandecoin.network
```

---

## 2. Categorization & Contact Details

- **Application Type:** App
- **Category:** Finance / Productivity / Education
- **Content Rating:** Everyone (PEGI 3 / ESRB Everyone)
- **Target Age:** 13+ (Teens & Adults)
- **Email:** support@vandecoin.network
- **Website:** https://vandecoin.network
- **Privacy Policy URL:** `https://vandecoin.network/privacy` (Host `PRIVACY_POLICY.md` on your domain or GitHub Pages)

---

## 3. Google Play Data Safety Questionnaire Cheat Sheet

When prompted in Google Play Console > App Content > **Data Safety**, select:

| Question | Answer |
|---|---|
| Does your app collect or share user data? | **Yes** |
| Is all data collected encrypted in transit? | **Yes** (TLS 1.3 via Firebase) |
| Do you provide a way for users to request data deletion? | **Yes** (In-app Profile > Delete Account, plus support email) |

### Specific Data Types Declared:
1. **Personal Info -> Email Address**:
   - Purpose: *App Functionality, Account Management*
   - Collected: *Yes*
   - Shared: *No*
2. **Personal Info -> User IDs (VandeID handle)**:
   - Purpose: *App Functionality, Account Management, Fraud Prevention*
   - Collected: *Yes*
   - Shared: *No*
3. **App Info & Performance -> Crash Logs / Diagnostics**:
   - Purpose: *Analytics, Diagnostics*
   - Collected: *Yes (via Firebase Analytics)*
   - Ephemeral: *Aggregated & Anonymous*

---

## 4. Financial Products & Cryptocurrency Declaration (Reviewer Note)

When prompted about Cryptocurrency / Financial Services:
- Select: **Does not perform on-device hardware mining.**
- Description note for Google Reviewers:
  > *"VandeCoin does not perform on-device cryptocurrency mining. The application utilizes a non-hardware-intensive Proof-of-Participation model where users receive gamified community loyalty points and educational rewards. No device hardware (CPU/GPU) is strained and no fiat currency transactions occur."*
