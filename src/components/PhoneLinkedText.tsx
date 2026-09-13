import {
  Children,
  cloneElement,
  type ComponentProps,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";
import { splitPhoneLinks } from "@/lib/phoneLinks";
import { splitSpeciesInlineLinks } from "@/lib/speciesInlineLinks";

const PHONE_LINK_CLASS_NAME =
  "font-medium underline decoration-current/40 underline-offset-[3px] transition-colors hover:decoration-current";
const INLINE_LINK_CLASS_NAME =
  "font-medium underline decoration-current/40 underline-offset-[3px] transition-colors hover:decoration-current";
const INTERNAL_ROUTE_LINK = /\[([^\]]+)\]\((\/[^)]+)\)/g;

type RouteLinkPart =
  | { href: ComponentProps<typeof Link>["href"]; label: string; type: "route" }
  | { type: "text"; value: string };

export function PhoneLinkedText({ children }: { children: ReactNode }) {
  return <>{linkPhonesInNode(children)}</>;
}

function isSkippable(element: ReactElement): boolean {
  if (element.type === "a" || element.type === "button") return true;
  const props = element.props as { href?: unknown };
  return props.href != null;
}

function linkPhonesInNode(node: ReactNode): ReactNode {
  if (node == null || typeof node === "boolean") return node;
  if (typeof node === "number") return node;
  if (typeof node === "string") return renderPhoneLinkedString(node);
  if (Array.isArray(node)) {
    return Children.map(node, (child) => linkPhonesInNode(child));
  }
  if (!isValidElement(node)) return node;
  if (isSkippable(node)) return node;

  const props = node.props as { children?: ReactNode };
  if (props.children == null) return node;
  return cloneElement(node, undefined, linkPhonesInNode(props.children));
}

function renderPhoneLinkedString(text: string): ReactNode {
  const parts = splitInternalRouteLinks(text);
  if (parts.length > 1 || parts[0].type !== "text") {
    return parts.map((part, index) => {
      if (part.type === "route") {
        return (
          <Link
            className={INLINE_LINK_CLASS_NAME}
            href={part.href}
            key={`r:${index}:${part.href}:${part.label}`}
          >
            {part.label}
          </Link>
        );
      }

      return (
        <Fragment key={`t:${index}`}>
          {renderSpeciesAndPhoneLinks(part.value)}
        </Fragment>
      );
    });
  }

  return renderSpeciesAndPhoneLinks(text);
}

function renderPhoneOnlyLinks(text: string): ReactNode {
  const parts = splitPhoneLinks(text);
  if (parts.length === 1 && parts[0].type === "text") return text;

  let cursor = 0;
  return parts.map((part) => {
    const at = cursor;
    if (part.type === "text") {
      cursor += part.value.length;
      return <Fragment key={`t:${at}`}>{part.value}</Fragment>;
    }
    cursor += part.display.length;
    return (
      <a
        className={PHONE_LINK_CLASS_NAME}
        href={`tel:${part.tel}`}
        key={`p:${at}:${part.tel}`}
      >
        {part.display}
      </a>
    );
  });
}

function renderSpeciesAndPhoneLinks(text: string): ReactNode {
  const parts = splitSpeciesInlineLinks(text);
  if (parts.length > 1 || parts[0].type !== "text") {
    return parts.map((part, index) => {
      if (part.type === "species") {
        return (
          <SpeciesInlineLink
            className={INLINE_LINK_CLASS_NAME}
            id={part.id}
            key={`s:${index}:${part.id}:${part.label}`}
            source="other"
          >
            {part.label}
          </SpeciesInlineLink>
        );
      }

      return (
        <Fragment key={`t:${index}`}>
          {renderPhoneOnlyLinks(part.value)}
        </Fragment>
      );
    });
  }

  return renderPhoneOnlyLinks(text);
}

function splitInternalRouteLinks(text: string): RouteLinkPart[] {
  const parts: RouteLinkPart[] = [];
  const pattern = new RegExp(INTERNAL_ROUTE_LINK.source, "g");
  let lastIndex = 0;
  let match: null | RegExpExecArray;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({
      href: match[2] as ComponentProps<typeof Link>["href"],
      label: match[1],
      type: "route",
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}
