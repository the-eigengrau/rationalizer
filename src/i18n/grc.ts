import type { Translations } from './types.js';

export const grc: Translations = {
  menu: {
    beginSession: 'Ἄρξαι μελέτην',
    pastEntries: 'Ὑπομνήματα',
    statsAndLevel: 'Πρόοδος',
    settings: 'Ῥυθμίσεις',
    exit: 'Χαῖρε',
  },

  common: {
    back: '← Ὀπίσω',
    cancel: '← Ἀνάκλησις',
    updated: 'Μεταβέβληται.',
    deleted: 'Ἀπηλείφθη.',
  },

  passphrase: {
    enter: 'Σύνθημα εἴσαγε',
    incorrect: 'Σύνθημα ψευδές.',
    choose: 'Σύνθημα ἑλοῦ',
    confirm: 'Σύνθημα βεβαίωσον',
    tooShort: 'Ἐλάχιστον ὀκτὼ γράμματα.',
    mismatch: 'Τὰ συνθήματα οὐ συμφωνοῦσιν.',
  },

  settings: {
    aiProvider: 'Πάροχος ΤΝ',
    localAI: 'Τοπικὴ ΤΝ (Ollama)',
    cloudAI: 'Νεφελικὴ ΤΝ (Claude)',
    noAI: 'Ἄνευ ΤΝ',
    anthropicApiKey: 'Κλεὶς API Anthropic',
    ollamaModel: 'Ὑπόδειγμα Ollama',
    ollamaUrl: 'URL Ollama',
    encryption: 'Κρυπτογραφία',
    encryptionMode: 'Τρόπος κρυπτογραφίας',
    cached: 'Ἀποθηκευμένη (ἅπαξ ἐρώτησον, μίαν ὥραν μνημόνευε)',
    alwaysAsk: 'Ἀεὶ ἐρώτα',
    noEncryption: 'Ἄνευ κρυπτογραφίας',
    encryptionStatus: { cached: 'ἐνεργός', always: 'ἐνεργός', none: 'ἀνενεργός' },
    newEntriesOnly: 'Μόνον νέα ὑπομνήματα κρυπτογραφηθήσονται.',
    memories: 'Μνῆμαι',
    noMemories: 'Οὐδεμία μνήμη ἔτι.',
    deleteOne: 'Μνήμην ἀπάλειψον',
    deleteAll: 'Πάσας ἀπάλειψον',
    select: 'Ἐκλέξαι',
    deleteAllConfirm: 'Πάσας τὰς μνήμας ἀπαλεῖψαι; Ἀνέκκλητον.',
    allDeleted: 'Πᾶσαι αἱ μνῆμαι ἀπηλείφθησαν.',
    preferences: 'Προτιμήσεις',
    enableAnimations: 'Κινήσεις ἐπιτρέπειν;',
    language: 'Γλῶσσα',
    resetAllData: 'Πάντα δεδομένα ἀνάστρεψον',
    resetConfirm: 'Πάντα ὑπομνήματα, διαλόγους, καὶ μνήμας ἀπαλεῖψαι;',
    dataCleared: 'Δεδομένα ἐκαθάρθησαν.',
  },

  entries: {
    noEntries: 'Οὐδὲν ὑπόμνημα ἔτι.',
    activatingEvent: 'Τὸ Συμβάν',
    emotions: 'Πάθη',
    beliefs: 'Δόξαι',
    consequences: 'Ἀποτελέσματα',
    disputation: 'Ἔλεγχος',
    newPhilosophy: 'Νέα Φιλοσοφία',
    conversation: 'Διάλογος',
    you: 'Σύ',
    rationalizer: 'Rationalizer',
  },

  stats: {
    streak: 'Συνέχεια',
    longest: 'Μακροτάτη',
    entries: 'Ὑπομνήματα',
    days: 'Ἡμέραι',
    maxLevel: 'Ἀνώτατος βαθμός',
    daysToLevel: (current, required, name) => `${current}/${required} ἡμέραι πρὸς ${name}`,
  },

  prompts: {
    activatingEvent: {
      title: 'Τὸ Συμβάν',
      description: 'Γράψον τὸ πρᾶγμα τὸ κινῆσαν τὸ πάθος σου.',
      validation: 'Γράψον τί συνέβη.',
    },
    emotionBefore: {
      title: 'Πάθη',
      description: 'Τίνα πάθη ᾔσθου; π.χ., ἀγωνία, ὀργή, λύπη, αἰσχύνη.',
      validation: 'Γράψον τὰ πάθη σου.',
    },
    emotionIntensity: {
      title: 'Σφοδρότης',
      description: 'Πόσον σφοδρὸν ἦν τὸ πάθος; (α΄-ρ΄)',
    },
    beliefs: {
      title: 'Δόξαι',
      description: 'Τί ἔλεγες σεαυτῷ; Ζήτει ἀπαιτήσεις: δεῖ, χρή, ἀνάγκη.',
      validation: 'Γράψον τὰς δόξας σου.',
    },
    consequences: {
      title: 'Ἀποτελέσματα',
      description: 'Πῶς ἔπραξας; Τί ἐποίησας ἢ ἀπέφυγες;',
      validation: 'Γράψον τὰ ἀποτελέσματα.',
    },
    disputation: {
      title: 'Ἔλεγχος',
      description: 'Ἔλεγξον τὰς δόξας σου. Ποῦ ἡ ἀπόδειξις;',
      validation: 'Πειρῶ ἐλέγξαι τὰς δόξας σου.',
    },
    newPhilosophy: {
      title: 'Νέα Φιλοσοφία',
      description: 'Μετάβαλε τὰς ἀπαιτήσεις εἰς προτιμήσεις. Τίς ὑγιεστέρα γνώμη;',
      validation: 'Γράψον νέαν γνώμην.',
    },
    emotionAfter: {
      title: 'Μετὰ τὴν Σκέψιν',
      description: 'Πῶς αἰσθάνῃ νῦν, μετὰ τὴν διαλογισμόν;',
      validation: 'Γράψον πῶς αἰσθάνῃ.',
    },
  },

  tips: [
    "Αἰσθάνῃ ὡς φρονεῖς. Μετάβαλε τὴν διάνοιαν, μετάβαλε τὸ πάθος.",
    "Ἄλλο τὸ βούλεσθαι, ἄλλο τὸ ἀπαιτεῖν.",
    "Δέχου σεαυτὸν ἄνευ αἱρέσεως· ἄξιος εἶ πάντως.",
    "Μετάβαλε τὸ 'δεῖ' εἰς τὸ 'βούλομαι' - καὶ αἴσθου τὴν διαφοράν.",
    "Οἱ πάντα δεινὰ καλοῦντες ἐκ μηδενὸς συμφορὰν ποιοῦσιν.",
    "Λέγεις 'οὐ δύναμαι φέρειν.' Ἀλλὰ δύνασαι - καὶ ἤνεγκας.",
    "Οὐχ οἱ ἄλλοι σε ὀργίζουσιν, ἀλλ' αἱ σαὶ δόξαι περὶ αὐτῶν.",
    "Ὁ ἑαυτῷ ἐπιτάσσων 'δεῖ' ἑαυτῷ δυστυχίαν ἐπιτάσσει.",
    "Τὸ ἐλέγχειν ἀλόγους δόξας οὐκ ἔστιν εὖ φρονεῖν - ἀληθῶς φρονεῖν ἐστιν.",
    "Οὐ τὸ μηδὲν πάσχειν σκοπός, ἀλλὰ τὸ προσηκόντως πάσχειν.",
    "Οὐ δέῃ τῆς τῶν ἄλλων ἐπιδοκιμασίας ἵνα ἄξιος ᾖς.",
    "Πάντες ἄνθρωποι σφαλλόμεθα. Καὶ σύ. Καὶ τοῦτο καλῶς ἔχει.",
    "Ἡ δυσχέρεια οὐκ ἔστι κίνδυνος.",
    "Ἡ ἀξία σου οὐχ ὑπὸ ἑνὸς πράγματος ὁρίζεται.",
    "Αἱ προτιμήσεις εἰς ἀπογοήτευσιν φέρουσιν· αἱ ἀπαιτήσεις εἰς ταραχήν.",
    "Ἐρώτησον σεαυτόν· 'Ποῦ ἡ ἀπόδειξις ταύτης τῆς δόξης;'",
    "Ἐπίκτητος· 'Ταράσσει τοὺς ἀνθρώπους οὐ τὰ πράγματα, ἀλλὰ τὰ δόγματα.'",
    "Οὐδεὶς δύναταί σε ταράξαι ἄνευ τῆς σῆς φιλοσοφικῆς συγκαταθέσεως.",
    "Δέχου τοὺς ἄλλους ἄνευ αἱρέσεως· οἱ ἄνθρωποι ὡς ἄνθρωποι πράξουσιν.",
    "Ἡ κομψὴ λύσις· μετάβαλε τὴν ἀπαίτησιν, μὴ τὸν κόσμον.",
  ],

  levels: {
    titles: {
      Neophyte: 'Ὁ Ἀρχόμενος',
      Asketes: 'Ὁ Ἀσκητής',
      Philosophos: 'Ὁ Φιλόσοφος',
      Mathematikos: 'Ὁ Μαθηματικός',
      Dialektikos: 'Ὁ Διαλεκτικός',
      Sophron: 'Ὁ Σώφρων',
      Ataraxos: 'Ὁ Ἀτάραχος',
      Sophos: 'Ὁ Σοφός',
      Epistemon: 'Ὁ Ἐπιστήμων',
    },
    descriptions: {
      Neophyte: 'Ἡ ὁδὸς ἄρχεται',
      Asketes: 'Ἡ ἄσκησις ῥιζοῦται',
      Philosophos: 'Ἡ φιλοσοφία αὐξάνεται',
      Mathematikos: 'Ἡ τάξις ἐκ τοῦ χάους',
      Dialektikos: 'Ὁ λόγος τὸ ξίφος σου',
      Sophron: 'Μετριότης ἐν πᾶσιν',
      Ataraxos: 'Ἡ ἀταραξία κατωρθώθη',
      Sophos: 'Ἡ σοφία διὰ σοῦ ῥεῖ',
      Epistemon: 'Ἡ ἀληθὴς γνῶσις κτηθεῖσα',
    },
  },

  streak: {
    noActive: 'Οὐδεμία ἐνεργὸς συνέχεια',
    oneDay: 'α΄ ἡμέρα',
    nDays: (n) => `${n} ἡμέραι`,
  },

  conversation: {
    doneHint: '/done πρὸς τὸ τέλος',
    me: 'Ἐγώ',
    rationalizer: 'Rationalizer',
    error: (msg) => `Σφάλμα: ${msg}`,
  },

  ai: {
    languageInstruction: `

## Language
Respond entirely in Ancient Greek (Attic/Koine) with polytonic accents. Use Stoic philosophical vocabulary throughout. Write in the style of Epictetus and the Stoic tradition. When discussing REBT concepts, use the Stoic equivalents: δόξαι for beliefs, πάθη for disturbed passions, ἔλεγχος for disputation, ἀρετή for healthy functioning, ἀταραξία for equanimity. The user's journal entry may be in any language — understand it, but always respond in Ancient Greek. Do not mix in English words.`,
    farewellSystemPrompt: `You generate a single concise Stoic one-liner in Ancient Greek (polytonic Attic/Koine) to close a journaling session. Write in the style of Epictetus or Marcus Aurelius. The line should subtly reinforce the lesson from the person's reflection. No quotes, no attribution, no preamble — just the Greek line itself. One sentence, maximum 15 words. Use polytonic accents and Stoic philosophical vocabulary.`,
    entryIntro: 'Ἰδοὺ τὸ ὑπόμνημά μου REBT τῆς σήμερον:',
    entryLabels: {
      activatingEvent: 'Τὸ Συμβάν',
      emotions: 'Πάθη',
      intensity: 'σφοδρότης',
      beliefs: 'Δόξαι',
      consequences: 'Ἀποτελέσματα',
      disputation: 'Ἔλεγχος',
      newPhilosophy: 'Νέα Φιλοσοφία',
      emotionAfter: 'Πάθη Μετὰ τὴν Σκέψιν',
    },
  },

  levelUp: (name, title) => `▲ Ἀνάβασις — ${name}, ${title}`,
};
