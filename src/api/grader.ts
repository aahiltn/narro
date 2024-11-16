// Define the endpoint and LanguageTool parameters
const url = "https://api.languagetoolplus.com/v2/check"; // Replace with your actual endpoint if different
const language = "es"; // Set to 'es' for Spanish

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

interface MatchResult {
  word: string;
  closestKeyword: string | null;
  similarity: number;
}

// Function to grade a sentence
function gradeSentence(sentence: string, keywords: Set<string>): number {
  // Normalize the sentence by removing punctuation
  const cleanedSentence = removePunctuation(sentence.toLowerCase());
  const wordsInSentence = new Set(cleanedSentence.split(/\s+/));

  // Normalize keywords
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
  const closestMatches: MatchResult[] = [];

  // Set base penalty and similarity threshold for meaningful matches
  const basePenalty = 35 / numWords;
  const similarityThreshold = 0.6; // Minimum similarity for considering a partial match

  // Check each word in the sentence against keywords
  wordsInSentence.forEach((word) => {
    if (cleanedKeywords.has(word)) {
      correctKeywords.add(word);
    } else {
      const [closestKeyword, similarity] = findClosestMatch(
        word,
        cleanedKeywords
      );
      closestMatches.push({ word, closestKeyword, similarity });

      if (closestKeyword && similarity >= 0.8) {
        correctKeywords.add(closestKeyword); // Treat as correct with partial credit
        spellingPenalty += basePenalty * 2;
      } else if (closestKeyword && similarity >= similarityThreshold) {
        spellingPenalty += basePenalty;
      }
    }
  });

  // Calculate the keyword score after adjusting for near matches
  const keywordScore = (correctKeywords.size / numKeywords) * 100;

  // Calculate the final score
  const finalScore = Math.max(keywordScore - spellingPenalty, 0);

  // Display results
  console.log(`Sentence: ${sentence}`);
  console.log(`Correct Keywords Found: ${Array.from(correctKeywords)}`);
  console.log(`Words and Closest Matches:`);
  closestMatches.forEach(({ word, closestKeyword, similarity }) => {
    console.log(
      `  - Word: ${word}, Closest Match: ${closestKeyword}, Similarity: ${similarity.toFixed(
        2
      )}`
    );
  });
  console.log(`Keyword Score (out of 100): ${keywordScore}`);
  console.log(`Spelling Penalty (relative): ${spellingPenalty}`);
  console.log(`Final Score (out of 100): ${finalScore}`);

  return finalScore;
}

// Example usage
const sentence = "La cuccaracha es triste en este momento.";
const keywords = new Set(["cucaracha", "triste", "gato"]);
gradeSentence(sentence, keywords);
