import React from "react";
import { CARD_STYLES } from "@/constants/design.constants";
import { cn } from "@/utils/classNames.utils";

export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly padding?: CardPadding;
}

export const Card = ({
  children,
  className,
  padding = "md",
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(CARD_STYLES.base, CARD_STYLES.padding[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};
