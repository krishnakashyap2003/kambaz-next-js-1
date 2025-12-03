"use client"
import { ListGroup, ListGroupItem } from "react-bootstrap"; 
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses", path: "/Courses/1234/Home", icon: LiaBookSolid },
    { label: "Calendar",  path: "/Calendar",  icon: IoCalendarOutline },
    { label: "Inbox",     path: "/Inbox",     icon: FaInbox },
    { label: "Labs",      path: "/Labs",             icon: LiaCogSolid },
  ];
  return (
    <ListGroup id="wd-kambaz-navigation" style={{width: 120}}
         className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <ListGroupItem className="bg-black border-0 text-center" style={{ padding: '10px' }}>
        <a href="https://www.northeastern.edu/" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          <img 
            src="/Images/neu.png" 
            width="75" 
            height="75"
            alt="Northeastern University Logo"
            style={{ height: 'auto', width: '75px', maxWidth: '100%' }}
            onError={(e) => {
              console.error('Image failed to load:', e);
              // Fallback to try lowercase path
              (e.target as HTMLImageElement).src = '/images/neu.png';
            }}
          />
        </a>
      </ListGroupItem>
      <ListGroupItem as={Link} href="/Account"
        className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
        <FaRegCircleUser
          className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
        <br />
        Account
      </ListGroupItem>
      {links.map((link) => (
        <ListGroupItem key={link.label} as={Link} href={link.path}
          className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          {link.icon({ className: "fs-1 text-danger"})}
          <br />
          {link.label}
        </ListGroupItem>
      ))}
    </ListGroup>
);}