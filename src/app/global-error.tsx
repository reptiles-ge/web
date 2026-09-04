"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ka">
      <head>
        <meta content="noindex" name="robots" />
      </head>
      <body
        style={{
          background: "#0e1411",
          color: "#f4f1ea",
          fontFamily: "Georgia, serif",
          margin: 0,
        }}
      >
        <main
          style={{
            boxSizing: "border-box",
            margin: "0 auto",
            maxWidth: "42rem",
            padding: "6rem 1.5rem",
          }}
        >
          <p style={{ letterSpacing: "0.28em", opacity: 0.55 }}>შეცდომა</p>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.15 }}>
            ეს გვერდი ახლა ვერ ჩაიტვირთა
          </h1>
          <p style={{ lineHeight: 1.6, opacity: 0.75 }}>
            სცადე ხელახლა. სასწრაფო დახმარება: 112.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#f4f1ea",
              border: 0,
              borderRadius: "999px",
              color: "#0e1411",
              cursor: "pointer",
              font: "inherit",
              marginTop: "1.5rem",
              padding: "0.85rem 1.5rem",
            }}
            type="button"
          >
            ხელახლა ცდა
          </button>
        </main>
      </body>
    </html>
  );
}
