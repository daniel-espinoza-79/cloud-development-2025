const SPANISH_BANNED_WORDS = [
  // General bad words
  "hijo de puta",
  "hija de puta",
  "hijueputa",
  "hijadeputa",
  "pendejo",
  "pendeja",
  "cabrón",
  "cabrona",
  "cabron",
  "idiota",
  "imbécil",
  "imbecil",
  "estúpido",
  "estupido",
  "tonto",
  "tonta",
  "bobo",
  "boba",
  "tarado",
  "tarada",

  // Insults
  "mierda",
  "caca",
  "carajo",
  "coño",
  "joder",
  "puto",
  "puta",
  "putita",
  "putito",
  "marica",
  "maricón",
  "maricon",
  "gay",
  "homosexual",

  // Regional insults
  "boludo",
  "boluda",
  "pelotudo",
  "pelotuda",
  "gilipollas",
  "capullo",
  "mamón",
  "mamona",
  "culero",
  "culera",
  "verga",
  "pija",
  "polla",

  // Familiar bad words
  "tu madre",
  "tu mamá",
  "tu papa",
  "tu vieja",
  "la concha de tu madre",
  "concha tu madre",

  // Dismination
  "negro de mierda",
  "indio de mierda",
  "cholo",
  "serrano",
  "provinciano",
  "ignorante",

  // Despective words
  "rata",
  "basura",
  "escoria",
  "lacra",
  "parasito",
  "parásito",
  "inútil",
  "util",
];



const ENGLISH_BANNED_WORDS = [
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "asshole",
  "damn",
  "hell",
  "crap",
  "bastard",
  "dickhead",
  "motherfucker",
  "son of a bitch",
  "piece of shit",
];

const QUECHUA_BANNED_WORDS = ["qhawa", "qhawana", "uma", "qhata"];

module.exports = {
  SPANISH_BANNED_WORDS,
  ENGLISH_BANNED_WORDS,
  QUECHUA_BANNED_WORDS,
  ALL_BANNED_WORDS: [
    ...SPANISH_BANNED_WORDS,
    ...ENGLISH_BANNED_WORDS,
    ...QUECHUA_BANNED_WORDS,
  ],
};
  