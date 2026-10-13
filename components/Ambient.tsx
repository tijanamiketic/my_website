/**
 * Drifting pastel blobs + grain behind the glass. Both the drift and the scroll
 * parallax are CSS animations on transform/translate only (see globals.css).
 */
export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="blob b4" />
      <div className="grain" />
    </div>
  );
}
