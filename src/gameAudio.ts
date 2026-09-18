declare global {
  interface Window {
    __gameAudioCtx?: AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }
}

let keepAlive: AudioBufferSourceNode | undefined;

function revive(ctx: AudioContext): void {
  if (ctx.state !== 'running' && ctx.state !== 'closed') {
    ctx.resume().catch(() => {});
  }
}

function startKeepAlive(ctx: AudioContext): void {
  const frames = Math.max(1, Math.round(ctx.sampleRate));
  const source = ctx.createBufferSource();
  source.buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  source.loop = true;
  source.connect(ctx.destination);
  source.start(0);
  keepAlive = source;
}

function stopKeepAlive(): void {
  const source = keepAlive;
  keepAlive = undefined;
  if (!source) return;
  try {
    source.stop();
    source.disconnect();
  } catch {
    keepAlive = undefined;
  }
}

export function primeGameAudio(): void {
  try {
    const existing = window.__gameAudioCtx;
    if (existing && existing.state !== 'closed') {
      revive(existing);
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    startKeepAlive(ctx);
    ctx.addEventListener('statechange', () => revive(ctx));
    revive(ctx);
    window.__gameAudioCtx = ctx;
  } catch {
    window.__gameAudioCtx = undefined;
  }
}

export function releaseGameAudio(): void {
  const ctx = window.__gameAudioCtx;
  window.__gameAudioCtx = undefined;
  stopKeepAlive();
  if (ctx && ctx.state !== 'closed') {
    ctx.close().catch(() => {});
  }
}
