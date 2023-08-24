import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomePageURL } from "#lib/urls";

export function GlobalNavigation() {
  const pathname = usePathname();
  const isActive = pathname === HomePageURL;

  return (
    <nav>
      <ul>
        <li>
          {!isActive ? <Link href={HomePageURL}>Home</Link> : <span>Home</span>}
        </li>
      </ul>
    </nav>
  );
}
