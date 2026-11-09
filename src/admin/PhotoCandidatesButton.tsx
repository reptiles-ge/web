import {
  Alert,
  Button,
  Card,
  Empty,
  Modal,
  Segmented,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";

import { SessionExpiredError } from "./adminResponse";
import { BulkCreateButton } from "./BulkCreateButton";
import {
  type CandidateLicence,
  type CandidateScope,
  fetchPhotoCandidates,
  findINaturalistTaxon,
  maybeInGallery,
  PHOTO_TARGET,
  type PhotoCandidate,
} from "./photoCandidates";
import { importINaturalistLookup, type INaturalistImport } from "./photos";
import { SavedCandidates } from "./SavedCandidates";
import { useSavedCandidates } from "./useSavedCandidates";

type GalleryPhoto = {
  credit?: { date?: string; photoConfidence?: string; photographer?: string };
  photoConfidence?: string;
};

type Search = {
  candidates: PhotoCandidate[];
  licence: CandidateLicence;
  page: number;
  scope: CandidateScope;
  taxonId: number;
  total: number;
};

const LICENCE_OPTIONS: { label: string; value: CandidateLicence }[] = [
  { label: "Any Creative Commons licence", value: "cc" },
  { label: "Open licences only (CC0, CC BY, CC BY-SA)", value: "open" },
  { label: "Any licence, including all rights reserved", value: "any" },
];
const PER_PAGE = 30;
const SCOPE_OPTIONS: { label: string; value: CandidateScope }[] = [
  { label: "Taken in Georgia", value: "georgia" },
  { label: "Elsewhere", value: "elsewhere" },
];

export function PhotoCandidatesButton({
  gallery,
  id,
  onPicked,
  onSessionExpired,
  onUploaded,
  scientificName,
}: {
  gallery: GalleryPhoto[];
  id: string;
  onPicked: (result: INaturalistImport, observationUrl: string) => void;
  onSessionExpired: () => void;
  onUploaded: () => void;
  scientificName: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<null | Search>(null);
  const [scope, setScope] = useState<CandidateScope>("georgia");
  const [licence, setLicence] = useState<CandidateLicence>("cc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [adding, setAdding] = useState<null | string>(null);
  const shortlist = useSavedCandidates(id);
  const georgia = gallery.filter(
    (photo) =>
      (photo.photoConfidence ?? photo.credit?.photoConfidence) ===
      "georgia-field",
  ).length;
  const more = search
    ? search.page * PER_PAGE < search.total && !loading
    : false;

  async function load(next: {
    licence: CandidateLicence;
    page: number;
    scope: CandidateScope;
  }) {
    setLoading(true);
    setError(null);
    try {
      let taxonId = search?.taxonId;
      if (!taxonId) {
        const taxon = await findINaturalistTaxon(scientificName);
        if (!taxon) {
          throw new Error(`No iNaturalist species matches ${scientificName}`);
        }
        taxonId = taxon.id;
      }
      const page = await fetchPhotoCandidates({ ...next, taxonId });
      setSearch((current) => ({
        ...next,
        candidates:
          next.page > 1 && current
            ? [...current.candidates, ...page.candidates]
            : page.candidates,
        taxonId,
        total: page.total,
      }));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not load photos",
      );
    } finally {
      setLoading(false);
    }
  }

  function start() {
    setOpen(true);
    if (!search && !loading) void load({ licence, page: 1, scope });
  }

  function changeScope(value: CandidateScope) {
    setScope(value);
    void load({ licence, page: 1, scope: value });
  }

  function changeLicence(value: CandidateLicence) {
    setLicence(value);
    void load({ licence: value, page: 1, scope });
  }

  async function pick(candidate: PhotoCandidate) {
    setAdding(candidate.key);
    setError(null);
    try {
      onPicked(
        await importINaturalistLookup(id, candidate.lookup),
        candidate.observationUrl,
      );
    } catch (caught) {
      if (caught instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(
        caught instanceof Error ? caught.message : "iNaturalist import failed",
      );
    } finally {
      setAdding(null);
    }
  }

  return (
    <>
      <Button onClick={start}>Find photos</Button>
      <Modal
        footer={null}
        onCancel={() => setOpen(false)}
        open={open}
        title="Find photos on iNaturalist"
        width={1100}
      >
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Typography.Text>
            Gallery:{" "}
            <Tag color={gallery.length < PHOTO_TARGET ? "red" : "green"}>
              {gallery.length} of {PHOTO_TARGET}
            </Tag>
            {georgia} taken in Georgia. Research-grade observations, most
            favourited first. Save a photo to compare and rank it; Add opens the
            upload dialog with the photo and its credit, check the Georgian
            fields there.
          </Typography.Text>
          <SavedCandidates
            adding={adding}
            bulk={
              <BulkCreateButton
                candidates={shortlist.saved}
                id={id}
                onSessionExpired={onSessionExpired}
                onUploaded={onUploaded}
              />
            }
            onAdd={(candidate) => void pick(candidate)}
            onMove={shortlist.move}
            onUnsave={shortlist.toggle}
            saved={shortlist.saved}
          />
          <Space wrap>
            <Segmented<CandidateScope>
              disabled={loading}
              onChange={changeScope}
              options={SCOPE_OPTIONS}
              value={scope}
            />
            <Select<CandidateLicence>
              aria-label="Photo licence"
              disabled={loading}
              id="photo-candidate-licence"
              onChange={changeLicence}
              options={LICENCE_OPTIONS}
              style={{ minWidth: 340 }}
              value={licence}
            />
            {search ? (
              <Typography.Text type="secondary">
                {search.total} observations
              </Typography.Text>
            ) : null}
          </Space>
          {error ? <Alert showIcon title={error} type="error" /> : null}
          {search && search.candidates.length === 0 && !loading ? (
            <Empty
              description={
                scope === "georgia"
                  ? "No photos from Georgia with this licence. Try Elsewhere or another licence."
                  : "No photos with this licence."
              }
            />
          ) : null}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {search?.candidates.map((candidate) => (
              <CandidateCard
                adding={adding === candidate.key}
                busy={adding !== null}
                candidate={candidate}
                inGallery={maybeInGallery(candidate, gallery)}
                key={candidate.key}
                onAdd={() => void pick(candidate)}
                onSave={() => shortlist.toggle(candidate)}
                saved={shortlist.isSaved(candidate.key)}
              />
            ))}
          </div>
          {loading ? <Spin /> : null}
          {more && search ? (
            <Button
              onClick={() =>
                void load({
                  licence: search.licence,
                  page: search.page + 1,
                  scope: search.scope,
                })
              }
            >
              Load more
            </Button>
          ) : null}
        </Space>
      </Modal>
    </>
  );
}

function CandidateCard({
  adding,
  busy,
  candidate,
  inGallery,
  onAdd,
  onSave,
  saved,
}: {
  adding: boolean;
  busy: boolean;
  candidate: PhotoCandidate;
  inGallery: boolean;
  onAdd: () => void;
  onSave: () => void;
  saved: boolean;
}) {
  const size =
    candidate.width && candidate.height
      ? `${candidate.width}×${candidate.height}`
      : "size unknown";
  return (
    <Card
      actions={[
        <Button
          disabled={busy && !adding}
          key="add"
          loading={adding}
          onClick={onAdd}
          type="link"
        >
          Add
        </Button>,
        <Button
          aria-pressed={saved}
          key="save"
          onClick={onSave}
          type={saved ? "primary" : "link"}
        >
          {saved ? "Unsave" : "Save"}
        </Button>,
        <Typography.Link
          href={candidate.observationUrl}
          key="open"
          rel="noreferrer"
          target="_blank"
        >
          Observation
        </Typography.Link>,
      ]}
      cover={
        <img
          alt={`Photo by ${candidate.observer}`}
          loading="lazy"
          src={candidate.previewUrl}
          style={{ aspectRatio: "4 / 3", objectFit: "cover" }}
        />
      }
      size="small"
    >
      <Space orientation="vertical" size={4} style={{ width: "100%" }}>
        <Typography.Text strong>
          {candidate.observerName || candidate.observer}
          {candidate.observerName ? (
            <Typography.Text type="secondary">
              {" "}
              @{candidate.observer}
            </Typography.Text>
          ) : null}
        </Typography.Text>
        <Space size={[4, 4]} wrap>
          {candidate.georgia ? <Tag color="green">Georgia</Tag> : null}
          <Tag>{candidate.licence}</Tag>
          <Tag color={candidate.small ? "red" : undefined}>
            {candidate.small ? `small ${size}` : size}
          </Tag>
          <Tag>★ {candidate.faves}</Tag>
          {inGallery ? <Tag color="orange">Maybe in gallery</Tag> : null}
        </Space>
        <Typography.Text type="secondary">
          {[candidate.place, candidate.observedOn].filter(Boolean).join(" · ")}
        </Typography.Text>
      </Space>
    </Card>
  );
}
