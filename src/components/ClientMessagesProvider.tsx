import type { ReactNode } from "react";

import { getMessages } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { IntlProvider } from "@/components/IntlProvider";
import {
  type ClientMessageNamespace,
  type ClientMessages,
  pickClientMessages,
  ROOT_CLIENT_MESSAGE_NAMESPACES,
} from "@/i18n/clientMessages";

export async function ClientMessagesProvider({
  children,
  locale,
  namespaces,
}: {
  children: ReactNode;
  locale: AppLocale;
  namespaces: readonly ClientMessageNamespace[];
}) {
  const messages = (await getMessages({ locale })) as ClientMessages;

  return (
    <IntlProvider
      locale={locale}
      messages={pickClientMessages(messages, [
        ...ROOT_CLIENT_MESSAGE_NAMESPACES,
        ...namespaces,
      ])}
    >
      {children}
    </IntlProvider>
  );
}
