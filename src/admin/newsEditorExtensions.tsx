import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

import { Mark, Node } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Gapcursor, UndoRedo } from "@tiptap/extensions";
import { Plugin } from "@tiptap/pm/state";
import {
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

import type { NewsPhoto } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { optimizedImgSrc } from "@/data/optimizedImages";

import type { NewsLinkKind } from "./newsDoc";

export type FigureOptions = {
  locale: AppLocale;
  photos: ReadonlyMap<string, NewsPhoto>;
};

const NewsDocument = Node.create({
  content: "section+",
  name: "doc",
  topNode: true,
});

const Section = Node.create({
  content: "sectionHeading block+",
  isolating: true,
  name: "section",
  parseHTML: () => [{ tag: "section[data-news-section]" }],
  renderHTML: () => [
    "section",
    { class: "news-section", "data-news-section": "" },
    0,
  ],
});

const SectionHeading = Node.create({
  content: "text*",
  defining: true,
  marks: "",
  name: "sectionHeading",
  parseHTML: () => [{ tag: "h2[data-news-heading]" }],
  renderHTML: () => [
    "h2",
    { class: "news-heading", "data-news-heading": "" },
    0,
  ],
});

const Figure = Node.create<FigureOptions>({
  addAttributes: () => ({ src: { default: "" } }),
  addNodeView() {
    return ReactNodeViewRenderer(FigureView);
  },
  addOptions: () => ({ locale: "ka", photos: new Map() }),
  atom: true,
  draggable: false,
  group: "block",
  name: "figure",
  renderHTML: ({ HTMLAttributes }) => [
    "figure",
    { class: "news-figure", "data-src": HTMLAttributes.src },
  ],
  selectable: true,
});

const NewsLink = Mark.create({
  addAttributes: () => ({
    kind: { default: "external" satisfies NewsLinkKind },
    target: { default: "" },
  }),
  excludes: "_",
  inclusive: false,
  name: "newsLink",
  parseHTML: () => [
    {
      getAttrs: (element) => ({
        kind: element.getAttribute("data-kind"),
        target: element.getAttribute("data-target") ?? "",
      }),
      tag: "a[data-kind]",
    },
  ],
  renderHTML: ({ HTMLAttributes }) => [
    "a",
    {
      class: `news-link news-link--${HTMLAttributes.kind}`,
      "data-kind": HTMLAttributes.kind,
      "data-target": HTMLAttributes.target,
      title: `${HTMLAttributes.kind}: ${HTMLAttributes.target || "news index"}`,
    },
    0,
  ],
});

const Sci = Mark.create({
  excludes: "_",
  name: "sci",
  parseHTML: () => [{ tag: "i[data-sci]" }],
  renderHTML: () => ["i", { class: "news-sci", "data-sci": "" }, 0],
});

const StructureLock = Node.create({
  addProseMirrorPlugins: () => [
    new Plugin({
      filterTransaction: (transaction, state) =>
        !transaction.docChanged ||
        structureKey(transaction.doc) === structureKey(state.doc),
    }),
  ],
  name: "structureLock",
});

export function newsEditorExtensions(figure: FigureOptions) {
  return [
    NewsDocument,
    Section,
    SectionHeading,
    Paragraph,
    Text,
    Figure.configure(figure),
    NewsLink,
    Sci,
    StructureLock,
    UndoRedo,
    Gapcursor,
  ];
}

function FigureView({ extension, node, selected }: NodeViewProps) {
  const { locale, photos } = extension.options as FigureOptions;
  const src = String(node.attrs.src);
  const photo = photos.get(src);
  const alt = photo?.alt[locale] ?? photo?.alt.ka ?? "";
  const credit = [photo?.credit?.photographer, photo?.credit?.location]
    .filter(Boolean)
    .join(" · ");
  return (
    <NodeViewWrapper
      className={`news-figure${selected ? "news-figure--selected" : ""}`}
      contentEditable={false}
      data-drag-handle=""
    >
      <img alt={alt} src={optimizedImgSrc(src, 960)} />
      <figcaption>
        <span>{alt || "No alt text"}</span>
        {credit ? <span className="news-figure__credit">{credit}</span> : null}
        <span className="news-figure__lock">Photo · fixed in place</span>
      </figcaption>
    </NodeViewWrapper>
  );
}

function structureKey(doc: ProseMirrorNode) {
  const figures: string[] = [];
  doc.descendants((node) => {
    if (node.type.name === "figure") figures.push(String(node.attrs.src));
    return node.type.name === "doc" || node.type.name === "section";
  });
  return `${doc.childCount}\n${figures.join("\n")}`;
}
