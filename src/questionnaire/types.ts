export interface REBTEntry {
  id: string;
  createdAt: string;       // ISO 8601
  dateKey: string;          // YYYY-MM-DD
  emotionIntensity: number; // 1-100

  // The ABCDE model fields (stored encrypted)
  activatingEvent: string;
  beliefs: string;
  consequences: string;
  disputation: string;
  effectiveNewPhilosophy: string;
  emotionBefore: string;
  emotionAfter: string;
}

export type REBTSensitiveData = Omit<REBTEntry, 'id' | 'createdAt' | 'dateKey' | 'emotionIntensity'>;

export interface EncryptedEntry {
  id: string;
  created_at: string;
  date_key: string;
  emotion_intensity: number;
  encrypted_data: string;
  iv: string;
  auth_tag: string;
}

export interface Memory {
  id: string;
  createdAt: string;
  category: 'personal' | 'pattern' | 'progress' | 'theme';
  content: string;
  sourceEntryId?: string;
}

export interface EncryptedMemory {
  id: string;
  created_at: string;
  category: string;
  content: string;
  source_entry_id: string | null;
  iv: string;
  auth_tag: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  entryId: string;
  createdAt: string;
  messages: ConversationMessage[];
}

export interface EncryptedConversation {
  id: string;
  entry_id: string;
  created_at: string;
  messages: string;
  iv: string;
  auth_tag: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  totalDays: number;
  lastEntryDate: string | null;
}

export interface LevelInfo {
  name: string;
  title: string;
  description: string;
  requiredDays: number;
  icon: string;
}

export type AIProvider = 'anthropic' | 'ollama' | 'none';
export type EncryptionMode = 'cached' | 'always' | 'none';

export interface AppConfig {
  version: number;
  encryption: {
    mode: EncryptionMode;
    salt: string;
    iterations: number;
    cacheTTLMinutes: number;
    sentinel?: string;
    sentinelIv?: string;
    sentinelAuthTag?: string;
  };
  ai: {
    provider: AIProvider;
    anthropicApiKey: string;
    ollamaModel: string;
    ollamaUrl: string;
  };
  preferences: {
    showTips: boolean;
    animationsEnabled: boolean;
  };
}
