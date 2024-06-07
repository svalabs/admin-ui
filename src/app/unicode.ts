export function atou(b64Str: string) {
  const text = atob(b64Str);
  const length = text.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = text.charCodeAt(i);
  }
  const decoder = new TextDecoder(); // default is utf-8
  return decoder.decode(bytes);
}

export function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)));
}
