import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn: (...classes: ClassValue[]) => string = (...classes: ClassValue[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return twMerge(clsx(...classes))
}
