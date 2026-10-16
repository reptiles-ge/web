import type kaMessages from "../../messages/ka.json";

export type ClientMessageNamespace = keyof typeof kaMessages;
export type ClientMessagePath =
  `${ClientMessageNamespace}.${string}` | ClientMessageNamespace;

export type ClientMessages = Partial<Record<ClientMessageNamespace, unknown>>;

export const ROOT_CLIENT_MESSAGE_NAMESPACES = [
  "language",
  "nav",
  "notFound",
  "rating",
  "search",
  "theme",
] as const satisfies readonly ClientMessageNamespace[];

export const LOCALE_LAYOUT_CLIENT_MESSAGE_NAMESPACES = [
  ...ROOT_CLIENT_MESSAGE_NAMESPACES,
  "errorPage",
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

export const GROUP_HUB_CLIENT_MESSAGES = [
  "danger",
  "groupHubShared.catalog",
] as const satisfies readonly ClientMessagePath[];

export const SPECIES_GUIDE_ROW_CLIENT_MESSAGES = [
  "danger",
  "groupHubShared.openProfile",
  "groupHubShared.openProfileNamed",
  "groupHubShared.turtleStatusIntroduced",
  "groupHubShared.turtleStatusNative",
  "groupHubShared.turtleTypeLand",
  "groupHubShared.turtleTypeWater",
] as const satisfies readonly ClientMessagePath[];

export const CLUSTER_GUIDE_CLIENT_MESSAGES = [
  ...SPECIES_GUIDE_ROW_CLIENT_MESSAGES,
  "groupHubShared.rangePending",
  "map",
  "speciesIndex",
] as const satisfies readonly ClientMessagePath[];

export const SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES = [
  "card",
  "danger",
  "profile",
] as const satisfies readonly ClientMessageNamespace[];

type MessageTree = Record<string, unknown>;

export function pickClientMessages(
  messages: ClientMessages,
  paths: readonly ClientMessagePath[],
) {
  const picked: MessageTree = {};

  for (const path of paths) {
    const keys = path.split(".");
    let source: unknown = messages;
    for (const key of keys) {
      source =
        isMessageTree(source) && Object.hasOwn(source, key)
          ? source[key]
          : undefined;
    }
    if (source === undefined) continue;

    let target = picked;
    for (const key of keys.slice(0, -1)) {
      const next = target[key];
      target[key] = isMessageTree(next) ? next : {};
      target = target[key] as MessageTree;
    }
    target[keys[keys.length - 1]] = source;
  }

  return picked;
}

function isMessageTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null;
}
