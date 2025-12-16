import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean
  message?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, show = false, message = "Carregando...", children, ...props }, ref) => {
    if (!show) {
      return <>{children}</>
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
          className
        )}
        {...props}
      >
        <div className="bg-background rounded-lg p-6 flex flex-col items-center gap-4 shadow-lg">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

export { LoadingOverlay }