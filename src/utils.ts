import cryptoRandomString from "crypto-random-string";

const plants = [
  "Achachairu",
  "Avocado",
  "Breadfruit",
  "Carambola",
  "Cherimoya",
  "Dragonfruit",
  "Feijoa",
  "Fig",
  "Gooseberry",
  "Guava",
  "Ice Cream Bean",
  "Imbe",
  "Jaboticaba",
  "Jackfruit",
  "Jujube",
  "Loquat",
  "Lucuma",
  "Lychee",
  "Macadamia",
  "Mango",
  "Mangosteen",
  "Marula",
  "Mulberry",
  "Olive",
  "Papaya",
  "Pawpaw",
  "Pepino",
  "Persimmon",
  "Pineapple",
  "Pitangatuba",
  "Pomegranate",
  "Rambutan",
  "Sapodilla",
  "Sapote",
  "Surinam Cherry",
  "Tamarind",
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

export function generateRandomizedString(param: string | null): string {
  const result: string =
    param !== undefined && param !== null
      ? param
      : cryptoRandomString({ length: 20, type: "url-safe" });
  
  return result;
}
