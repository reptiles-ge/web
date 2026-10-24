import { Button, message, Popconfirm } from "antd";
import { useState } from "react";

import { SessionExpiredError } from "./adminResponse";

export function ClearCacheButton({
  description,
  failure,
  label,
  onSessionExpired,
  run,
  size,
  title,
}: {
  description: string;
  failure: string;
  label: string;
  onSessionExpired: () => void;
  run: () => Promise<string>;
  size?: "middle" | "small";
  title: string;
}) {
  const [pending, setPending] = useState(false);
  const [messages, contextHolder] = message.useMessage();

  async function clear() {
    setPending(true);
    try {
      void messages.success(await run());
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(failure);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {contextHolder}
      <Popconfirm
        description={description}
        okText="Clear cache"
        onConfirm={clear}
        title={title}
      >
        <Button loading={pending} size={size}>
          {label}
        </Button>
      </Popconfirm>
    </>
  );
}
