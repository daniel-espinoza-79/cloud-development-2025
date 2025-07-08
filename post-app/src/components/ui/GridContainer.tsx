import type { ReactNode } from "react";

interface GridContainerProps {
  children: ReactNode;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    [key: string]: number | undefined;
  };
  gap?: number;
  className?: string;
}

const GridContainer = ({
  children,
  cols = { base: 1 , md : 2 , lg : 3 },
  gap = 4,
  className = "",
}: GridContainerProps) => {
  const classes = ["grid"];

  if (cols?.base) classes.push(`grid-cols-${cols.base}`);
  if (cols?.sm) classes.push(`sm:grid-cols-${cols.sm}`);
  if (cols?.md) classes.push(`md:grid-cols-${cols.md}`);
  if (cols?.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  if (cols?.xl) classes.push(`xl:grid-cols-${cols.xl}`);

  classes.push(`gap-${gap}`);
  if (className) classes.push(className);

  return <div className={classes.join(" ")}>{children}</div>;
};

export default GridContainer;
