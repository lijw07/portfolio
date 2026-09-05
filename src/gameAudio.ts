declare global {
  interface Window {
    __gameAudioCtx?: AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }
}

export function primeGameAudio(): void {
  try {
    const existing = window.__gameAudioCtx;
    if (existing && existing.state !== 'closed') {
      existing.resume().catch(() => {});
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const src = ctx.createBufferSource();
    src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    src.connect(ctx.destination);
    src.start(0);
    ctx.resume().catch(() => {});
    window.__gameAudioCtx = ctx;
  } catch {
    window.__gameAudioCtx = undefined;
  }
}

export function releaseGameAudio(): void {
  const ctx = window.__gameAudioCtx;
  window.__gameAudioCtx = undefined;
  if (ctx && ctx.state !== 'closed') {
    ctx.close().catch(() => {});
  }
}
