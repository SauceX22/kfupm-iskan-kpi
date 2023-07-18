import { type HouseSubmissionStatus } from "@prisma/client"
import { cn } from "~/lib/utils"

type Props = {
    status: HouseSubmissionStatus
}

export const HouseSubmissionStatusText = ({ status }: Props) => {
    const getStatusColor = (status: HouseSubmissionStatus) => {
        switch (status) {
            case "NOT_STARTED":
                return "text-red-600"
            case "DONE_ON_TARGET" || "EARLY_SUBMISSION":
                return "text-green-600"
            case "LATE_SUBMISSION":
                return "text-yellow-600"
            default:
                return "text-orange-500"
        }
    }

    function toTitleCase(snakeCase: string): string {
        return snakeCase
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return (
        <span className={
            cn("text-center text-lg font-bold", getStatusColor(status))
        }>{toTitleCase(status)}</span>
    )
}