import { ReactNode } from "react"
import { motion } from "framer-motion"

import { fadeIn } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    subtitle?: string
    actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className={cn("flex items-start justify-between gap-4 pb-2")}
        >
            <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {subtitle ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </motion.div>
    )
}
