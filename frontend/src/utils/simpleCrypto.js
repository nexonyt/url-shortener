export function simpleEncrypt(text, key = 42) {
  return btoa(
    text
      .split("")
      .map(ch => String.fromCharCode(ch.charCodeAt(0) ^ key))
      .join("")
  );
}

export function simpleDecrypt(encoded, key = 42) {
  const decoded = atob(encoded);
  return decoded
    .split("")
    .map(ch => String.fromCharCode(ch.charCodeAt(0) ^ key))
    .join("");
}