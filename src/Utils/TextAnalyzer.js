// Text analyzer for the monthly report
export function calculateTopPatterns(struggleArray, clarityArray = []) {
  const combinedTextItems = [];

  if (struggleArray && struggleArray.length > 0) {
    struggleArray.forEach((item) => {
      if (item.struggle_text) combinedTextItems.push(item.struggle_text);
    });
  }

  if (clarityArray && clarityArray.length > 0) {
    clarityArray.forEach((item) => {
      if (item.raw_thought) combinedTextItems.push(item.raw_thought);
    });
  }

  if (combinedTextItems.length === 0) return [];

  const frequencyMap = {};

  // Labels for diffrent patterns of thinking
  const patternIndicators = [
    {
      label: "All-or-Nothing Thinking",
      keywords: ["completely", "always", "never", "ruin", "totally", "fail"],
    },
    {
      label: "Overwhelmed Schedule Loops",
      keywords: [
        "busy",
        "schedule",
        "workload",
        "calendar",
        "deadlines",
        "too much",
      ],
    },
    {
      label: "Isolation Mindsets",
      keywords: ["alone", "myself", "nobody", "isolated"],
    },
  ];

  combinedTextItems.forEach((text) => {
    const textLower = text.toLowerCase();
    patternIndicators.forEach((indicator) => {
      indicator.keywords.forEach((keyword) => {
        if (textLower.includes(keyword)) {
          frequencyMap[indicator.label] =
            (frequencyMap[indicator.label] || 0) + 1;
        }
      });
    });
  });

  return Object.keys(frequencyMap)
    .map((word) => ({ word: word, count: frequencyMap[word] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

// Extracts the encouraging advice sentences/phrases from a friends perspective
export function calculateTopFriendPerspectives(clarityArray) {
  if (!clarityArray || clarityArray.length === 0) return [];
  const textItems = clarityArray
    .map((item) => item.friend_perspective)
    .filter(Boolean);
  return runPhraseFrequencyAnalysis(textItems);
}

// Extracts whole biblical promises/verses/phrases that keep coming up
export function calculateTopBiblicalTruths(clarityArray) {
  if (!clarityArray || clarityArray.length === 0) return [];
  const textItems = clarityArray
    .map((item) => item.biblical_truth)
    .filter(Boolean);
  return runPhraseFrequencyAnalysis(textItems);
}

// 🏆 tracks major wins and scores them to see what to highlight
export function extractBigWins(winsArray) {
  if (!winsArray || winsArray.length === 0) return [];

  const premiumWinKeywords = [
    "overcame",
    "conquered",
    "breakthrough",
    "proud",
    "finally",
    "completed",
    "finished",
    "achieved",
    "learned",
    "restored",
    "peaceful",
    "resolved",
    "shared",
    "connected",
  ];

  const scoredWins = winsArray.map((win) => {
    let score = 0;
    const textLower = win.win_text.toLowerCase();

    if (win.win_text.length > 45) score += 2;
    if (win.win_text.length > 80) score += 3;

    premiumWinKeywords.forEach((keyword) => {
      if (textLower.includes(keyword)) {
        score += 2;
      }
    });

    if (win.source === "night_strengths") score += 1;

    return { ...win, finalScore: score };
  });

  return scoredWins.sort((a, b) => b.finalScore - a.finalScore).slice(0, 3);
}

// makes sure things are displayed as sentences and breaks them up
function runPhraseFrequencyAnalysis(textItems) {
  if (textItems.length === 0) return [];
  const phraseMap = {};

  textItems.forEach((rawText) => {
    const sentences = rawText.split(/[.!?]/);

    sentences.forEach((sentence) => {
      let cleanSentence = sentence.trim().replace(/["']/g, "");
      if (cleanSentence.length < 15) return; // Ignore short filler phrases

      const matchKey = cleanSentence.toLowerCase().replace(/[^a-z0-9]/g, "");

      if (!phraseMap[matchKey]) {
        phraseMap[matchKey] = {
          displayPhrase: cleanSentence,
          count: 1,
        };
      } else {
        phraseMap[matchKey].count += 1;
      }
    });
  });

  // Sort by highest repeating count first
  return Object.values(phraseMap)
    .sort(
      (a, b) =>
        b.count - a.count || b.displayPhrase.length - a.displayPhrase.length,
    )
    .map((item) => ({ word: item.displayPhrase, count: item.count }))
    .slice(0, 3);
}
