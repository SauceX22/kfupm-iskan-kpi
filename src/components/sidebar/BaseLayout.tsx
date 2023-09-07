import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { Home, Users } from "lucide-react";
import { useSession } from "next-auth/react";

import { SideNav, SideNavButton, SideNavLink, SideNavLinks } from "./SideNav";

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
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="select-none">
        <SideNavButton onClick={handleToggle} />
        <SideNav isOpen={isOpen} className="border rounded-none">
          <div className="flex justify-center items-center w-full py-4 px-2">
            <Image
              src="/kfupm-logo-text-green-en.svg"
              alt="KFUPM Logo"
              width={300}
              height={20}
              priority={false}
            />
          </div>
          <SideNavLinks className="flex-grow px-2">
            <SideNavLink href="/home">
              <Home className="me-4 h-5 w-5" /> Home
            </SideNavLink>
            <SideNavLink href="/data">
              <Users className="me-4 h-5 w-5" /> Data
            </SideNavLink>
            <SideNavLink href="/graph">
              <Users className="me-4 h-5 w-5" /> Graph
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
