"use client";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fff", color: "#181818", fontFamily: "Arial, sans-serif" }}>
        <title>Something went wrong | PT SUGEE</title>
        <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "24px" }}>
          <div role="alert" style={{ maxWidth: "720px" }}>
            <p style={{ color: "#249101", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase" }}>PT SUGEE</p>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 1.02 }}>Something went wrong</h1>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.65 }}>We could not load this page. Please try again.</p>
            <p lang="id" style={{ fontSize: "1.125rem", lineHeight: 1.65 }}>Terjadi kesalahan. Halaman ini belum dapat dimuat. Silakan coba kembali.</p>
            <button
              type="button"
              onClick={retry}
              style={{ background: "#249101", border: 0, borderRadius: "999px", color: "#fff", cursor: "pointer", font: "inherit", fontWeight: 700, marginTop: "24px", minHeight: "48px", padding: "12px 24px" }}
            >
              Try again / Coba kembali
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
