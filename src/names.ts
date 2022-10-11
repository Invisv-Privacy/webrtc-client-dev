const plants = [
  "avocado",
  "gooseberry",
  "carambola",
  "cherimoya",
  "feijoa",
  "fig",
  "jaboticaba",
  "jackfruit",
  "jujube",
  "loquat",
  "lychee",
  "macadamia",
  "mango",
  "mulberry",
  "olive",
  "papaya",
  "pawpaw",
  "pepino",
  "persimmon",
  "pineapple",
  "pomegranate",
  "sapodilla",
  "tamarind",
  "guava",
  "sapote",
];

const adjectives = [
  "anonymous",
  "unidentified",
  "unnamed",
  "nameless",
  "incognito",
  "secret",
  "pseudonymous",
  "disguised",
  "camouflaged",
  "hidden",
  "masked",
  "masquerading",
  "unknown",
  "obscure",
];

export function generateName(): string {
  const plant = plants[Math.floor(Math.random() * plants.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adjective}-${plant}-${num}`;
}
