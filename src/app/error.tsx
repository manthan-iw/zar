'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <section className="container" style={{ padding: '120px 0' }}>
      <h2>Something went wrong.</h2>
      <button type="button" onClick={reset} style={{ marginTop: 12 }}>
        Try again
      </button>
    </section>
  );
}
