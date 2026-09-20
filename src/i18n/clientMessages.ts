export type ClientMessageNamespace = string;

export const ROOT_CLIENT_MESSAGE_NAMESPACES = [
  "errorPage",
  "language",
  "nav",
  "search",
  "theme",
] as const;

export const ATLAS_CLIENT_MESSAGE_NAMESPACES = [
  "card",
  "danger",
  "map",
  "speciesAtlas",
  "speciesIndex",
] as const;

export const GROUP_HUB_CLIENT_MESSAGE_NAMESPACES = [
  "amphibians",
  "birds",
  "card",
  "danger",
  "groupHubShared",
  "insects",
  "lizards",
  "mammals",
  "scorpions",
  "snakes",
  "spiders",
  "turtles",
] as const;

export const SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES = [
  "card",
  "danger",
  "profile",
] as const;

export function pickClientMessages(
  messages: Record<string, unknown>,
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
