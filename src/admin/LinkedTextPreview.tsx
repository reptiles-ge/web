import { Typography } from "antd";

import { publicEnv } from "@/lib/env";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

type Piece = { label: string; target?: string };

export function LinkedTextPreview({ text }: { text: string }) {
  const site = publicEnv().NEXT_PUBLIC_SITE_URL ?? "https://reptiles.ge";
  return (
    <div
      style={{
        border: "1px dashed #d9d9d9",
        borderRadius: 6,
        fontSize: 13,
        padding: "6px 10px",
      }}
    >
      <Typography.Text style={{ fontSize: 12 }} type="secondary">
        Preview
      </Typography.Text>
      {text.split("\n").map((line, index) => (
        <Typography.Paragraph key={index} style={{ margin: "2px 0" }}>
          {linkedTextPieces(line).map((piece, at) =>
            piece.target ? (
              <Typography.Link
                href={href(piece.target, site)}
                key={at}
                rel="noreferrer"
                target="_blank"
                title={piece.target}
              >
                {piece.label}
              </Typography.Link>
            ) : (
              <span key={at}>{piece.label}</span>
            ),
          )}
        </Typography.Paragraph>
      ))}
    </div>
  );
}

function href(target: string, site: string) {
  if (target.startsWith("https://")) return target;
  if (target.startsWith("/")) return `${site}/en${target}`;
  return `${site}/en/species/${target}`;
}

function linkedTextPieces(line: string): Piece[] {
  const pieces: Piece[] = [];
  let last = 0;
  for (const match of line.matchAll(LINK)) {
    if (match.index > last)
      pieces.push({ label: line.slice(last, match.index) });
    pieces.push({ label: match[1]!, target: match[2]! });
    last = match.index + match[0].length;
  }
  if (last < line.length) pieces.push({ label: line.slice(last) });
  return pieces;
}
