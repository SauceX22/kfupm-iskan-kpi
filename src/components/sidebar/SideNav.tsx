import * as React from "react"

import { cn } from "~/lib/utils"
import Link from "next/link"
import { Home } from "lucide-react"


interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
}

const SideNav = React.forwardRef<
    HTMLDivElement,
    SideNavProps
>(({ className, isOpen, ...props }, ref) => (
    <aside
        ref={ref}
        className={cn(
            "fixed border-r top-0 start-0 z-40 w-80 h-screen transition-transform md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "h-full px-3 py-4 overflow-y-auto bg-card rounded-e-xl shadow-md flex flex-col last:mb-0",
            className
        )}
        {...props}
    />
))
SideNav.displayName = "SideNav"

const SideNavButton = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn("inline-flex items-center p-2 mt-2 ms-3 text-md text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600", className)}
        {...props}
    >
        <span className="sr-only">Open Side bar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
    </button>
))
SideNavButton.displayName = "SideNavButton"

const SideNavLinks = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn(
            "mt-5 text-lg",
            className
        )}
        {...props}
    />
))
SideNavLinks.displayName = "SideNavLinks"


// sidenavlinks using next/link
const SideNavLink = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement> & {
        href: string
    }
>(({ className, href, ...props }, ref) => (
    <li
        ref={ref}
        className={cn(
            "flex items-center  text-gray-900 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700",
            className
        )}
        {...props}
    >
        <Link href={href} className="text-gray-600 hover:text-black hover:translate-x-1 flex cursor-default p-2 flex-row items-center space-x-5  w-full transition-all ease-in-out duration-100">
            {props.children}
        </Link>
    </li>
))
SideNavLink.displayName = "SideNavLink"


export { SideNav, SideNavButton, SideNavLinks, SideNavLink }
