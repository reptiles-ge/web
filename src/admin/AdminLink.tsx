import type { ReactNode } from "react";

import { Typography } from "antd";

import { followLink } from "./router";

export function AdminLink({
  children,
  path,
  strong,
}: {
  children: ReactNode;
  path: string;
  strong?: boolean;
}) {
  return (
    <Typography.Link
      href={path}
      onClick={(event) => followLink(event, path)}
      strong={strong}
    >
      {children}
    </Typography.Link>
  );
}
