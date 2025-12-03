"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ListGroup from "react-bootstrap/ListGroup";

export default function AccountNavigation() {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const links = currentUser 
    ? (currentUser.role === "ADMIN" ? ["Profile", "Users"] : ["Profile"])
    : ["Signin", "Signup"];
  const linkToHref: Record<string, string> = {
    Signin: "/Account/Signin",
    Signup: "/Account/Signup",
    Profile: "/Account/Profile",
    Users: "/Account/Users",
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div id="wd-account-navigation" style={{ minWidth: 220 }}>
      <ListGroup className="wd list-group fs-5 rounded-0">
        {links.map((link) => {
          const href = linkToHref[link];
          return (
            <Link
              key={link}
              href={href}
              id={`wd-account-${link.toLowerCase()}-link`}
              className={`list-group-item border-0 ${
                isActive(href) ? "active" : "text-danger"
              }`}
            >
              {link}
            </Link>
          );
        })}
      </ListGroup>
    </div>
  );
}