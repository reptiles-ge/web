import type { ReactNode } from "react";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import {
  type ClientMessageNamespace,
  pickClientMessages,
} from "@/i18n/clientMessages";

export async function ClientMessagesProvider({
  children,
  namespaces,
}: {
  children: ReactNode;
  namespaces: readonly ClientMessageNamespace[];
}) {
  const messages = (await getMessages()) as Record<string, unknown>;

  return (
    <NextIntlClientProvider messages={pickClientMessages(messages, namespaces)}>
      {children}
    </NextIntlClientProvider>
  );
}
