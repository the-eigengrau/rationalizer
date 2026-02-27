import type { Translations, Language } from './types.js';
import { en } from './en.js';
import { la } from './la.js';
import { grc } from './grc.js';

const translations: Record<Language, Translations> = { en, la, grc };

let currentLanguage: Language = 'en';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

export function t(): Translations {
  return translations[currentLanguage];
}

export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    la: 'Latin',
    grc: 'Ancient Greek',
  };
  return names[lang];
}

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export type { Language, Translations } from './types.js';
