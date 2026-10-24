import type { Editor, JSONContent } from "@tiptap/core";

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewsBodyEditor } from "./NewsBodyEditor";
import { newsDocToSections, newsSectionsToDoc } from "./newsDoc";

const DOC = newsSectionsToDoc([
  {
    blocks: [{ parts: ["Read the viper story"], type: "p" }],
    heading: "Heading",
  },
]);

const TARGETS = {
  "credit-author": [],
  hub: [],
  region: [],
  species: [{ label: "Dinnik's viper", value: "vipera-dinniki" }],
};

async function chooseLink(
  user: ReturnType<typeof userEvent.setup>,
  kind: string,
) {
  await user.hover(screen.getByText(/Link ▾/));
  await user.click(await screen.findByText(kind));
}

function setup() {
  const onChange = vi.fn<(doc: JSONContent) => void>();
  render(
    <NewsBodyEditor
      doc={DOC}
      figure={{ locale: "ka", photos: new Map() }}
      onChange={onChange}
      targets={TARGETS}
    />,
  );
  const editor = (
    document.querySelector(".news-editor__body") as HTMLElement & {
      editor: Editor;
    }
  ).editor;
  const select = (word: string) => {
    const from = "Heading".length + 4 + "Read the viper story".indexOf(word);
    act(() => {
      editor.commands.focus();
      editor.commands.setTextSelection({ from, to: from + word.length });
    });
  };
  const parts = () =>
    newsDocToSections(onChange.mock.lastCall![0])[0]!.blocks[0];
  return {
    parts,
    select,
    user: userEvent.setup({
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    }),
  };
}

describe("NewsBodyEditor", () => {
  it("needs a selection before it can link", () => {
    setup();
    expect(screen.getByText(/Link ▾/).closest("button")).toBeDisabled();
    expect(screen.getByText("Remove link").closest("button")).toBeDisabled();
  });

  it("links selected words to a web page, a species and the news index", async () => {
    const { parts, select, user } = setup();
    select("Read");
    await chooseLink(user, "Web link");
    const url = await screen.findByPlaceholderText("https://");
    await user.type(url, "http://insecure");
    expect(screen.getByText("Apply link").closest("button")).toBeDisabled();
    await user.clear(url);
    await user.type(url, "https://example.org{Enter}");
    await waitFor(() =>
      expect(parts()).toEqual({
        parts: [
          { href: "https://example.org", label: "Read", type: "external" },
          " the viper story",
        ],
        type: "p",
      }),
    );

    select("viper");
    await chooseLink(user, "Species");
    await user.click(await screen.findByRole("combobox"));
    await user.click(await screen.findByTitle("Dinnik's viper"));
    await user.click(screen.getByText("Apply link").closest("button")!);
    await waitFor(() =>
      expect(screen.getByText("Species: vipera-dinniki")).toBeInTheDocument(),
    );

    select("story");
    await chooseLink(user, "News index");
    await waitFor(() =>
      expect(parts()).toEqual({
        parts: [
          { href: "https://example.org", label: "Read", type: "external" },
          " the ",
          { id: "vipera-dinniki", label: "viper", type: "species" },
          " ",
          { label: "story", type: "news-index" },
        ],
        type: "p",
      }),
    );
  });

  it("marks a scientific name and removes it again", async () => {
    const { parts, select, user } = setup();
    select("viper");
    await user.click(screen.getByText("Sci. name").closest("button")!);
    await waitFor(() =>
      expect(parts().type === "p" && parts()).toMatchObject({
        parts: ["Read the ", { name: "viper", type: "sci" }, " story"],
      }),
    );
    await user.click(screen.getByText("Remove link").closest("button")!);
    await waitFor(() =>
      expect(parts()).toEqual({ parts: ["Read the viper story"], type: "p" }),
    );
    await user.click(screen.getByText("Undo").closest("button")!);
    await waitFor(() =>
      expect(parts()).toMatchObject({
        parts: ["Read the ", { name: "viper", type: "sci" }, " story"],
      }),
    );
    await user.click(screen.getByText("Redo").closest("button")!);
    await waitFor(() =>
      expect(parts()).toEqual({ parts: ["Read the viper story"], type: "p" }),
    );
  });
});
