import React, { useEffect, useState } from 'react';

interface ScrollDebuggerProps {
  refs: {
    name: string;
    ref: React.RefObject<HTMLDivElement | null>;
  }[];
}

const ScrollDebugger: React.FC<ScrollDebuggerProps> = ({ refs }) => {
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateOffsets = () => {
      const newOffsets: Record<string, number> = {};
      refs.forEach(({ name, ref }) => {
        if (ref.current) {
          newOffsets[name] = ref.current.offsetTop;
        }
      });
      setOffsets(newOffsets);
      setScrollY(window.scrollY);
    };

    updateOffsets();
    window.addEventListener('scroll', updateOffsets);
    window.addEventListener('resize', updateOffsets);

    return () => {
      window.removeEventListener('scroll', updateOffsets);
      window.removeEventListener('resize', updateOffsets);
    };
  }, [refs]);

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div>ScrollY: {scrollY}</div>
      <div>---</div>
      {Object.entries(offsets).map(([name, offset]) => (
        <div key={name}>
          {name}: {offset}
          {scrollY >= offset - 50 && scrollY < offset + 100 && ' ← current'}
        </div>
      ))}
    </div>
  );
};

export default ScrollDebugger;