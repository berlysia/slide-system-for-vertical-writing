import { type PropsWithChildren, type JSX } from "react";

type SlideProps = PropsWithChildren<{
  children: (() => JSX.Element) | JSX.Element;
}>;

export function Slide({ children }: SlideProps) {
  if (typeof children === "function") {
    return children();
  }
  return children;
}
