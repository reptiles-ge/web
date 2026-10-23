import { Alert, Button, Card, Form, Input, Layout } from "antd";
import { useState } from "react";

import { type AdminUser, signIn } from "./session";

type Credentials = { email: string; password: string };

const MESSAGES = {
  error: "Sign-in failed. Try again.",
  invalid: "Wrong email or password.",
  rate_limited: "Too many attempts. Wait a minute and try again.",
} as const;

export function LoginPage({
  onSignedIn,
}: {
  onSignedIn: (user: AdminUser) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<keyof typeof MESSAGES | null>(null);

  async function submit({ email, password }: Credentials) {
    setPending(true);
    setError(null);
    try {
      const result = await signIn(email, password);
      if (result.status === "signed_in") onSignedIn(result.user);
      else setError(result.status);
    } catch {
      setError("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <Layout style={{ alignItems: "center", minHeight: "100vh", padding: 24 }}>
      <Card
        style={{ marginTop: "15vh", maxWidth: 360, width: "100%" }}
        title="Sign in"
      >
        {error ? (
          <Alert
            message={MESSAGES[error]}
            showIcon
            style={{ marginBottom: 16 }}
            type="error"
          />
        ) : null}
        <Form<Credentials>
          disabled={pending}
          layout="vertical"
          onFinish={submit}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input autoComplete="username" autoFocus />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button block htmlType="submit" loading={pending} type="primary">
            Sign in
          </Button>
        </Form>
      </Card>
    </Layout>
  );
}
