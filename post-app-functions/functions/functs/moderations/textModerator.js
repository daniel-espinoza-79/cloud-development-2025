const { ALL_BANNED_WORDS } = require("./config/bannedWords");

const REPLACEMENT_TEXT = "[redacted]";

/**
 * NOrmalizes the input text to improve detection of banned words.
 * This function converts the text to lowercase, removes accents, and replaces
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, " ") // Only allow alphanumeric characters and spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();
}

/**
 * Creates variations of a word to improve detection of banned words.
 * @param {string} word
 * @returns {string[]}
 */
function createWordVariations(word) {
  const variations = [word];

  variations.push(word.replace(/[aeiou]/g, "*"));
  variations.push(word.replace(/[aeiou]/g, "@"));

  variations.push(
    word.replace(/o/g, "0").replace(/i/g, "1").replace(/e/g, "3")
  );

  variations.push(word.split("").join(" "));
  variations.push(word.split("").join("."));
  variations.push(word.split("").join("-"));

  return variations;
}

/**
 * Moderates a given text for banned words.
 * This function checks the text against a list of banned words and replaces them with a placeholder.
 * It normalizes the text to improve detection accuracy.
 * @param {string} text
 * @returns {object}
 */
function moderateText(text) {
  if (!text || typeof text !== "string") {
    return { moderated: false, text: text || "" };
  }

  let moderatedText = text;
  let wasModerated = false;
  const normalizedText = normalizeText(text);

  ALL_BANNED_WORDS.forEach((word) => {
    const variations = createWordVariations(word);

    variations.forEach((variation) => {
      // Regex with word boundaries to match whole words
      const regex = new RegExp(
        `\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi"
      );

      if (
        regex.test(normalizedText) ||
        text.toLowerCase().includes(variation)
      ) {
        // Replace the variation in the original text
        const originalRegex = new RegExp(
          word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        );
        if (originalRegex.test(text)) {
          moderatedText = moderatedText.replace(
            originalRegex,
            REPLACEMENT_TEXT
          );
          wasModerated = true;
        }
      }
    });
  });

  return {
    moderated: wasModerated,
    text: moderatedText,
  };
}

module.exports = {
  moderateText,
  normalizeText,
  createWordVariations,
};
