import { Button, Card, Space, Tag, Typography } from "antd";
import { useRef, useState } from "react";

import type { PhotoCandidate } from "./photoCandidates";

export function SavedCandidates({
  adding,
  onAdd,
  onMove,
  onUnsave,
  saved,
}: {
  adding: null | string;
  onAdd: (candidate: PhotoCandidate) => void;
  onMove: (key: string, toIndex: number) => void;
  onUnsave: (candidate: PhotoCandidate) => void;
  saved: PhotoCandidate[];
}) {
  const dragging = useRef<null | string>(null);
  const [over, setOver] = useState<null | string>(null);
  if (saved.length === 0) return null;
  return (
    <section aria-label="Saved photos">
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        Saved ({saved.length})
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Your shortlist for this species, kept in this browser. Drag the cards to
        rank them; Add opens the upload dialog.
      </Typography.Paragraph>
      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        }}
      >
        {saved.map((candidate, index) => (
          <Card
            actions={[
              <Button
                disabled={adding !== null && adding !== candidate.key}
                key="add"
                loading={adding === candidate.key}
                onClick={() => onAdd(candidate)}
                size="small"
                type="link"
              >
                Add
              </Button>,
              <Button
                key="unsave"
                onClick={() => onUnsave(candidate)}
                size="small"
                type="link"
              >
                Unsave
              </Button>,
            ]}
            cover={
              <img
                alt={`Saved photo by ${candidate.observer}`}
                draggable={false}
                src={candidate.previewUrl}
                style={{ aspectRatio: "4 / 3", objectFit: "cover" }}
              />
            }
            data-testid={`saved-${candidate.key}`}
            draggable
            key={candidate.key}
            onDragEnd={() => {
              dragging.current = null;
              setOver(null);
            }}
            onDragOver={(event) => {
              if (!dragging.current) return;
              event.preventDefault();
              setOver(candidate.key);
            }}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", candidate.key);
              dragging.current = candidate.key;
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging.current) onMove(dragging.current, index);
              dragging.current = null;
              setOver(null);
            }}
            size="small"
            style={{
              cursor: "grab",
              outline:
                over === candidate.key ? "2px dashed #1677ff" : undefined,
            }}
          >
            <Space orientation="vertical" size={2} style={{ width: "100%" }}>
              <Typography.Text strong>
                <span aria-hidden>⋮⋮</span> {index + 1}.{" "}
                {candidate.observerName || candidate.observer}
              </Typography.Text>
              <Space size={[4, 4]} wrap>
                {candidate.georgia ? <Tag color="green">Georgia</Tag> : null}
                <Tag>{candidate.licence}</Tag>
                <Typography.Link
                  href={candidate.observationUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Observation
                </Typography.Link>
              </Space>
            </Space>
          </Card>
        ))}
      </div>
    </section>
  );
}
