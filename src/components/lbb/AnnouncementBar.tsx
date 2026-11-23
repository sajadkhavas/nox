import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { safePublicHref } from "@/lib/public-href";
import { useStorefrontControl, type AnnouncementItem } from "@/lib/storefront-control";

export const ANNOUNCEMENT_HEIGHT = 36;

export function publicAnnouncements(items: AnnouncementItem[]) {
  return items.flatMap((item) => {
    const href = safePublicHref(item.href);
    return href && item.text.trim() ? [{ ...item, href }] : [];
  });
}

/** One accessible list plus a non-interactive visual copy for a seamless loop. */
export function AnnouncementBar() {
  const { announcements, brand } = useStorefrontControl();
  const messages = publicAnnouncements(announcements);
  const [paused, setPaused] = useState(false);
  if (!messages.length) return null;

  return (
    <aside aria-label={`اطلاعیه‌های ${brand.nameFa}`} className="nox-announcements">
      <div className="nox-announcements__viewport">
        <div className="nox-announcements__track" data-paused={paused}>
          {[false, true].map((duplicate) => (
            <div
              key={String(duplicate)}
              className="nox-announcements__group"
              aria-hidden={duplicate || undefined}
            >
              {messages.map((item, index) => (
                <span className="nox-announcements__item" key={`${index}-${item.text}`}>
                  {duplicate ? (
                    <span>{item.text}</span>
                  ) : (
                    <a href={item.href} dir="auto">
                      {item.text}
                    </a>
                  )}
                  <span aria-hidden="true" className="nox-announcements__divider">
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="nox-announcements__toggle"
        aria-label={paused ? "ادامه حرکت نوار اطلاعیه" : "توقف حرکت نوار اطلاعیه"}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
      </button>
    </aside>
  );
}
