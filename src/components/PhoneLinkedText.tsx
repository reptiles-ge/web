import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { splitPhoneLinks } from "@/lib/phoneLinks";

const PHONE_LINK_CLASS_NAME =
  "font-medium underline decoration-current/40 underline-offset-[3px] transition-colors hover:decoration-current";

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
