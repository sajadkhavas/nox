import { Link } from "@tanstack/react-router";
import { useNoxVisuals } from "@/lib/nox-visuals";
import { canonicalNoxCategorySlug } from "@/lib/nox-category-paths";
import { Shell } from "@/components/lbb/ui/primitives";
export function NoxCategoryGuide({ slug }: { slug: string }) {
  const visuals = useNoxVisuals();
  const guide = visuals.catalog?.categories?.[canonicalNoxCategorySlug(slug)];
  if (!guide?.title || !guide.sections?.length) return null;
  const image = guide.image || visuals.categories?.[canonicalNoxCategorySlug(slug)];
  return (
    <section className="nox-category-guide" dir="rtl" aria-labelledby="nox-category-guide-title">
      <Shell className="nox-category-guide-grid">
        <div className="nox-category-guide-copy">
          <p className="nox-category-guide-label">راهنمای انتخاب از ناکس</p>
          <h2 id="nox-category-guide-title">{guide.title}</h2>
          {guide.sections.map((section, index) => (
            <section key={index}>
              <h3>{section.heading}</h3>
              <p>{section.text}</p>
            </section>
          ))}
          <div className="nox-category-guide-links">
            <Link to="/size-guide">راهنمای اندازه</Link>
            <Link to="/shipping-returns">ارسال و مرجوعی</Link>
            <Link to="/contact">از ناکس بپرس</Link>
          </div>
        </div>
        {image && (
          <figure className="nox-category-guide-photo">
            <img
              src={image}
              alt={guide.alt || `پوشاک ${guide.name} ناکس`}
              width={720}
              height={960}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{guide.name} / NOX Collection</figcaption>
          </figure>
        )}
      </Shell>
    </section>
  );
}
