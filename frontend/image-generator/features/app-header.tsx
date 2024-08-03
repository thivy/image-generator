import Link from "next/link";
import { PropsWithChildren } from "react";

export const AppHeader = () => {
  return (
    <div className="container mx-auto max-w-4xl py-3">
      <HeaderButton href="/">Home</HeaderButton>
    </div>
  );
};

type Props = PropsWithChildren & {
  href: string;
};

const HeaderButton = (props: Props) => {
  return <Link href={props.href}>{props.children}</Link>;
};
