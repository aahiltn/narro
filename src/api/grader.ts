// Define the endpoint and LanguageTool parameters
const url = "https://api.languagetoolplus.com/v2/check"; // Replace with your actual endpoint if different

// Function to calculate similarity
function similarityRatio(word1: string, word2: string): number {
  const longer = word1.length > word2.length ? word1 : word2;
  const shorter = word1.length > word2.length ? word2 : word1;

  if (longer.length === 0) return 1.0;

  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

// Helper function for similarity calculation (Levenshtein distance)
function editDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Function to remove punctuation
function removePunctuation(text: string): string {
  return text.replace(/[^\w\s]/g, "");
}

// Function to find the closest match for a word in a set of keywords
function findClosestMatch(
  word: string,
  keywords: Set<string>
): [string | null, number] {
  let closestKeyword: string | null = null;
  let highestSimilarity = 0;

  keywords.forEach((keyword) => {
    const similarity = similarityRatio(word, keyword);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      closestKeyword = keyword;
    }
  });

  return [closestKeyword, highestSimilarity];
}

// Function to call the LanguageTool API
async function checkSpellingWithLanguageTool(
  sentence: string,
  language: string
): Promise<any[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text: sentence,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error from LanguageTool API: ${response.statusText}`);
  }

  const result = await response.json();
  return result.matches; // Return all matches (errors)
}

// Function to grade a sentence
export async function gradeSentence(
  sentence: string,
  keywords: Set<string>,
  language: string
): Promise<number> {
  // Normalize the sentence by removing punctuation and converting to lowercase
  const cleanedSentence = removePunctuation(sentence.toLowerCase());
  const wordsInSentence = new Set(cleanedSentence.split(/\s+/));

  // Normalize keywords - convert all to lowercase
  const cleanedKeywords = new Set(
    Array.from(keywords).map((keyword) =>
      removePunctuation(keyword.toLowerCase())
    )
  );
  const correctKeywords = new Set<string>();

  const numKeywords = cleanedKeywords.size;
  const numWords = wordsInSentence.size;

  // Initialize penalties
  let spellingPenalty = 0;
  const closestMatches: {
    word: string;
    closestKeyword: string | null;
    similarity: number;
  }[] = [];

  // Set base penalty and similarity threshold for meaningful matches
  const basePenalty = 35 / numWords;
  const similarityThreshold = 0.6;

  const langCode = getLanguageCode(language);

  // Get errors (misspelled words) from LanguageTool
  const matches = await checkSpellingWithLanguageTool(sentence, langCode);

  // Check each word in the sentence against keywords (now case insensitive)
  wordsInSentence.forEach((word) => {
    const wordLower = word.toLowerCase();
    if (cleanedKeywords.has(wordLower)) {
      correctKeywords.add(wordLower);
    } else {
      const [closestKeyword, similarity] = findClosestMatch(
        wordLower,
        cleanedKeywords
      );
      closestMatches.push({ word, closestKeyword, similarity });

      const isMisspelled = matches.some(
        (match: any) =>
          sentence
            .toLowerCase()
            .slice(match.offset, match.offset + match.length)
            .toLowerCase() === wordLower
      );

      if (isMisspelled) {
        if (closestKeyword && similarity >= 0.8) {
          correctKeywords.add(closestKeyword);
          spellingPenalty += basePenalty * 0.5;
        } else if (closestKeyword && similarity >= similarityThreshold) {
          spellingPenalty += basePenalty;
        } else {
          spellingPenalty += basePenalty * 1.5;
        }
      }
    }
  });

  const keywordScore = (correctKeywords.size / numKeywords) * 100;
  const finalScore = Math.max(keywordScore - spellingPenalty, 0);

  return finalScore;
}

function getLanguageCode(language: string): string {
  const languageMap: { [key: string]: string } = {
    English: "en",
    Spanish: "es",
    French: "fr",
    German: "de",
    Italian: "it",
    Portuguese: "pt",
    Chinese: "zh",
    Japanese: "ja",
    Korean: "ko",
    Russian: "ru",
    Arabic: "ar",
    Hindi: "hi",
  };

  return languageMap[language] || "en"; // defaults to English if language not found
}
