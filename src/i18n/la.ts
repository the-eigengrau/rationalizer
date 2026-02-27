import type { Translations } from './types.js';

export const la: Translations = {
  menu: {
    beginSession: 'Meditationem incipe',
    pastEntries: 'Commentarii',
    statsAndLevel: 'Progressus',
    settings: 'Optiones',
    exit: 'Vale',
  },

  common: {
    back: '← Retro',
    cancel: '← Revoca',
    updated: 'Mutatum.',
    deleted: 'Deletum.',
  },

  passphrase: {
    enter: 'Tesseram inscribe',
    incorrect: 'Tessera falsa.',
    choose: 'Tesseram elige',
    confirm: 'Tesseram confirma',
    tooShort: 'Minimum VIII characteres.',
    mismatch: 'Tesserae non congruunt.',
  },

  settings: {
    aiProvider: 'Minister IA',
    localAI: 'IA localis (Ollama)',
    cloudAI: 'IA nubis (Claude)',
    noAI: 'Sine IA',
    anthropicApiKey: 'Clavis API Anthropic',
    ollamaModel: 'Exemplar Ollama',
    ollamaUrl: 'URL Ollama',
    encryption: 'Occultatio',
    encryptionMode: 'Modus occultationis',
    cached: 'Reposita (semel quaere, I horam memora)',
    alwaysAsk: 'Semper quaere',
    noEncryption: 'Sine occultatione',
    encryptionStatus: { cached: 'activa', always: 'activa', none: 'inactiva' },
    newEntriesOnly: 'Solum novi commentarii occultabuntur.',
    memories: 'Memoriae',
    noMemories: 'Nullae memoriae adhuc.',
    deleteOne: 'Memoriam dele',
    deleteAll: 'Omnia dele',
    select: 'Elige',
    deleteAllConfirm: 'Omnes memorias delere? Non revocari potest.',
    allDeleted: 'Omnes memoriae deletae.',
    preferences: 'Praeferentiae',
    enableAnimations: 'Animationes permitte?',
    language: 'Lingua',
    resetAllData: 'Omnia data rescinde',
    resetConfirm: 'Omnes commentarios, colloquia, et memorias delere?',
    dataCleared: 'Data purgata.',
  },

  entries: {
    noEntries: 'Nulli commentarii adhuc.',
    activatingEvent: 'Res Accidens',
    emotions: 'Affectus',
    beliefs: 'Opiniones',
    consequences: 'Consequentia',
    disputation: 'Disputatio',
    newPhilosophy: 'Philosophia Nova',
    conversation: 'Colloquium',
    you: 'Tu',
    rationalizer: 'Rationalizer',
  },

  stats: {
    streak: 'Series',
    longest: 'Longissima',
    entries: 'Commentarii',
    days: 'Dies',
    maxLevel: 'Gradus summus',
    daysToLevel: (current, required, name) => `${current}/${required} dies ad ${name}`,
  },

  prompts: {
    activatingEvent: {
      title: 'Res Accidens',
      description: 'Describe rem quae affectum tuum excitavit.',
      validation: 'Quaeso, describe quid acciderit.',
    },
    emotionBefore: {
      title: 'Affectus',
      description: 'Quos affectus sensisti? e.g., anxietas, ira, tristitia, culpa.',
      validation: 'Quaeso, affectus tuos describe.',
    },
    emotionIntensity: {
      title: 'Vehementia',
      description: 'Quam vehemens erat affectus? (I-C)',
    },
    beliefs: {
      title: 'Opiniones',
      description: 'Quid tibi dicebas? Quaere exigentias: oportet, debet, necesse est.',
      validation: 'Quaeso, opiniones tuas describe.',
    },
    consequences: {
      title: 'Consequentia',
      description: 'Quomodo egisti? Quid fecisti aut vitavisti?',
      validation: 'Quaeso, consequentia describe.',
    },
    disputation: {
      title: 'Disputatio',
      description: 'Opiniones tuas provoca. Ubi est evidentia?',
      validation: 'Quaeso, opiniones tuas disputa.',
    },
    newPhilosophy: {
      title: 'Philosophia Nova',
      description: 'Exigentias in praeferentias converte. Quae est sanior perspectiva?',
      validation: 'Quaeso, novam perspectivam describe.',
    },
    emotionAfter: {
      title: 'Post Meditationem',
      description: 'Quomodo nunc sentis, postquam haec perpendisti?',
      validation: 'Quaeso, describe quomodo sentias.',
    },
  },

  tips: [
    "Sentis quomodo cogitas. Muta cogitationem, muta affectum.",
    "Aliud est aliquid velle, aliud exigere.",
    "Te ipsum sine condicione accipe: dignus es quovis modo.",
    "Muta 'oportet' in 'malo' - et senties discrimen.",
    "Qui omnia mala vocant, calamitatem ex nihilo creant.",
    "Dicis 'ferre non possum.' Sed potes - et tulisti.",
    "Alii te iratum non faciunt. Opiniones tuae de illis faciunt.",
    "Qui sibi imperat 'debet,' miseriam sibi imperat.",
    "Opiniones irrationales disputare non est bene cogitare - est vere cogitare.",
    "Non est propositum nihil sentire, sed apte sentire.",
    "Approbatione aliorum non eges ut dignus sis.",
    "Omnes homines fallibiles sumus. Et tu. Id bene est.",
    "Incommodum non est periculum.",
    "Dignitas tua non uno eventu determinatur.",
    "Praeferentiae ad deceptionem ducunt. Exigentiae ad perturbationem.",
    "Quaere a te: 'Ubi est evidentia huius opinionis?'",
    "Seneca: 'Non qui parum habet, sed qui plus cupit, pauper est.'",
    "Nemo te perturbare potest sine permissione tua philosophica.",
    "Alios sine condicione accipe: homines ut homines agent.",
    "Elegans solutio: muta exigentiam, non mundum.",
  ],

  levels: {
    titles: {
      Neophyte: 'Tiro',
      Asketes: 'Exercens',
      Philosophos: 'Sapientiae Amator',
      Mathematikos: 'Discipulus',
      Dialektikos: 'Rationis Magister',
      Sophron: 'Temperans',
      Ataraxos: 'Imperturbatus',
      Sophos: 'Sapiens',
      Epistemon: 'Sciens',
    },
    descriptions: {
      Neophyte: 'Iter incipit',
      Asketes: 'Disciplina radicatur',
      Philosophos: 'Amor sapientiae crescit',
      Mathematikos: 'Ordo ex chao emergit',
      Dialektikos: 'Logica gladius tuus est',
      Sophron: 'Aequilibrium in omnibus',
      Ataraxos: 'Pax interior adepta',
      Sophos: 'Sapientia per te fluit',
      Epistemon: 'Vera scientia adepta',
    },
  },

  streak: {
    noActive: 'Nulla series activa',
    oneDay: 'I dies',
    nDays: (n) => `${n} dies`,
  },

  conversation: {
    doneHint: '/done ad finiendum',
    me: 'Ego',
    rationalizer: 'Rationalizer',
    error: (msg) => `Error: ${msg}`,
  },

  ai: {
    languageInstruction: `

## Language
Respond entirely in Classical Latin. Use Stoic philosophical vocabulary in the Senecan and Ciceronian register. Be direct and concise in the Roman style. When discussing REBT concepts, use the Stoic equivalents: opiniones for beliefs, perturbationes for disturbed emotions, disputatio for disputation, virtus for healthy functioning. The user's journal entry may be in any language — understand it, but always respond in Latin. Do not mix in English words.`,
    farewellSystemPrompt: `You generate a single concise Stoic one-liner in Classical Latin to close a journaling session. Write in the style of Seneca or Marcus Aurelius. The line should subtly reinforce the lesson from the person's reflection. No quotes, no attribution, no preamble — just the Latin line itself. One sentence, maximum 15 words. Use classical philosophical vocabulary.`,
    entryIntro: 'Ecce commentarium meum REBT hodierni diei:',
    entryLabels: {
      activatingEvent: 'Res Accidens',
      emotions: 'Affectus',
      intensity: 'vehementia',
      beliefs: 'Opiniones',
      consequences: 'Consequentia',
      disputation: 'Disputatio',
      newPhilosophy: 'Philosophia Nova',
      emotionAfter: 'Affectus Post Meditationem',
    },
  },

  levelUp: (name, title) => `▲ Ascensus — ${name}, ${title}`,
};
