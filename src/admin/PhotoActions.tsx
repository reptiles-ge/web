import { Alert, Button, Form, message, Modal, Popconfirm, Space } from "antd";
import { useState } from "react";

import type { PhotoCreditFields } from "./photos";

import { SessionExpiredError } from "./adminResponse";
import { PhotoCreditFormFields } from "./PhotoCreditFormFields";
import {
  type AdminSpeciesRecord,
  deleteSpeciesPhoto,
  saveSpeciesPhotoCredit,
} from "./species";

type Credit = AdminSpeciesRecord["record"]["base"]["imageCredit"];

export function PhotoActions({
  canDelete,
  credit,
  enCredit,
  georgiaField,
  id,
  onChanged,
  onSessionExpired,
  src,
  version,
}: {
  canDelete: boolean;
  credit: Credit;
  enCredit: Credit;
  georgiaField: boolean;
  id: string;
  onChanged: (version: number, notice: string) => void;
  onSessionExpired: () => void;
  src: string;
  version: number;
}) {
  const [form] = Form.useForm<PhotoCreditFields>();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [messages, contextHolder] = message.useMessage();

  function failed(caught: unknown, fallback: string) {
    if (caught instanceof SessionExpiredError) {
      onSessionExpired();
      return null;
    }
    return caught instanceof Error ? caught.message : fallback;
  }

  function edit() {
    form.setFieldsValue({
      ...creditFields(credit, enCredit),
      georgiaField,
    });
    setError(null);
    setOpen(true);
  }

  async function save(values: PhotoCreditFields) {
    setSaving(true);
    setError(null);
    try {
      const saved = await saveSpeciesPhotoCredit(
        id,
        src,
        { ...values, georgiaField: Boolean(values.georgiaField) },
        version,
      );
      setOpen(false);
      onChanged(saved, "Photo credit saved.");
    } catch (caught) {
      setError(failed(caught, "Photo credit save failed"));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      const saved = await deleteSpeciesPhoto(id, src, version);
      onChanged(saved, "Photo removed from the gallery.");
    } catch (caught) {
      const text = failed(caught, "Photo delete failed");
      if (text) void messages.error(text);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {contextHolder}
      <Space>
        <Button onClick={edit} size="small">
          Edit
        </Button>
        <Popconfirm
          description="It leaves the gallery in every language. A cover that uses it moves to the next photo. The file stays on the CDN."
          disabled={!canDelete}
          okButtonProps={{ danger: true }}
          okText="Delete"
          onConfirm={remove}
          title="Delete this photo?"
        >
          <Button
            danger
            disabled={!canDelete}
            loading={deleting}
            size="small"
            title={canDelete ? undefined : "The last gallery photo stays"}
          >
            Delete
          </Button>
        </Popconfirm>
      </Space>
      <Modal
        forceRender
        okButtonProps={{ loading: saving }}
        okText="Save"
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        open={open}
        title="Edit photo credit"
        width={720}
      >
        <Form<PhotoCreditFields>
          disabled={saving}
          form={form}
          layout="vertical"
          onFinish={save}
        >
          <PhotoCreditFormFields />
        </Form>
        {error ? <Alert showIcon title={error} type="error" /> : null}
      </Modal>
    </>
  );
}

function creditFields(
  credit: Credit,
  enCredit: Credit,
): Omit<PhotoCreditFields, "georgiaField"> {
  return {
    date: credit?.date ?? "",
    lat: credit?.lat === undefined ? "" : String(credit.lat),
    lng: credit?.lng === undefined ? "" : String(credit.lng),
    location: credit?.location ?? "",
    locationEn: enCredit?.location ?? "",
    photographer: credit?.photographer ?? "",
    photographerEn: enCredit?.photographer ?? "",
    url: credit?.url ?? "",
  };
}
