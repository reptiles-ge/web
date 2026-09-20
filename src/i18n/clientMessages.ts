import type kaMessages from "../../messages/ka.json";

export type ClientMessageNamespace = keyof typeof kaMessages;
export type ClientMessages = Partial<Record<ClientMessageNamespace, unknown>>;

export const ROOT_CLIENT_MESSAGE_NAMESPACES = [
  "language",
  "nav",
  "search",
  "theme",
] as const satisfies readonly ClientMessageNamespace[];

export const NOT_FOUND_CLIENT_MESSAGE_NAMESPACES = [
  ...ROOT_CLIENT_MESSAGE_NAMESPACES,
  "errorPage",
] as const satisfies readonly ClientMessageNamespace[];

export const ATLAS_CLIENT_MESSAGE_NAMESPACES = [
  "card",
  "danger",
  "map",
  "speciesAtlas",
  "speciesIndex",
] as const satisfies readonly ClientMessageNamespace[];

export const GROUP_HUB_SHARED_CLIENT_MESSAGE_NAMESPACES = [
  "card",
  "danger",
  "groupHubShared",
] as const satisfies readonly ClientMessageNamespace[];

export const SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES = [
  "card",
  "danger",
  "profile",
] as const satisfies readonly ClientMessageNamespace[];

export function pickClientMessages(
  messages: ClientMessages,
  namespaces: readonly ClientMessageNamespace[],
) {
  return Object.fromEntries(
    namespaces.flatMap((namespace) =>
      Object.hasOwn(messages, namespace)
        ? [[namespace, messages[namespace]]]
        : [],
    ),
  );
}
