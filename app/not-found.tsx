import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap section">
      <div className="glass article" style={{ textAlign: "center" }}>
        <p className="eyebrow">404</p>
        <h1 className="h2">
          Page not <span className="serif grad-text">found</span>
        </h1>
        <p className="lede" style={{ margin: "1rem auto 2rem" }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
      </div>
    </main>
  );
}
