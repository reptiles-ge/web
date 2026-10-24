import type { JSONContent } from "@tiptap/core";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Input,
  Modal,
  Select,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";

import { type NewsLinkAttrs, type NewsLinkKind } from "./newsDoc";
import {
  type FigureOptions,
  newsEditorExtensions,
} from "./newsEditorExtensions";
import "./newsEditor.css";

export type LinkTargets = Record<
  Exclude<NewsLinkKind, "external" | "news-index">,
  LinkOption[]
>;

type LinkOption = { label: string; value: string };

const LINK_KINDS: Array<{ kind: NewsLinkKind; label: string }> = [
  { kind: "external", label: "Web link" },
  { kind: "species", label: "Species" },
  { kind: "region", label: "Region" },
  { kind: "hub", label: "Animal section" },
  { kind: "credit-author", label: "Contributor" },
  { kind: "news-index", label: "News index" },
];

const KIND_LABELS = Object.fromEntries(
  LINK_KINDS.map(({ kind, label }) => [kind, label]),
) as Record<NewsLinkKind, string>;

const HTTPS_URL = /^https:\/\/\S+$/;

export function NewsBodyEditor({
  doc,
  figure,
  onChange,
  targets,
}: {
  doc: JSONContent;
  figure: FigureOptions;
  onChange: (doc: JSONContent) => void;
  targets: LinkTargets;
}) {
  const [linkKind, setLinkKind] = useState<NewsLinkKind | null>(null);
  const editor = useEditor({
    content: doc,
    editorProps: {
      attributes: { "aria-label": "Article body", class: "news-editor__body" },
    },
    extensions: newsEditorExtensions(figure),
    onUpdate: ({ editor: current }) => onChange(current.getJSON()),
  });
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      canRedo: current.can().redo(),
      canUndo: current.can().undo(),
      empty: current.state.selection.empty,
      link: current.getAttributes("newsLink") as Partial<NewsLinkAttrs>,
      sci: current.isActive("sci"),
    }),
  });
  const inLink = Boolean(state.link.kind);
  const canMark = !state.empty || inLink || state.sci;

  function applyLink(attrs: NewsLinkAttrs) {
    editor
      .chain()
      .focus()
      .extendMarkRange("newsLink")
      .setMark("newsLink", attrs)
      .run();
    setLinkKind(null);
  }

  return (
    <div className="news-editor">
      <Flex align="center" className="news-editor__toolbar" gap={4} wrap>
        <Button
          disabled={!state.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
          size="small"
        >
          Undo
        </Button>
        <Button
          disabled={!state.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
          size="small"
        >
          Redo
        </Button>
        <Divider orientation="vertical" />
        <Tooltip title={canMark ? "" : "Select some text first"}>
          <Dropdown
            disabled={!canMark}
            menu={{
              items: LINK_KINDS.map(({ kind, label }) => ({
                key: kind,
                label,
              })),
              onClick: ({ key }) => {
                if (key === "news-index") {
                  applyLink({ kind: "news-index", target: "" });
                } else setLinkKind(key as NewsLinkKind);
              },
            }}
          >
            <Button disabled={!canMark} size="small">
              {inLink ? "Change link" : "Link"} ▾
            </Button>
          </Dropdown>
        </Tooltip>
        <Button
          disabled={!canMark}
          onClick={() =>
            editor
              .chain()
              .focus()
              .extendMarkRange("sci")
              .toggleMark("sci")
              .run()
          }
          size="small"
          type={state.sci ? "primary" : "default"}
        >
          <i>Sci. name</i>
        </Button>
        <Button
          disabled={!inLink && !state.sci}
          onClick={() =>
            editor
              .chain()
              .focus()
              .extendMarkRange(inLink ? "newsLink" : "sci")
              .unsetAllMarks()
              .run()
          }
          size="small"
        >
          Remove link
        </Button>
        {inLink ? (
          <Tag className="news-editor__current" color="blue">
            {KIND_LABELS[state.link.kind!]}
            {state.link.target ? `: ${state.link.target}` : ""}
          </Tag>
        ) : null}
      </Flex>
      <EditorContent editor={editor} />
      <Typography.Paragraph className="news-editor__hint" type="secondary">
        Edit headings and paragraphs freely. Photos stay where they are, and
        sections cannot be added or removed here.
      </Typography.Paragraph>
      {linkKind ? (
        <LinkModal
          initial={
            state.link.kind === linkKind ? (state.link.target ?? "") : ""
          }
          kind={linkKind}
          onCancel={() => setLinkKind(null)}
          onSave={(target) => applyLink({ kind: linkKind, target })}
          options={
            linkKind === "external" || linkKind === "news-index"
              ? []
              : targets[linkKind]
          }
        />
      ) : null}
    </div>
  );
}

function LinkModal({
  initial,
  kind,
  onCancel,
  onSave,
  options,
}: {
  initial: string;
  kind: NewsLinkKind;
  onCancel: () => void;
  onSave: (target: string) => void;
  options: LinkOption[];
}) {
  const [target, setTarget] = useState(initial);
  const external = kind === "external";
  const valid = external ? HTTPS_URL.test(target.trim()) : Boolean(target);
  return (
    <Modal
      destroyOnHidden
      okButtonProps={{ disabled: !valid }}
      okText="Apply link"
      onCancel={onCancel}
      onOk={() => onSave(target.trim())}
      open
      title={`${KIND_LABELS[kind]} link`}
    >
      {external ? (
        <Input
          autoFocus
          onChange={(event) => setTarget(event.target.value)}
          onPressEnter={() => valid && onSave(target.trim())}
          placeholder="https://"
          status={target && !valid ? "error" : undefined}
          value={target}
        />
      ) : (
        <>
          <Select
            autoFocus
            notFoundContent="Nothing to link"
            onChange={setTarget}
            optionFilterProp="label"
            options={options}
            placeholder={`Choose a ${KIND_LABELS[kind].toLowerCase()}`}
            showSearch
            style={{ width: "100%" }}
            value={target || undefined}
          />
          {kind === "credit-author" ? null : (
            <Typography.Paragraph style={{ marginTop: 8 }} type="secondary">
              Only the article&apos;s related {KIND_LABELS[kind].toLowerCase()}{" "}
              entries can be linked.
            </Typography.Paragraph>
          )}
        </>
      )}
    </Modal>
  );
}
