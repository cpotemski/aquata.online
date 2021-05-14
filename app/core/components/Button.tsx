import { ReactNode } from "react"

type ButtonProps = {
  name?: string
  submit?: boolean
  small?: boolean
  full?: boolean
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const Button = ({
  name,
  submit,
  small,
  full,
  children,
  className,
  onClick,
}: ButtonProps) => (
  <button
    name={name}
    type={submit ? "submit" : undefined}
    className={[
      className,
      "bg-blue rounded",
      small ? "px-2 py-1 text-xs" : "px-4 py-2",
      full ? "w-full" : "",
    ].join(" ")}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Button
