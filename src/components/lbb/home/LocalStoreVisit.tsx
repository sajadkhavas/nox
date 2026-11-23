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
 <div className="nox-visit__copy"><h2 id="local-store-title">از نزدیک، ناکس را ببین.</h2><p>اگر دوست داری جنس و تن‌خور لباس را از نزدیک ببینی، در فروشگاه ناکس منتظرت هستیم. تیشرت، شلوار بگ، هودی، کت و فیس‌ماسک را کنار هم ببین و استایل خودت را انتخاب کن.</p>
 <dl><div><dt><MapPin size={17}/>نشانی فروشگاه</dt><dd>{contact.addressLine || contact.locationLabel}</dd></div><div><dt><Clock3 size={17}/>زمان مراجعه</dt><dd>شنبه تا چهارشنبه ۱۱ تا ۲۰؛ پنجشنبه ۱۱ تا ۱۵؛ جمعه تعطیل</dd></div></dl>
 <div className="nox-visit__actions"><Link to="/contact" className="nox-editorial-link">مسیر و اطلاعات تماس <ArrowUpLeft size={17}/></Link><a href={contact.instagramUrl} className="nox-editorial-link"><Instagram size={17}/>اینستاگرام ناکس</a></div></div></div>
 </Shell></section>;
}
