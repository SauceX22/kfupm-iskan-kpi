import React, { } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ChevronRight } from "lucide-react";

import {
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import {
    LogOut,
    Settings,
    User,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Skeleton } from "../ui/skeleton";

type Props = {
    // custom props here...
    mounted: boolean;
};


export const UserProfile = (props: Props) => {
    const { data: session } = useSession();
    const router = useRouter();


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`flex items-center justify-between  p-4 rounded-lg group 
                 ${props.mounted && session?.user ? `hover:bg-gray-50` : `cursor-default`}`}>
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={session?.user?.image ?? undefined} />
                            <AvatarFallback>
                                <Skeleton className="group-hover:border" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="h-full flex-grow flex flex-col items-start">
                            <h4 className="text-lg font-semibold">
                                {session?.user?.name ?? <Skeleton className="h-5 mb-1 w-40" />}
                            </h4>
                            <div className="text-sm font-medium text-gray-500">
                                {session?.user?.email ?? <Skeleton className="h-4 w-20" />}
                            </div>
                        </div>
                    </div>
                    {session?.user && <ChevronRight />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onCloseAutoFocus={e => e.preventDefault()} className="w-56 mb-10" side={'right'} align="center" alignOffset={20}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-800 hover:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
