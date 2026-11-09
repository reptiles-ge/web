import type { ColumnsType } from "antd/es/table";

import { Button, message, Table, Tabs, Tag, Typography } from "antd";
import { useState } from "react";

import { AdminDetailGate, AdminDetailHeader } from "./AdminDetail";
import { AdminLink } from "./AdminLink";
import { ClearCacheButton } from "./ClearCacheButton";
import { CoordinatesLink } from "./CoordinatesLink";
import {
  type AdminFieldRecord,
  type AdminSpeciesRecord,
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpeciesRecord,
  SPECIES_STATUS_COLORS,
} from "./species";
import { SpeciesAudioPanel } from "./SpeciesAudioPanel";
import { type PendingOrder, SpeciesPhotosTab } from "./SpeciesPhotosTab";
import { SpeciesStatusControl } from "./SpeciesStatusControl";
import { SpeciesTextsEditor } from "./SpeciesTextsEditor";
import { useAdminData } from "./useAdminList";

const LIST_PATH = "/species";

const locationColumns: ColumnsType<AdminFieldRecord> = [
  { dataIndex: "locality", key: "locality", title: "Locality" },
  {
    key: "coordinates",
    render: (_, row) => <CoordinatesLink lat={row.lat} lng={row.lng} />,
    title: "Coordinates",
  },
  {
    dataIndex: "date",
    key: "date",
    render: (date?: string) => date ?? "—",
    title: "Date",
  },
  {
    dataIndex: "evidence",
    key: "evidence",
    render: (evidence?: string) => (evidence ? <Tag>{evidence}</Tag> : "—"),
    title: "Evidence",
  },
  {
    key: "observer",
    render: (_, row) => row.observerName ?? row.observer ?? "—",
    title: "Observer",
  },
  {
    key: "source",
    render: (_, row) =>
      row.url ? (
        <Typography.Link href={row.url} rel="noreferrer" target="_blank">
          {row.source ?? row.url}
        </Typography.Link>
      ) : (
        (row.source ?? "—")
      ),
    title: "Source",
  },
  {
    dataIndex: "note",
    key: "note",
    render: (note?: string) => note ?? "—",
    title: "Note",
  },
];

export function SpeciesDetailPage({
  id,
  onSessionExpired,
}: {
  id: string;
  onSessionExpired: () => void;
}) {
  const { data, refresh, reload, status } = useAdminData(
    () =>
      Promise.all([fetchAdminSpeciesRecord(id), fetchAdminFieldRecords(id)]),
    onSessionExpired,
  );
  const [savedVersion, setSavedVersion] = useState<null | number>(null);
  const pendingOrder = useState<PendingOrder>(null);
  const [messages, contextHolder] = message.useMessage();

  function changed(next: number, notice: string) {
    void messages.success(notice);
    setSavedVersion(next);
    reload();
  }

  const showError = (text: string) => void messages.error(text);
  const value =
    data === undefined
      ? undefined
      : data[0]
        ? { fieldRecords: data[1] ?? [], found: data[0] }
        : null;

  return (
    <>
      {contextHolder}
      <AdminDetailGate
        back={<AdminLink path={LIST_PATH}>← Species</AdminLink>}
        data={value}
        failure="Could not load this species."
        id={id}
        notFoundTitle="Species not found"
        onReload={reload}
        status={status}
      >
        {({ fieldRecords, found: { record, version } }) => {
          const currentVersion = savedVersion ?? version;
          const photoCount =
            (record.base.image ? 1 : 0) +
            (record.base.mobileImage ? 1 : 0) +
            record.base.gallery.length;
          return (
            <>
              <SpeciesHeader
                currentVersion={currentVersion}
                id={id}
                onChanged={changed}
                onError={showError}
                onReload={reload}
                onSessionExpired={onSessionExpired}
                record={record}
              />
              <Tabs
                items={[
                  {
                    children: (
                      <SpeciesPhotosTab
                        currentVersion={currentVersion}
                        id={id}
                        onChanged={changed}
                        onError={showError}
                        onSessionExpired={onSessionExpired}
                        onUploaded={refresh}
                        pending={pendingOrder}
                        record={record}
                        version={version}
                      />
                    ),
                    key: "photos",
                    label: `Photos (${photoCount})`,
                  },
                  {
                    children: (
                      <SpeciesTextsEditor
                        id={id}
                        onSaved={setSavedVersion}
                        onSessionExpired={onSessionExpired}
                        record={record}
                        version={version}
                      />
                    ),
                    key: "texts",
                    label: "Texts",
                  },
                  {
                    children: (
                      <Table<AdminFieldRecord>
                        columns={locationColumns}
                        dataSource={fieldRecords}
                        pagination={{
                          defaultPageSize: 50,
                          showSizeChanger: true,
                        }}
                        rowKey={(row) =>
                          `${row.locality}:${row.lat}:${row.lng}`
                        }
                        scroll={{ x: 900 }}
                        size="small"
                      />
                    ),
                    key: "locations",
                    label: `Locations (${fieldRecords.length})`,
                  },
                  {
                    children: <SpeciesAudioPanel audio={record.base.audio} />,
                    key: "audio",
                    label: record.base.audio ? "Audio" : "Audio (none)",
                  },
                ]}
              />
            </>
          );
        }}
      </AdminDetailGate>
    </>
  );
}

function SpeciesHeader({
  currentVersion,
  id,
  onChanged,
  onError,
  onReload,
  onSessionExpired,
  record,
}: {
  currentVersion: number;
  id: string;
  onChanged: (next: number, notice: string) => void;
  onError: (text: string) => void;
  onReload: () => void;
  onSessionExpired: () => void;
  record: AdminSpeciesRecord["record"];
}) {
  return (
    <AdminDetailHeader
      actions={
        <>
          <SpeciesStatusControl
            id={id}
            onChanged={onChanged}
            onError={onError}
            onSessionExpired={onSessionExpired}
            status={record.status}
            version={currentVersion}
          />
          <Button onClick={onReload}>Reload</Button>
          <ClearCacheButton
            description="This species' profile pages, and the hubs, lists and cards that show it, render fresh on reptiles.ge on their next visit, in every language."
            failure="The species cache could not be cleared. Try again in a minute."
            label="Clear cache"
            onSessionExpired={onSessionExpired}
            run={async () => {
              await clearSpeciesCache(id);
              return `Cache cleared for ${id}.`;
            }}
            title="Clear this species' cache?"
          />
        </>
      }
      subtitle={
        <>
          {record.translations.en.commonName} ·{" "}
          <i>{record.base.scientificName}</i> · {id}
        </>
      }
      tags={
        <>
          <Tag color={SPECIES_STATUS_COLORS[record.status]}>
            {record.status}
          </Tag>
          <Tag>{record.group}</Tag>
          <Tag>version {currentVersion}</Tag>
        </>
      }
      title={record.base.commonName}
    />
  );
}
