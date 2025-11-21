"use client"

type PrimaryPillButtonProps = {
  title: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export default function PrimaryButton({
  title,
  onClick,
  type = "button",
}: PrimaryPillButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-9 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      {title}
    </button>
  )
}
