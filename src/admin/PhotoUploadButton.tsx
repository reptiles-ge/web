import type { UploadFile } from "antd/es/upload/interface";

import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Tag,
  Upload,
} from "antd";
import { useState } from "react";

import { SessionExpiredError } from "./adminResponse";
import {
  encodePhotoFile,
  importINaturalistPhoto,
  type INaturalistImport,
  type PhotoCreditFields,
  uploadSpeciesPhoto,
} from "./photos";

type FileState = {
  message?: string;
  name: string;
  status: "added" | "compressing" | "failed" | "uploading" | "waiting";
  uid: string;
};

const STATUS_TAGS: Record<
  FileState["status"],
  { color: string; label: string }
> = {
  added: { color: "green", label: "Added" },
  compressing: { color: "processing", label: "Compressing" },
  failed: { color: "red", label: "Failed" },
  uploading: { color: "processing", label: "Uploading" },
  waiting: { color: "default", label: "Waiting" },
};

export function PhotoUploadButton({
  id,
  onSessionExpired,
  onUploaded,
}: {
  id: string;
  onSessionExpired: () => void;
  onUploaded: () => void;
}) {
  const [form] = Form.useForm<PhotoCreditFields>();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [states, setStates] = useState<FileState[]>([]);
  const [running, setRunning] = useState(false);
  const [observationUrl, setObservationUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<INaturalistImport | null>(null);
  const [importError, setImportError] = useState<null | string>(null);
  const added = states.filter((item) => item.status === "added").length;
  const finished = !running && states.length > 0 && states.every(isSettled);

  function update(uid: string, next: Partial<FileState>) {
    setStates((current) =>
      current.map((item) => (item.uid === uid ? { ...item, ...next } : item)),
    );
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
      const result = await importINaturalistPhoto(id, observationUrl);
      const { file, metadata } = result;
      setFiles([
        {
          name: file.name,
          originFileObj: file as UploadFile["originFileObj"],
          status: "done",
          uid: file.name,
        },
      ]);
      form.setFieldsValue({
        date: metadata.date,
        georgiaField: metadata.georgiaField,
        lat: String(metadata.lat),
        lng: String(metadata.lng),
        location: metadata.location,
        locationEn: metadata.location,
        photographer: metadata.photographer,
        photographerEn: metadata.photographer,
        url: metadata.url,
      });
      setImported(result);
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
    const queue = files.flatMap((item) =>
      item.originFileObj ? [{ file: item.originFileObj, uid: item.uid }] : [],
    );
    setStates(
      queue.map(({ file, uid }) => ({
        name: file.name,
        status: "waiting",
        uid,
      })),
    );
    setRunning(true);
    let uploaded = 0;
    try {
      for (const { file, uid } of queue) {
        try {
          update(uid, { status: "compressing" });
          const photo = await encodePhotoFile(file);
          update(uid, { status: "uploading" });
          await uploadSpeciesPhoto(id, credit, photo);
          update(uid, { status: "added" });
          uploaded += 1;
        } catch (error) {
          if (error instanceof SessionExpiredError) {
            onSessionExpired();
            return;
          }
          update(uid, {
            message: error instanceof Error ? error.message : "Upload failed",
            status: "failed",
          });
        }
      }
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
          loading: running,
        }}
        okText="Upload"
        onCancel={close}
        onOk={() => form.submit()}
        open={open}
        title="Add photos to the gallery"
        width={720}
      >
        <Form<PhotoCreditFields>
          disabled={running || finished}
          form={form}
          layout="vertical"
          onFinish={upload}
        >
          <Form.Item
            extra="Fills in the observation's first photo and its photographer, place, date, coordinates and link. Hidden coordinates stay empty. Check the Georgian fields before you upload."
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
          <Row gutter={12} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Form.Item label="Photographer (Georgian)" name="photographer">
                <Input maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Photographer (English)" name="photographerEn">
                <Input maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Place (Georgian)" name="location">
                <Input maxLength={300} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Place (English)" name="locationEn">
                <Input maxLength={300} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Date" name="date">
                <Input maxLength={40} placeholder="2026-05-10" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Latitude" name="lat">
                <Input maxLength={40} placeholder="41.81667" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Longitude" name="lng">
                <Input maxLength={40} placeholder="45.35" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Source link" name="url">
                <Input maxLength={500} placeholder="https://" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="georgiaField" valuePropName="checked">
            <Checkbox>Taken in Georgia (needs a place)</Checkbox>
          </Form.Item>
        </Form>
        {states.length > 0 ? (
          <List
            dataSource={states}
            renderItem={(item) => (
              <List.Item
                extra={
                  <Tag color={STATUS_TAGS[item.status].color}>
                    {STATUS_TAGS[item.status].label}
                  </Tag>
                }
              >
                <List.Item.Meta description={item.message} title={item.name} />
              </List.Item>
            )}
            size="small"
          />
        ) : null}
        {finished && added > 0 ? (
          <Alert
            showIcon
            style={{ marginTop: 16 }}
            title={`${added} ${added === 1 ? "photo" : "photos"} added to the gallery. The site shows them after you clear this species' cache, and serves their AVIF and WebP sizes from the next site deploy.`}
            type="success"
          />
        ) : null}
      </Modal>
    </>
  );
}

function isSettled(item: FileState) {
  return item.status === "added" || item.status === "failed";
}
