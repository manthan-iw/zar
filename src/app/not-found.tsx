import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container" style={{ padding: '120px 0' }}>
      <h2>Page not found</h2>
      <p>The requested page could not be found.</p>
      <Link href="/">Go back home</Link>
    </section>
  );
}
