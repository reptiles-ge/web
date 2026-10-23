import type { ColumnsType } from "antd/es/table";

import {
  Alert,
  Button,
  Card,
  Flex,
  Progress,
  Rate,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useEffectEvent, useState } from "react";

import { publicEnv } from "@/lib/env";

import {
  type AdminRating,
  type AdminRatingsPage,
  fetchAdminRatings,
} from "./ratings";
import { SessionExpiredError } from "./species";

type LoadState =
  | { page: AdminRatingsPage; status: "ready" }
  | { status: "error" }
  | { status: "loading" };

const STARS = [5, 4, 3, 2, 1];

const SITE_ORIGIN = publicEnv().NEXT_PUBLIC_SITE_URL ?? "https://reptiles.ge";

const columns: ColumnsType<AdminRating> = [
  {
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: string) => new Date(value).toLocaleString(),
    title: "Date",
    width: 180,
  },
  {
    dataIndex: "rating",
    key: "rating",
    render: (rating: number) => (
      <Rate
        aria-label={`${rating} stars`}
        disabled
        style={{ fontSize: 14 }}
        value={rating}
      />
    ),
    title: "Rating",
    width: 150,
  },
  {
    dataIndex: "feedback",
    key: "feedback",
    render: (feedback: null | string) =>
      feedback ? (
        <Typography.Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {feedback}
        </Typography.Paragraph>
      ) : (
        <Typography.Text type="secondary">—</Typography.Text>
      ),
    title: "Feedback",
  },
  {
    dataIndex: "path",
    key: "path",
    render: (path: string) => (
      <Typography.Link
        ellipsis
        href={new URL(path, SITE_ORIGIN).href}
        rel="noreferrer"
        style={{ maxWidth: 260 }}
        target="_blank"
      >
        {decodeURI(path)}
      </Typography.Link>
    ),
    title: "Page",
  },
  {
    dataIndex: "locale",
    key: "locale",
    render: (locale: string) => <Tag>{locale}</Tag>,
    title: "Locale",
    width: 80,
  },
  {
    dataIndex: "country",
    key: "country",
    render: (country: null | string) => country ?? "—",
    title: "Country",
    width: 90,
  },
];

export function RatingsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [rating, setRating] = useState<number | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  const expire = useEffectEvent(onSessionExpired);
  const fail = useEffectEvent((error: unknown) => {
    if (error instanceof SessionExpiredError) expire();
    else setState({ status: "error" });
  });

  useEffect(() => {
    let active = true;
    fetchAdminRatings({ rating }).then(
      (page) => {
        if (active) setState({ page, status: "ready" });
      },
      (error: unknown) => {
        if (active) fail(error);
      },
    );
    return () => {
      active = false;
    };
  }, [attempt, rating]);

  function reload() {
    setState({ status: "loading" });
    setMoreFailed(false);
    setAttempt((count) => count + 1);
  }

  function filter(value: number | undefined) {
    setState({ status: "loading" });
    setMoreFailed(false);
    setRating(value);
  }

  async function loadMore() {
    if (state.status !== "ready" || state.page.nextCursor === null) return;
    const current = state.page;
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const next = await fetchAdminRatings({
        cursor: current.nextCursor ?? undefined,
        rating,
      });
      setState({
        page: { ...next, data: [...current.data, ...next.data] },
        status: "ready",
      });
    } catch (error) {
      if (error instanceof SessionExpiredError) onSessionExpired();
      else setMoreFailed(true);
    } finally {
      setLoadingMore(false);
    }
  }

  const page = state.status === "ready" ? state.page : null;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Flex align="center" gap="middle" justify="space-between" wrap>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Ratings
        </Typography.Title>
        <Space wrap>
          <Select<number | undefined>
            aria-label="Filter by rating"
            onChange={filter}
            options={[
              { label: "All ratings", value: undefined },
              ...STARS.map((stars) => ({
                label: `${stars} ★`,
                value: stars,
              })),
            ]}
            style={{ width: 140 }}
            value={rating}
          />
          <Button loading={state.status === "loading"} onClick={reload}>
            Reload
          </Button>
        </Space>
      </Flex>
      {state.status === "error" ? (
        <Alert
          action={<Button onClick={reload}>Retry</Button>}
          message="Could not load ratings."
          showIcon
          type="error"
        />
      ) : (
        <>
          {page ? <RatingsSummary summary={page.summary} /> : null}
          <Table<AdminRating>
            columns={columns}
            dataSource={page?.data ?? []}
            footer={() =>
              page ? `${page.data.length} of ${page.total} ratings` : null
            }
            loading={state.status === "loading"}
            pagination={false}
            rowKey="id"
            scroll={{ x: 900 }}
            size="small"
          />
          {moreFailed ? (
            <Alert
              message="Could not load more ratings."
              showIcon
              type="error"
            />
          ) : null}
          {page?.nextCursor ? (
            <Flex justify="center">
              <Button loading={loadingMore} onClick={loadMore}>
                Load more
              </Button>
            </Flex>
          ) : null}
        </>
      )}
    </Space>
  );
}

function RatingsSummary({ summary }: { summary: AdminRatingsPage["summary"] }) {
  return (
    <Flex gap="middle" wrap>
      <Card size="small" style={{ minWidth: 200 }}>
        <Statistic
          precision={2}
          title="Average"
          value={summary.average ?? "—"}
        />
        <Rate
          allowHalf
          aria-label="Average rating"
          disabled
          value={summary.average ?? 0}
        />
      </Card>
      <Card size="small" style={{ minWidth: 160 }}>
        <Statistic title="Ratings" value={summary.count} />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 260 }}>
        {STARS.map((stars) => {
          const count = summary.byRating[stars] ?? 0;
          return (
            <Flex align="center" gap="small" key={stars}>
              <Typography.Text style={{ width: 32 }}>{stars} ★</Typography.Text>
              <Progress
                percent={
                  summary.count ? Math.round((count / summary.count) * 100) : 0
                }
                showInfo={false}
                style={{ flex: 1, margin: 0 }}
              />
              <Typography.Text style={{ textAlign: "right", width: 40 }}>
                {count}
              </Typography.Text>
            </Flex>
          );
        })}
      </Card>
    </Flex>
  );
}
