

export async function generateFingerprint() {
  const canvasHash = await getCanvasHash();

  const fp = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth
    },
    hardware: {
      cpuCores: navigator.hardwareConcurrency,
      ramGB: navigator.deviceMemory ?? null
    },
    canvasHash,
    origin: window.location.origin
  };

  return fp; // 🔹 nic nie wysyłamy, tylko zwracamy obiekt
}

async function getCanvasHash() {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 60;
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.fillText("fingerprint test 😎", 2, 2);
  const data = canvas.toDataURL();
  return await sha256Hex(data);
}

async function sha256Hex(input) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
