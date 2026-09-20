import type { ReactNode } from "react";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import {
  type ClientMessageNamespace,
  type ClientMessages,
  pickClientMessages,
  ROOT_CLIENT_MESSAGE_NAMESPACES,
} from "@/i18n/clientMessages";

export async function ClientMessagesProvider({
  children,
  namespaces,
}: {
  children: ReactNode;
  namespaces: readonly ClientMessageNamespace[];
}) {
  const messages = (await getMessages()) as ClientMessages;

  return (
    <NextIntlClientProvider
      messages={pickClientMessages(messages, [
        ...ROOT_CLIENT_MESSAGE_NAMESPACES,
        ...namespaces,
      ])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
