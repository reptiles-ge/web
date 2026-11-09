import { Modal, Select } from "antd";
import { useState } from "react";

import {
  type AdminSpecies,
  SessionExpiredError,
  setSpeciesStatus,
  SPECIES_STATUS_COLORS,
} from "./species";

type Status = AdminSpecies["status"];

const STATUS_NOTES: Record<Status, string> = {
  draft:
    "A species that was never public. It is hidden from reptiles.ge once the cache is cleared.",
  published:
    "The species shows on reptiles.ge once the cache is cleared. It needs a Georgian slug. Its URL table updates on the next deploy.",
  unpublished:
    "A species taken off the site. It is hidden from reptiles.ge once the cache is cleared.",
};

const STATUSES = Object.keys(SPECIES_STATUS_COLORS) as Status[];

export function SpeciesStatusControl({
  id,
  onChanged,
  onError,
  onSessionExpired,
  status,
  version,
}: {
  id: string;
  onChanged: (version: number, notice: string) => void;
  onError: (message: string) => void;
  onSessionExpired: () => void;
  status: Status;
  version: number;
}) {
  const [saving, setSaving] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  async function save(next: Status) {
    setSaving(true);
    try {
      const saved = await setSpeciesStatus(id, next, version);
      onChanged(
        saved,
        `Status set to ${next}. Clear the cache to update reptiles.ge.`,
      );
    } catch (caught) {
      if (caught instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      onError(
        caught instanceof Error ? caught.message : "Status change failed",
      );
    } finally {
      setSaving(false);
    }
  }

  function choose(next: Status) {
    if (next === status) return;
    void modal.confirm({
      content: STATUS_NOTES[next],
      okText: `Set ${next}`,
      onOk: () => save(next),
      title: `Change status from ${status} to ${next}?`,
    });
  }

  return (
    <>
      {contextHolder}
      <Select
        aria-label="Species status"
        id="species-status"
        loading={saving}
        onChange={choose}
        options={STATUSES.map((value) => ({ label: value, value }))}
        style={{ minWidth: 140 }}
        value={status}
      />
    </>
  );
}
