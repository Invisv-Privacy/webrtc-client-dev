const plants = [
  "Avocado",
  "Gooseberry",
  "Carambola",
  "Cherimoya",
  "Feijoa",
  "Fig",
  "Jaboticaba",
  "Jackfruit",
  "Jujube",
  "Loquat",
  "Lychee",
  "Macadamia",
  "Mango",
  "Mulberry",
  "Olive",
  "Papaya",
  "Pawpaw",
  "Pepino",
  "Persimmon",
  "Pineapple",
  "Pomegranate",
  "Sapodilla",
  "Tamarind",
  "Guava",
  "Sapote",
];

const adjectives = [
  "Anonymous",
  "Unidentified",
  "Unnamed",
  "Nameless",
  "Incognito",
  "Secret",
  "Pseudonymous",
  "Disguised",
  "Camouflaged",
  "Hidden",
  "Masked",
  "Masquerading",
  "Unknown",
  "Obscure",
];

export function generateName(): string {
  const plant = plants[Math.floor(Math.random() * plants.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adjective} ${plant} ${num}`;
}
