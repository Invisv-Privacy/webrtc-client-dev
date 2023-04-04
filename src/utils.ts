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

// The following checks are just copied from livekit's client-sdk-js for convenience here
export function isWeb(): boolean {
  return typeof document !== "undefined";
}

export function isFireFox(): boolean {
  if (!isWeb()) return false;
  return navigator.userAgent.indexOf("Firefox") !== -1;
}

export function isSafari(): boolean {
  if (!isWeb()) return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isMobile(): boolean {
  if (!isWeb()) return false;
  return /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent);
}
