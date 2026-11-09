import type { UploadFile } from "antd/es/upload/interface";

import { Alert, Button, Form, Input, List, Modal, Space, Upload } from "antd";
import { type Ref, useId, useImperativeHandle, useRef, useState } from "react";

import { SessionExpiredError } from "./adminResponse";
import { PhotoCreditFormFields } from "./PhotoCreditFormFields";
import {
  importINaturalistPhoto,
  type INaturalistImport,
  type PhotoCreditFields,
} from "./photos";
import {
  creditFromINaturalist,
  isSettled,
  profileNameOf,
  runPhotoUploads,
  UploadedAlert,
  type UploadStatus,
  UploadStatusTag,
} from "./photoUploadKit";

export type PhotoUploadHandle = {
  openWith: (result: INaturalistImport, observationUrl: string) => void;
};

type FileState = {
  message?: string;
  name: string;
  status: UploadStatus;
  uid: string;
};

const INITIAL_CREDIT: Partial<PhotoCreditFields> = { georgiaField: true };

export function PhotoUploadButton({
  id,
  onSessionExpired,
  onUploaded,
  ref,
}: {
  id: string;
  onSessionExpired: () => void;
  onUploaded: () => void;
  ref?: Ref<PhotoUploadHandle>;
}) {
  const [form] = Form.useForm<PhotoCreditFields>();
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [states, setStates] = useState<FileState[]>([]);
  const [running, setRunning] = useState(false);
  const [observationUrl, setObservationUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<INaturalistImport | null>(null);
  const [importError, setImportError] = useState<null | string>(null);
  const added = states.filter((item) => item.status === "added").length;
  const finished =
    !running &&
    states.length > 0 &&
    states.every((item) => isSettled(item.status));
  const picked = useRef<INaturalistImport | null>(null);

  useImperativeHandle(ref, () => ({
    openWith(result, url) {
      if (running) return;
      setStates([]);
      setObservationUrl(url);
      setImportError(null);
      if (open) {
        fill(result, true);
        return;
      }
      picked.current = result;
      setOpen(true);
    },
  }));

  function formMounted(instance: unknown) {
    if (!instance || !picked.current) return;
    const result = picked.current;
    picked.current = null;
    fill(result, true);
  }

  function fill({ file, metadata }: INaturalistImport, setGeorgia = false) {
    setFiles([
      {
        name: file.name,
        originFileObj: file as UploadFile["originFileObj"],
        status: "done",
        uid: file.name,
      },
    ]);
    form.setFieldsValue(creditFromINaturalist(metadata, setGeorgia));
    setImported({ file, metadata });
  }

  function close() {
    if (running) return;
    setOpen(false);
    setFiles([]);
    setStates([]);
    setObservationUrl("");
    setImported(null);
    setImportError(null);
    form.resetFields();
  }

  async function importObservation() {
    setImporting(true);
    setImportError(null);
    setImported(null);
    try {
      fill(await importINaturalistPhoto(id, observationUrl));
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setImportError(
        error instanceof Error ? error.message : "iNaturalist import failed",
      );
    } finally {
      setImporting(false);
    }
  }

  async function upload(credit: PhotoCreditFields) {
    const jobs = files.flatMap((item) =>
      item.originFileObj
        ? [{ credit, file: item.originFileObj, uid: item.uid }]
        : [],
    );
    setStates(
      jobs.map(({ file, uid }) => ({
        name: file.name,
        status: "waiting",
        uid,
      })),
    );
    setRunning(true);
    let uploaded = 0;
    try {
      const results = await runPhotoUploads({
        id,
        jobs,
        onSessionExpired,
        onStatus: (uid, status, message) =>
          setStates((current) =>
            current.map((item) =>
              item.uid === uid ? { ...item, message, status } : item,
            ),
          ),
      });
      uploaded = results.length;
    } finally {
      setRunning(false);
      if (uploaded > 0) onUploaded();
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} type="primary">
        Add photos
      </Button>
      <Modal
        cancelText={finished ? "Close" : "Cancel"}
        closable={!running}
        okButtonProps={{
          disabled: files.length === 0 || finished,
          form: formId,
          htmlType: "submit",
          loading: running,
        }}
        okText="Upload"
        onCancel={close}
        open={open}
        title="Add photos to the gallery"
        width={720}
      >
        <Form<PhotoCreditFields>
          disabled={running || finished}
          form={form}
          id={formId}
          initialValues={INITIAL_CREDIT}
          layout="vertical"
          onFinish={upload}
          ref={formMounted}
        >
          <Form.Item
            extra="Fills in the observation's first photo and its photographer, place, date and coordinates. Hidden coordinates stay empty. The source link stays empty. Check the Georgian fields before you upload."
            label="iNaturalist observation"
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                aria-label="iNaturalist observation"
                maxLength={500}
                onChange={(event) => setObservationUrl(event.target.value)}
                onPressEnter={(event) => {
                  event.preventDefault();
                  if (observationUrl.trim()) void importObservation();
                }}
                placeholder="https://www.inaturalist.org/observations/123456"
                value={observationUrl}
              />
              <Button
                disabled={!observationUrl.trim()}
                loading={importing}
                onClick={() => void importObservation()}
              >
                Fetch
              </Button>
            </Space.Compact>
          </Form.Item>
          {importError ? (
            <Alert
              showIcon
              style={{ marginBottom: 16 }}
              title={importError}
              type="error"
            />
          ) : null}
          {imported ? (
            <Alert
              showIcon
              style={{ marginBottom: 16 }}
              title={`Filled in from iNaturalist. Photo licence: ${imported.metadata.license}.`}
              type="info"
            />
          ) : null}
          <Upload.Dragger
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
            beforeUpload={() => false}
            fileList={files}
            multiple
            onChange={({ fileList }) => {
              setFiles(fileList);
              setImported(null);
            }}
          >
            <p>Drop photos here or click to choose them.</p>
            <p>
              Each photo is compressed in this browser to AVIF and WebP at
              320–2400 px, then stored on the CDN.
            </p>
          </Upload.Dragger>
          <PhotoCreditFormFields
            profileName={profileNameOf(imported?.metadata)}
          />
        </Form>
        {states.length > 0 ? (
          <List
            dataSource={states}
            renderItem={(item) => (
              <List.Item extra={<UploadStatusTag status={item.status} />}>
                <List.Item.Meta description={item.message} title={item.name} />
              </List.Item>
            )}
            size="small"
          />
        ) : null}
        {finished && added > 0 ? <UploadedAlert count={added} /> : null}
      </Modal>
    </>
  );
}
