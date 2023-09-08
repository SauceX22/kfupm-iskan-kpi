import * as React from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

const SideNav = React.forwardRef<HTMLDivElement, SideNavProps>(
  ({ className, isOpen, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "fixed top-0 z-40 h-screen w-80 border-r transition-transform start-0 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "flex h-full flex-col overflow-y-auto bg-card px-3 py-4 shadow-md rounded-e-xl last:mb-0",
        className
      )}
      {...props}
    />
  )
);
SideNav.displayName = "SideNav";

const SideNavButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "text-md mt-2 inline-flex items-center rounded-lg p-2 text-gray-500 ms-3 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden",
      className
    )}
    {...props}>
    <span className="sr-only">Open Side bar</span>
    <svg
      className="h-6 w-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
  </button>
));
SideNavButton.displayName = "SideNavButton";

const SideNavLinks = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("mt-5 flex flex-col gap-1 text-lg", className)}
    {...props}
  />
));
SideNavLinks.displayName = "SideNavLinks";

// sidenavlinks using next/link
const SideNavLink = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    href: string;
  }
>(({ className, href, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center rounded-lg bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}>
    <Link
      href={href}
      prefetch
      className="flex w-full cursor-pointer flex-row items-center space-x-5 transition-all duration-100 ease-in-out hover:translate-x-1">
      {props.children}
    </Link>
  </li>
));
SideNavLink.displayName = "SideNavLink";

export { SideNav, SideNavButton, SideNavLinks, SideNavLink };
