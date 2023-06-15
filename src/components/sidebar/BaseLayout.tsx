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

      {/* <div className="select-none">
        <SideNavButton onClick={handleToggle} />
        <SideNav isOpen={isOpen} className="border">
          <LogoText />
          <SideNavLinks className="flex-grow px-2">
            <SideNavLink href="/home">
              <Home className="me-4 h-5 w-5" /> Home
            </SideNavLink>
            {session?.user.instructor &&
              <>
                <SideNavLink href="/teams">
                  <Users className="me-4 h-5 w-5" /> Teams
                </SideNavLink>
                <SideNavLink href="/forms">
                  <ClipboardList className="me-4 h-5 w-5" /> Evaluation Forms
                </SideNavLink>
              </>
            }
            {session?.user.student &&
              <SideNavLink href="/evaluations">
                <FileSpreadsheet className="me-4 h-5 w-5" /> Evaluations
              </SideNavLink>
            }
          </SideNavLinks> */}
      {/* profile picture menu */}
      {/* <UserProfile mounted={mounted}></UserProfile>
      </SideNav>
      {isOpen && (
        <div onClick={handleToggle} className="fixed inset-0 z-20 bg-black opacity-10 transition-all ease-in-out" aria-hidden="true"></div>
      )}
    </div> */}

      <main className={cn("md:ms-80 h-screen p-4 pb-6", className)}>
        {children}
      </main>
    </>
  );
};

function LogoText() {
  return (
    <div className="text-4xl font-bold  p-4 text-start mt-5 flex ">
      {/* gradient circle from dark blue to light blue */}
      <div className="h-[1em] w-[1em] rounded-full borde bg-gradient-to-br from-indigo-500 to-blue-800 mx-2 shadow-lg shadow-cyan-500/60"></div>
      <div className="bg-clip-text bg-gradient-to-r from-indigo-800 to-blue-600 text-transparent drop-shadow-2xl drop-shadow-indigo-500">TeamRate</div>
    </div>
  );
}

export default BaseLayout;
