import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NoxHeroHeader() {
  return <nav className="nox-hero-header" aria-label="ناوبری اصلی" dir="ltr">
    <Link to="/" className="nox-hero-header__logo" aria-label="NOX — خانه">NOX</Link>
    <ul className="nox-hero-header__links">
      <li><Button variant="ghost" asChild><Link to="/shop">New Drop</Link></Button></li>
      <li><Button variant="ghost" asChild><Link to="/collections">Collections</Link></Button></li>
      <li><Button variant="ghost" asChild><Link to="/lookbook">Lookbook</Link></Button></li>
      <li><Button variant="ghost" asChild><Link to="/about">About</Link></Button></li>
    </ul>
  </nav>;
}