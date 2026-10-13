import Image from "next/image";
import { coverGradient } from "@/lib/cover";

/** Section header: eyebrow, title with a serif gradient accent word, optional lede. */
export function SectionHead({
  eyebrow,
  title,
  accent,
  lede,
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  lede?: string;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="head" data-reveal>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2" id={id}>
          {title} <span className="serif grad-text">{accent}</span>
        </h2>
      </div>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </div>
  );
}

/** Image cover, or a generated pastel gradient with a glyph when there's no image. */
export function Cover({
  title,
  image,
  glyph,
  sizes = "(max-width: 640px) 100vw, 400px",
  className = "",
}: {
  title: string;
  image?: string;
  glyph?: string;
  sizes?: string;
  className?: string;
}) {
  if (image) {
    return (
      <div className={`cover ${className}`}>
        <Image src={image} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className={`cover ${className}`} aria-hidden="true">
      <div className="gen" style={{ background: coverGradient(title) }} />
      <div className="gridlines" />
      <div className="glyph">{glyph ?? "✦"}</div>
    </div>
  );
}
