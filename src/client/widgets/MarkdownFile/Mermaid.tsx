import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export function Mermaid({ chart }: { chart: string }) {
  const id = useRef(`mmd-${Math.random().toString(36).slice(2)}`);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    let active = true;
    mermaid.render(id.current, chart).then(({ svg }) => {
      if (active && ref.current) ref.current.innerHTML = svg;
    });
    return () => {
      active = false;
    };
  }, [chart]);
  return <div ref={ref} />;
}
