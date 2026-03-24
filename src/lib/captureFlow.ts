import type { CaptureDebug, OraclePlacement, Task } from '../types/task';

const INTEREST_KEYWORDS = ['stripe', 'feature', 'project', 'fyp', 'build', 'interview'];
const CHALLENGE_KEYWORDS = ['implement', 'debug', 'design', 'pipeline', 'refactor'];
const NOVELTY_KEYWORDS = ['new', 'idea', 'explore', 'prototype', 'experiment'];
const URGENT_KEYWORDS = ['urgent', 'asap', 'today', 'tonight', 'tomorrow', 'deadline'];
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are an expert Executive Function Assistant designed for an ADHD user. Your job is to take messy, rambling, stream-of-consciousness voice-to-text transcriptions and extract structured, actionable data based on the ICNU framework.

Return ONLY a valid JSON object with this exact schema and no markdown:
{
  "task_name": "string",
  "category": "string",
  "task_size": "Small|Medium|Large|XL",
  "icnu_scores": {
    "interest": "integer 1-5",
    "challenge": "integer 1-5",
    "novelty": "integer 1-5",
    "urgency": "integer 1-5"
  },
  "energy_level": "Brain Dead|Normal|Hyperfocus",
  "next_physical_action": "string",
  "deadline": "ISO 8601 string or null",
  "oracle_placement": "On Fire|Momentum Builder|Rabbit Hole|The Vault",
  "status": "To Do|Paused|Done"
}`;

type ScoreKey = 'interest' | 'challenge' | 'novelty' | 'urgency';

type GeminiTaskSchema = {
  task_name: string;
  category: string;
  task_size: Task['taskSize'];
  icnu_scores: {
    interest: number;
    challenge: number;
    novelty: number;
    urgency: number;
  };
  energy_level: Task['energyLevel'];
  next_physical_action: string;
  deadline: string | null;
  oracle_placement: OraclePlacement;
  status: Task['status'];
};

function clampScore(value: number) {
  return Math.max(1, Math.min(5, value));
}

function buildTaskId() {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function normalizeGeminiTask(schema: GeminiTaskSchema, captureDebug: CaptureDebug): Task {
  return {
    id: buildTaskId(),
    taskName: schema.task_name.trim() || 'Captured task',
    category: schema.category.trim() || 'General',
    taskSize: schema.task_size,
    icnuScores: {
      interest: clampScore(schema.icnu_scores.interest),
      challenge: clampScore(schema.icnu_scores.challenge),
      novelty: clampScore(schema.icnu_scores.novelty),
      urgency: clampScore(schema.icnu_scores.urgency),
    },
    energyLevel: schema.energy_level,
    nextPhysicalAction: schema.next_physical_action.trim() || 'Open your notes and write one bullet.',
    deadline: schema.deadline,
    oraclePlacement: schema.oracle_placement,
    status: schema.status,
    createdAt: new Date().toISOString(),
    captureDebug,
  };
}

function parseJsonPayload(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return JSON.parse(trimmed);
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');

  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  throw new Error('No JSON object found in Gemini response.');
}

function isValidTaskSize(value: unknown): value is Task['taskSize'] {
  return value === 'Small' || value === 'Medium' || value === 'Large' || value === 'XL';
}

function isValidEnergyLevel(value: unknown): value is Task['energyLevel'] {
  return value === 'Brain Dead' || value === 'Normal' || value === 'Hyperfocus';
}

function isValidPlacement(value: unknown): value is OraclePlacement {
  return value === 'On Fire' || value === 'Momentum Builder' || value === 'Rabbit Hole' || value === 'The Vault';
}

function isValidStatus(value: unknown): value is Task['status'] {
  return value === 'To Do' || value === 'Paused' || value === 'Done';
}

function toGeminiTaskSchema(raw: unknown): GeminiTaskSchema {
  const data = raw as Partial<GeminiTaskSchema>;
  const icnu = data.icnu_scores as GeminiTaskSchema['icnu_scores'] | undefined;

  if (
    typeof data.task_name !== 'string' ||
    typeof data.category !== 'string' ||
    !isValidTaskSize(data.task_size) ||
    !isValidEnergyLevel(data.energy_level) ||
    typeof data.next_physical_action !== 'string' ||
    !isValidPlacement(data.oracle_placement) ||
    !isValidStatus(data.status) ||
    !icnu ||
    typeof icnu.interest !== 'number' ||
    typeof icnu.challenge !== 'number' ||
    typeof icnu.novelty !== 'number' ||
    typeof icnu.urgency !== 'number'
  ) {
    throw new Error('Gemini returned an invalid task schema.');
  }

  return {
    task_name: data.task_name,
    category: data.category,
    task_size: data.task_size,
    icnu_scores: icnu,
    energy_level: data.energy_level,
    next_physical_action: data.next_physical_action,
    deadline: typeof data.deadline === 'string' || data.deadline === null ? data.deadline : null,
    oracle_placement: data.oracle_placement,
    status: data.status,
  };
}

async function createTaskViaGemini(ramble: string): Promise<Task> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY');
  }

  const nowIso = new Date().toISOString();
  const userPrompt = `Current date-time: ${nowIso}\n\nCapture text: ${ramble}`;
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const result = await response.json();
  const text: string | undefined = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini response had no text payload.');
  }

  const rawTask = parseJsonPayload(text);
  const normalized = toGeminiTaskSchema(rawTask);

  const captureDebug: CaptureDebug = {
    inputTranscript: ramble,
    source: 'gemini',
    model: GEMINI_MODEL_NAME,
    capturedAt: new Date().toISOString(),
    geminiRawText: text,
    geminiRawResponse: JSON.stringify(result),
  };

  return normalizeGeminiTask(normalized, captureDebug);
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function scoreFromKeywords(text: string, key: ScoreKey) {
  const keywordMap: Record<ScoreKey, string[]> = {
    interest: INTEREST_KEYWORDS,
    challenge: CHALLENGE_KEYWORDS,
    novelty: NOVELTY_KEYWORDS,
    urgency: URGENT_KEYWORDS,
  };

  const keywords = keywordMap[key];
  const matches = keywords.filter((keyword) => text.includes(keyword)).length;

  if (matches >= 3) {
    return 5;
  }

  if (matches === 2) {
    return 4;
  }

  if (matches === 1) {
    return 3;
  }

  return key === 'urgency' ? 2 : 1;
}

function inferCategory(text: string) {
  if (hasKeyword(text, ['fyp', 'dissertation', 'uni', 'university', 'coursework'])) {
    return 'Final Year Project';
  }

  if (hasKeyword(text, ['bursary', 'rent', 'bank', 'bill', 'money', 'finance'])) {
    return 'Finances';
  }

  if (hasKeyword(text, ['stripe', 'career', 'interview', 'job'])) {
    return 'Career';
  }

  if (hasKeyword(text, ['form', 'admin', 'post', 'letter'])) {
    return 'Life Admin';
  }

  return 'General';
}

function inferTaskSize(text: string): Task['taskSize'] {
  if (hasKeyword(text, ['dissertation', 'thesis'])) {
    return 'XL';
  }

  if (hasKeyword(text, ['fyp', 'pipeline', 'project', 'feature'])) {
    return 'Large';
  }

  if (hasKeyword(text, ['draft', 'review', 'write', 'summary'])) {
    return 'Medium';
  }

  return 'Small';
}

function inferEnergyLevel(interest: number, challenge: number): Task['energyLevel'] {
  if (interest >= 4 || challenge >= 4) {
    return 'Hyperfocus';
  }

  if (interest <= 2 && challenge <= 2) {
    return 'Brain Dead';
  }

  return 'Normal';
}

function inferDeadline(text: string): string | null {
  const now = new Date();

  if (text.includes('today')) {
    const today = new Date(now);
    today.setHours(23, 59, 59, 0);
    return today.toISOString();
  }

  if (text.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 0);
    return tomorrow.toISOString();
  }

  return null;
}

function inferPlacement(
  urgency: number,
  energyLevel: Task['energyLevel'],
  interest: number,
  challenge: number,
): OraclePlacement {
  if (urgency >= 5) {
    return 'On Fire';
  }

  if (energyLevel === 'Brain Dead') {
    return 'Momentum Builder';
  }

  if (interest >= 4 || challenge >= 4) {
    return 'Rabbit Hole';
  }

  return 'The Vault';
}

function inferTaskName(ramble: string) {
  const firstSentence = ramble
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .find((sentence) => sentence.length > 0);

  if (!firstSentence) {
    return 'Captured task';
  }

  return firstSentence.slice(0, 80);
}

function inferNextPhysicalAction(taskName: string) {
  return `Open your notes and write one bullet to start: ${taskName}.`;
}

function buildTaskFromRamble(ramble: string): Task {
  const lower = ramble.toLowerCase();
  const interest = scoreFromKeywords(lower, 'interest');
  const challenge = scoreFromKeywords(lower, 'challenge');
  const novelty = scoreFromKeywords(lower, 'novelty');
  const urgency = scoreFromKeywords(lower, 'urgency');
  const energyLevel = inferEnergyLevel(interest, challenge);
  const taskName = inferTaskName(ramble);

  return {
    id: buildTaskId(),
    taskName,
    category: inferCategory(lower),
    taskSize: inferTaskSize(lower),
    icnuScores: {
      interest,
      challenge,
      novelty,
      urgency,
    },
    energyLevel,
    nextPhysicalAction: inferNextPhysicalAction(taskName),
    deadline: inferDeadline(lower),
    oraclePlacement: inferPlacement(urgency, energyLevel, interest, challenge),
    status: 'To Do',
    createdAt: new Date().toISOString(),
    captureDebug: {
      inputTranscript: ramble,
      source: 'fallback',
      model: 'local-heuristic-v1',
      capturedAt: new Date().toISOString(),
      geminiRawText: null,
      geminiRawResponse: null,
    },
  };
}

export async function sendCaptureRamble(ramble: string): Promise<Task> {
  try {
    return await createTaskViaGemini(ramble);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return buildTaskFromRamble(ramble);
  }
}
