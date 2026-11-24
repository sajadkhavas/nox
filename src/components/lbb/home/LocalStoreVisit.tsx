import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, MapPin, Clock3, Instagram } from "lucide-react";
import { useNoxVisuals } from "@/lib/nox-visuals";
import { useStorefrontControl } from "@/lib/storefront-control";
import { Shell } from "@/components/lbb/ui/primitives";
export function LocalStoreVisit(){
 const {contact,localStore}=useStorefrontControl();const visuals=useNoxVisuals();
 return <section className="nox-visit" dir="rtl" aria-labelledby="local-store-title"><Shell>
 <div className="nox-section-kicker"><span dir="ltr">05 / VISIT NOX</span><span>فروشگاه حضوری ناکس</span></div>
 <div className="nox-visit__grid"><div className="nox-visit__photo"><img src={visuals.store ?? localStore.imageUrl ?? "/brand/editorial/store.webp"} alt="فروشگاه حضوری پوشاک ناکس؛ دیوار NOX و رگال لباس‌های استریت‌ویر" width={1280} height={853} loading="lazy" decoding="async"/></div>
 <div className="nox-visit__copy nox-store-design">
 <header className="nox-store-design__header"><p className="nox-store-design__eyebrow" dir="ltr">Physical Store</p><h2 id="local-store-title">فروشگاه حضوری ناکس</h2><p>از نزدیک، ناکس را ببین. تیشرت، شلوار بگ، هودی، کت و فیس‌ماسک را کنار هم ببین و استایل خودت را انتخاب کن.</p><span className="nox-store-design__divider" aria-hidden="true"/></header>
 <ul className="nox-store-design__tags" aria-label="پوشاک فروشگاه">{["تیشرت","شلوار بگ","هودی","کت","فیس‌ماسک"].map(tag=><li key={tag}>{tag}</li>)}</ul>
 <dl className="nox-store-design__cards"><div><dt><span className="nox-store-design__icon"><MapPin size={18}/></span><span>نشانی</span></dt><dd>{contact.addressLine || contact.locationLabel}</dd></div><div><dt><span className="nox-store-design__icon"><Clock3 size={18}/></span><span>ساعت کاری</span></dt><dd>شنبه تا چهارشنبه ۱۱–۲۰<br/>پنجشنبه ۱۱–۱۵<br/><span>جمعه تعطیل</span></dd></div></dl>
 <div className="nox-store-design__actions"><Link to="/contact" className="nox-store-design__primary"><MapPin size={17}/>مسیر و اطلاعات تماس</Link><a href={contact.instagramUrl} className="nox-store-design__secondary"><Instagram size={17}/>اینستاگرام ناکس</a></div>
 </div></div>
 </Shell></section>;
}
