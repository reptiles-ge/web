import {
  App as AntApp,
  Button,
  ConfigProvider,
  Layout,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";

import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { type AdminUser, fetchCurrentUser } from "./session";

type SessionState =
  | { status: "error" }
  | { status: "loading" }
  | { status: "signed_in"; user: AdminUser }
  | { status: "signed_out" };

export function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#2f6b4f" } }}>
      <AntApp>
        <AdminRoot />
      </AntApp>
    </ConfigProvider>
  );
}

function AdminRoot() {
  const [session, setSession] = useState<SessionState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchCurrentUser().then(
      (user) => {
        if (!active) return;
        setSession(
          user ? { status: "signed_in", user } : { status: "signed_out" },
        );
      },
      () => {
        if (active) setSession({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  function retry() {
    setSession({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  if (session.status === "signed_in") {
    return (
      <Dashboard
        onSignedOut={() => setSession({ status: "signed_out" })}
        user={session.user}
      />
    );
  }
  if (session.status === "signed_out") {
    return (
      <LoginPage
        onSignedIn={(user) => setSession({ status: "signed_in", user })}
      />
    );
  }
  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {session.status === "loading" ? (
        <Spin aria-label="Loading" size="large" />
      ) : (
        <Result
          extra={
            <Button onClick={retry} type="primary">
              Retry
            </Button>
          }
          status="error"
          title="Cannot reach the API"
        />
      )}
    </Layout>
  );
}
