import { useState } from 'react';

export default function Cover({ src, title }: { src?: string; title: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return <div className="cover cover-empty" aria-hidden="true"><span>{title}</span></div>;
  }
  return <img className="cover" src={src} alt="" loading="lazy" onError={() => setBroken(true)} />;
}
