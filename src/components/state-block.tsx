import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "default" | "error";
  className?: string;
};

export default function HandleStateBlock({ children, tone, className }: Props) {
  const classes = ["state-block", tone === "error" ? "error" : null, className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
