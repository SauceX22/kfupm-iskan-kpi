import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { SideNav, SideNavButton, SideNavLink, SideNavLinks } from "./SideNav";
import { ClipboardList, FileSpreadsheet, Home, Users } from "lucide-react";

import { UserProfile } from './UserProfile';
import { cn } from "~/lib/utils";

type Props = {
  // custom props here...
  pageTitle: string;
  description?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const BaseLayout = ({ children, className, pageTitle, description }: Props) => {
  const router = useRouter();

  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Head>
        <title>
          {pageTitle}
        </title>
        <meta name="description" content={description} />
      </Head>

      <div className="select-none">
        <SideNavButton onClick={handleToggle} />
        <SideNav isOpen={isOpen} className="border">
          {/* LOGO HERE */}
          <SideNavLinks className="flex-grow px-2">
            <SideNavLink href="/home">
              <Home className="me-4 h-5 w-5" /> Home
            </SideNavLink>
            <SideNavLink href="/data">
              <Users className="me-4 h-5 w-5" /> Data
            </SideNavLink>
          </SideNavLinks>
          {/* profile picture menu */}
          {/* <UserProfile mounted={mounted}></UserProfile> */}
        </SideNav>
      </div>

      <main className={cn("md:ms-80 h-screen p-4 pb-6", className)}>
        {children}
      </main>
    </>
  );
};

export default BaseLayout;
