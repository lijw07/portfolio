import React, { useEffect, useState } from 'react';
import { Corners } from './SchemaDiagram';
import { Media, LINKS } from '../content';
import { releaseGameAudio } from '../gameAudio';

function Overlay({ onClose, narrow, play, children }: { onClose: () => void; narrow?: boolean; play?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const prevOverflow = root.style.overflow;
    root.style.setProperty('--sbw', `${scrollbarWidth}px`);
    root.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      root.style.overflow = prevOverflow;
      root.style.removeProperty('--sbw');
    };
  }, [onClose]);

  return (
    <div className={`overlay${play ? ' overlay-play' : ''}`} onClick={onClose} role="presentation">
      <div
        className={`card blueprint modal${narrow ? ' narrow' : ''}${play ? ' play' : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <Corners />
        {children}
      </div>
    </div>
  );
}

export function PlayModal({ media, onClose }: { media: Media; onClose: () => void }) {
  useEffect(() => {
    if (media.video) return;
    return () => releaseGameAudio();
  }, [media.video]);

  return (
    <Overlay onClose={onClose} play>
      <div className="modal-head">
        <span className="modal-title">{media.title}</span>
        <button className="btn btn-ghost" onClick={onClose}>✕ Close</button>
      </div>
      <div className="modal-media">
        {media.video ? (
          <video
            src={media.url}
            controls
            autoPlay
            playsInline
            controlsList="nofullscreen nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
          />
        ) : (
          <iframe src={media.url} title={media.title} allow="autoplay; fullscreen; gamepad" />
        )}
      </div>
    </Overlay>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', subject: '', message: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      setStatus('error');
      setError('-- email and message are required');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(LINKS.contactEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, subject: form.subject || '(no subject)', message: form.message }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setError('-- could not send right now, please try again');
      }
    } catch {
      setStatus('error');
      setError('-- network error, please try again');
    }
  };

  return (
    <Overlay onClose={onClose} narrow>
      <div className="modal-head">
        <span className="modal-title">INSERT INTO messages</span>
        <button className="btn btn-ghost" onClick={onClose}>✕ Close</button>
      </div>
      {status === 'sent' ? (
        <div className="contact-sent">
          <div className="kicker">COMMIT; -- 1 row affected</div>
          <h3>Message sent</h3>
          <p>Thanks for reaching out — I'll get back to you soon.</p>
          <div className="contact-sent-btns">
            <button className="btn btn-secondary" onClick={() => setStatus('idle')}>Send another</button>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      ) : (
        <form className="contact-form" onSubmit={send} noValidate>
          <div className="field">
            <label htmlFor="c-email">from_email</label>
            <input id="c-email" className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@domain.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="c-subject">subject</label>
            <input id="c-subject" className="input" type="text" value={form.subject} onChange={set('subject')} placeholder="What's this about?" />
          </div>
          <div className="field">
            <label htmlFor="c-message">body</label>
            <textarea id="c-message" className="input" value={form.message} onChange={set('message')} placeholder="Write your message…" />
          </div>
          {error && <div className="err">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </Overlay>
  );
}
