import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <div className="wrapper">{children}</div>;
}

export function Center({ children }: PropsWithChildren) {
  return <div className="wrapper center">{children}</div>;
}

export function HeaderAndContent({ children }: PropsWithChildren) {
  return <div className="wrapper header-and-content">{children}</div>;
}
