"use client"

import * as React from "react"

import { cn } from "~/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"


const CircularProgressVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
            },
            size: {
                default: "h-10 py-2 px-4",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface CircularProgressProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof CircularProgressVariants> {
    value: number
}

// TODO: fix all magic numbers. figure out what the hell is going on with the svg and those numbers

const CircularProgress = React.forwardRef<
    HTMLDivElement, CircularProgressProps
>(({ className, value, ...props }, ref) => (
    <div
        className="flex items-center justify-center overflow-hidden w-full rounded-full"
    >
        <svg className="w-20 h-20">
            <circle
                className="text-gray-300"
                strokeWidth="5"
                stroke="rgba(0,0,0,0.1)"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
            />
            <circle
                className="text-blue-600"
                strokeWidth="5"
                strokeDasharray={30 * 2 * Math.PI}
                strokeDashoffset={30 * 2 * Math.PI - value / 100 * 30 * 2 * Math.PI}
                strokeLinecap="round"
                stroke="rgb(29, 78, 216)"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
            />
        </svg>
        <span className="absolute text-md text-blue-700">{value}%</span>
    </div>
))
CircularProgress.displayName = CircularProgress.displayName

export { CircularProgress }
