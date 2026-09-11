import { Preferences } from '@capacitor/preferences';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { QuizQuestion, QuizQuestionPublic, QuizEvaluationResult } from '../types';
import { recordLedgerTransaction } from './ledgerService';

const QUIZ_LAST_DATE_KEY = 'vdc_last_quiz_date';

// Server-Authoritative Question Bank with genuine educational Web3 content
const MASTER_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does a blockchain fundamentally provide?',
    options: [
      'A decentralized, immutable ledger distributed across peer nodes',
      'A centralized database managed by a single corporation',
      'A proprietary video streaming protocol',
      'A physical graphics card for hardware hashing'
    ],
    correctIndex: 0,
    explanation: 'A blockchain is an immutable, append-only cryptographic ledger shared across decentralized nodes without requiring a central intermediary.',
    vdcReward: 1.00
  },
  {
    id: 2,
    question: 'How does VandeCoin avoid energy-intensive mining waste?',
    options: [
      'By running high-wattage GPU computation loops overnight',
      'By utilizing lightweight Proof-of-Participation and verified human presence',
      'By burning physical fossil fuels in data centers',
      'By forcing smartphones to run at maximum processor temperatures'
    ],
    correctIndex: 1,
    explanation: 'VandeCoin leverages Proof-of-Participation (PoP), rewarding genuine daily engagement and network validation without consuming device battery or computational hardware.',
    vdcReward: 1.00
  },
  {
    id: 3,
    question: 'What is the primary role of your VandeCircle?',
    options: [
      'Trading volatile high-risk derivatives with strangers',
      'Establishing a mutual web of social trust and validator security',
      'Sending automated spam messages across the internet',
      'Borrowing high-interest payday loans'
    ],
    correctIndex: 1,
    explanation: 'VandeCircles create sybil-resistant decentralized trust graphs, strengthening network security through verified interpersonal relationships.',
    vdcReward: 1.00
  },
  {
    id: 4,
    question: 'What is a smart contract in decentralized systems?',
    options: [
      'A scanned paper agreement signed with an ink pen',
      'Self-executing code that runs deterministically when conditions are met',
      'A wireless broadband data contract',
      'A smartphone subscription plan'
    ],
    correctIndex: 1,
    explanation: 'Smart contracts are immutable programs stored on a blockchain that execute deterministic actions automatically when specified parameters are fulfilled.',
    vdcReward: 1.00
  },
  {
    id: 5,
    question: 'Why is non-custodial key ownership vital in Web3?',
    options: [
      'It grants pioneers sovereign ownership over their identity and assets',
      'It allows centralized banks to freeze your wallet at will',
      'It makes private keys publicly visible on search engines',
      'It restricts account access to a single physical computer'
    ],
    correctIndex: 0,
    explanation: 'Non-custodial architecture ensures you maintain cryptographic custody of your private keys, preventing third parties from freezing or seizing your assets.',
    vdcReward: 1.00
  },
  {
    id: 6,
    question: 'What is a cryptographic hash function (e.g., SHA-256)?',
    options: [
      'A one-way mathematical algorithm producing a fixed-length fingerprint',
      'A spreadsheet calculation for tax optimization',
      'A hardware chip for phone cameras',
      'An image compression format like JPEG'
    ],
    correctIndex: 0,
    explanation: 'Cryptographic hash functions take any input data and produce a deterministic, irreversible fixed-length hash output.',
    vdcReward: 1.00
  },
  {
    id: 7,
    question: 'What is the purpose of a 12-word mnemonic recovery phrase?',
    options: [
      'A memorable backup representation of your cryptographic private master key',
      'A marketing slogan created by social networks',
      'A list of your 12 closest telephone contacts',
      'A temporary password that expires after 24 hours'
    ],
    correctIndex: 0,
    explanation: 'The 12-word BIP39 phrase is a human-readable representation of the cryptographic seed used to derive all your wallet keys.',
    vdcReward: 1.00
  },
  {
    id: 8,
    question: 'What protects a decentralized network against Sybil attacks?',
    options: [
      'Verified trust graphs, staking, and participation thresholds',
      'Relying entirely on a single company CEO to review signups',
      'Allowing unlimited bot accounts to vote equally',
      'Removing all cryptography from the protocol'
    ],
    correctIndex: 0,
    explanation: 'Sybil attacks are mitigated through Proof-of-Participation, trust webs, and verifiable identity friction, preventing fake bot proliferation.',
    vdcReward: 1.00
  },
  {
    id: 9,
    question: 'What is an idempotent transaction in a financial ledger?',
    options: [
      'An operation that produces the exact same result no matter how many times called',
      'A transaction that triples its balance upon every retry',
      'A transaction that only runs during full moons',
      'A payment that deletes all previous transaction history'
    ],
    correctIndex: 0,
    explanation: 'Idempotency guarantees that executing the same transaction multiple times (due to retries or network blips) never causes duplicate credits.',
    vdcReward: 1.00
  },
  {
    id: 10,
    question: 'How do peer-to-peer (P2P) networks differ from client-server architectures?',
    options: [
      'Nodes interact directly as equals without relying on a centralized host',
      'All traffic must pass through a single central corporate mainframe',
      'Nodes cannot communicate unless connected by physical cables',
      'P2P networks can only exist in university research laboratories'
    ],
    correctIndex: 0,
    explanation: 'In P2P architectures, participants share workloads and data directly with each other, providing fault tolerance and censorship resistance.',
    vdcReward: 1.00
  }
];

/**
 * Get current date string in UTC YYYY-MM-DD format
 */
function getTodayDateString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Check if the user has already completed the daily quiz today
 */
export async function canTakeDailyQuiz(uid: string): Promise<boolean> {
  const today = getTodayDateString();
  try {
    const { value } = await Preferences.get({ key: `${QUIZ_LAST_DATE_KEY}_${uid}` });
    if (value === today) {
      return false;
    }
  } catch (err) {
    console.warn('Preferences quiz check error:', err);
  }

  if (db && isFirebaseConfigured) {
    try {
      const attemptRef = doc(db, 'quiz_attempts', `quiz_${today}_${uid}`);
      const snap = await getDoc(attemptRef);
      if (snap.exists()) {
        await Preferences.set({ key: `${QUIZ_LAST_DATE_KEY}_${uid}`, value: today });
        return false;
      }
    } catch (err) {
      console.warn('Firestore quiz check error:', err);
    }
  }

  return true;
}

/**
 * Fetch public questions (without correct answers) for the daily quiz
 */
export function getDailyQuizQuestions(): QuizQuestionPublic[] {
  return MASTER_QUESTIONS.map(q => ({
    id: q.id,
    question: q.question,
    options: [...q.options],
    vdcReward: q.vdcReward,
  }));
}

/**
 * Evaluate a single answer server-side
 */
export function evaluateAnswer(questionId: number, selectedIndex: number): QuizEvaluationResult {
  const q = MASTER_QUESTIONS.find(item => item.id === questionId);
  if (!q) {
    return {
      questionId,
      selectedOption: selectedIndex,
      isCorrect: false,
      correctIndex: 0,
      explanation: 'Question not found',
      vdcReward: 0,
    };
  }

  const isCorrect = selectedIndex === q.correctIndex;
  return {
    questionId,
    selectedOption: selectedIndex,
    isCorrect,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    vdcReward: isCorrect ? q.vdcReward : 0,
  };
}

/**
 * Finalize quiz attempt, verify all answers, and record reward in ledger
 */
export async function submitDailyQuiz(
  uid: string, 
  answers: { questionId: number; selectedIndex: number }[]
): Promise<{
  success: boolean;
  score: number;
  totalQuestions: number;
  totalVdcEarned: number;
  results: QuizEvaluationResult[];
  error?: string;
}> {
  const today = getTodayDateString();
  const canTake = await canTakeDailyQuiz(uid);

  if (!canTake) {
    return {
      success: false,
      score: 0,
      totalQuestions: MASTER_QUESTIONS.length,
      totalVdcEarned: 0,
      results: [],
      error: 'You have already completed today\'s VandeQuiz! New quiz unlocks tomorrow.',
    };
  }

  let correctCount = 0;
  let earnedVdc = 0;
  const results: QuizEvaluationResult[] = [];

  answers.forEach(a => {
    const evalResult = evaluateAnswer(a.questionId, a.selectedIndex);
    results.push(evalResult);
    if (evalResult.isCorrect) {
      correctCount++;
      earnedVdc += evalResult.vdcReward;
    }
  });

  // Completion bonus: +2.00 VDC if score >= 8/10
  if (correctCount >= 8) {
    earnedVdc += 2.00;
  }

  earnedVdc = Number(earnedVdc.toFixed(2));

  // Mark quiz done for today in Preferences
  await Preferences.set({ key: `${QUIZ_LAST_DATE_KEY}_${uid}`, value: today });

  // Record reward in authoritative ledger
  const refKey = `quiz_${today}_${uid}`;
  const ledgerResult = await recordLedgerTransaction(uid, {
    title: 'Daily VandeQuiz Completed',
    activity: `${correctCount}/${MASTER_QUESTIONS.length} correct educational score`,
    amount: earnedVdc,
    timestamp: 'Just now',
    status: 'completed',
    category: 'quiz',
    refKey,
  });

  // Save attempt record to Firestore
  if (db && isFirebaseConfigured) {
    try {
      const attemptRef = doc(db, 'quiz_attempts', refKey);
      await setDoc(attemptRef, {
        userId: uid,
        date: today,
        score: correctCount,
        totalQuestions: MASTER_QUESTIONS.length,
        vdcEarned: earnedVdc,
        submittedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore quiz attempt write error:', err);
    }
  }

  return {
    success: ledgerResult.success,
    score: correctCount,
    totalQuestions: MASTER_QUESTIONS.length,
    totalVdcEarned: earnedVdc,
    results,
  };
}
