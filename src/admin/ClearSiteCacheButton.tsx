import { Button, message, Popconfirm } from "antd";
import { useState } from "react";

import { clearSiteCache } from "./site";
import { SessionExpiredError } from "./species";

export function ClearSiteCacheButton({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [messages, contextHolder] = message.useMessage();

  async function clear() {
    setPending(true);
    try {
      const species = await clearSiteCache();
      void messages.success(
        species.length === 0
          ? "Site cache cleared."
          : `Site cache cleared. ${species.length} recently edited species refetched.`,
      );
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(
        "The site cache could not be cleared. Try again in a minute.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {contextHolder}
      <Popconfirm
        description="Species pages on reptiles.ge render fresh on their next visit. Species edited in the last 24 hours are refetched from the API."
        okText="Clear cache"
        onConfirm={clear}
        title="Clear the site cache?"
      >
        <Button loading={pending}>Clear site cache</Button>
      </Popconfirm>
    </>
  );
}
