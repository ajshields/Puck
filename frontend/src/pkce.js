function base64URLEncode(arrayBuffer) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return base64;
}

function sha256(buffer) {
  return crypto.subtle.digest('SHA-256', buffer);
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await sha256(data);
  return base64URLEncode(hash);
}

function generateRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return base64URLEncode(array);
}

export async function generatePKCECodes() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}
