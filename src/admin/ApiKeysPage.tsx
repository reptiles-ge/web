import type { ColumnsType } from "antd/es/table";

import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import { AdminListView } from "./AdminListView";
import { SessionExpiredError } from "./adminResponse";
import {
  type AdminApiKey,
  createApiKey,
  type CreatedApiKey,
  fetchApiKeys,
  revokeApiKey,
} from "./apiKeys";
import { includesQuery, useAdminList } from "./useAdminList";

type KeyForm = { expiresOn?: string; name: string; note?: string };

export function ApiKeysPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items: keys,
    reload,
    status,
  } = useAdminList(fetchApiKeys, onSessionExpired);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const [form] = Form.useForm<KeyForm>();
  const [messages, contextHolder] = message.useMessage();
  const visible = useMemo(
    () =>
      keys.filter((key) =>
        includesQuery([key.name, key.note ?? "", key.keyPrefix], query),
      ),
    [keys, query],
  );

  async function submit({ expiresOn, name, note }: KeyForm) {
    setPending(true);
    try {
      const key = await createApiKey({
        expiresAt: expiresOn
          ? new Date(`${expiresOn}T23:59:59Z`).toISOString()
          : null,
        name,
        note: note?.trim() || null,
      });
      setCreating(false);
      form.resetFields();
      setCreated(key);
      reload();
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(
        "The key could not be created. Check the fields and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  async function revoke(key: AdminApiKey) {
    try {
      await revokeApiKey(key.id);
      void messages.success(`Key revoked: ${key.name}.`);
      reload();
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(
        "The key could not be revoked. Try again in a minute.",
      );
    }
  }

  const columns: ColumnsType<AdminApiKey> = [
    {
      key: "name",
      render: (_, key) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>{key.name}</Typography.Text>
          {key.note ? (
            <Typography.Text type="secondary">{key.note}</Typography.Text>
          ) : null}
        </Space>
      ),
      title: "Client",
    },
    {
      dataIndex: "keyPrefix",
      key: "keyPrefix",
      render: (prefix: string) => (
        <Typography.Text code>{`${prefix}…`}</Typography.Text>
      ),
      title: "Key",
    },
    {
      key: "status",
      render: (_, key) => {
        const { color, label } = keyStatus(key);
        return <Tag color={color}>{label}</Tag>;
      },
      title: "Status",
    },
    {
      key: "created",
      render: (_, key) => `${formatDate(key.createdAt)} · ${key.createdBy}`,
      title: "Created",
    },
    {
      dataIndex: "lastUsedAt",
      key: "lastUsedAt",
      render: formatDate,
      title: "Last used",
    },
    {
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: (value: null | string) => (value ? formatDate(value) : "Never"),
      title: "Expires",
    },
    {
      fixed: "right",
      key: "actions",
      render: (_, key) =>
        key.revokedAt ? null : (
          <Popconfirm
            description="Requests with this key stop working within a minute. This cannot be undone; create a new key instead."
            okButtonProps={{ danger: true }}
            okText="Revoke"
            onConfirm={() => revoke(key)}
            title={`Revoke the key of ${key.name}?`}
          >
            <Button danger size="small">
              Revoke
            </Button>
          </Popconfirm>
        ),
      title: "Actions",
      width: 120,
    },
  ];

  return (
    <>
      {contextHolder}
      <AdminListView<AdminApiKey>
        actions={
          <Button onClick={() => setCreating(true)} type="primary">
            New key
          </Button>
        }
        columns={columns}
        noun="API keys"
        onQuery={setQuery}
        onReload={reload}
        rowKey="id"
        rows={visible}
        searchPlaceholder="Client, note or key prefix"
        status={status}
        title="API keys"
        total={keys.length}
      />
      <Modal
        confirmLoading={pending}
        destroyOnHidden
        okText="Create key"
        onCancel={() => setCreating(false)}
        onOk={() => form.submit()}
        open={creating}
        title="New API key"
      >
        <Form<KeyForm> form={form} layout="vertical" onFinish={submit}>
          <Form.Item
            label="Client"
            name="name"
            rules={[{ max: 100, required: true, whitespace: true }]}
          >
            <Input placeholder="Who uses this key" />
          </Form.Item>
          <Form.Item label="Note" name="note" rules={[{ max: 500 }]}>
            <Input.TextArea placeholder="What it is for" rows={2} />
          </Form.Item>
          <Form.Item
            extra="Leave empty for a key that does not expire."
            label="Expires on"
            name="expiresOn"
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={
          <Button onClick={() => setCreated(null)} type="primary">
            Done
          </Button>
        }
        onCancel={() => setCreated(null)}
        open={created !== null}
        title={created ? `Key for ${created.name}` : ""}
      >
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Alert
            message="Copy the key now. It is shown only once and cannot be recovered."
            showIcon
            type="warning"
          />
          <Typography.Paragraph code copyable>
            {created?.key}
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            Send it in the X-Api-Key header, from a server only. Never put it in
            browser code.
          </Typography.Text>
        </Space>
      </Modal>
    </>
  );
}

function formatDate(value: null | string) {
  return value ? value.slice(0, 10) : "—";
}

function keyStatus(key: AdminApiKey) {
  if (key.revokedAt) return { color: "red", label: "Revoked" };
  if (key.expiresAt && Date.parse(key.expiresAt) <= Date.now()) {
    return { color: "orange", label: "Expired" };
  }
  return { color: "green", label: "Active" };
}
