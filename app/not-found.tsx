import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import DownloadCTA from "@/components/blog/DownloadCTA";

export const metadata: Metadata = {
  title: "Page not found | Ziro Market",
  description: "The page you're looking for doesn't exist. Download the app or head back home.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <section
          className="crosshair"
          style={{
            paddingTop: 120,
            paddingBottom: 96,
            textAlign: "center",
            borderBottom: "1px solid var(--border-1)",
          }}
        >
          <div className="container" style={{ maxWidth: 560 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Error 404
            </div>
            <h1
              style={{
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
              }}
            >
              This page{" "}
              <em style={{ fontStyle: "normal", fontWeight: 300 }}>
                went missing
              </em>
              .
            </h1>
            <p
              style={{
                marginTop: 14,
                color: "var(--text-2)",
                maxWidth: 440,
                margin: "14px auto 0",
              }}
            >
              The link is broken or the page moved. Get the app, or head back to
              the homepage.
            </p>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="/" className="btn btn-primary btn-lg">
                Back home →
              </a>
              <a href="/blog" className="btn btn-ghost btn-lg">
                Browse Learn
              </a>
            </div>
          </div>
        </section>

        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
