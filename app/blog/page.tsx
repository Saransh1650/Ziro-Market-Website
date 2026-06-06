import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogListing from "@/components/blog/BlogListing";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Learn | Ziro Market",
  description:
    "Indian stock market concepts, events, and terminology explained in plain English.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Learn | Ziro Market",
    description: "Indian stock market explained in plain English.",
    url: "https://ziromarket.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main>
        <section
          style={{ paddingTop: 72, borderBottom: "1px solid var(--border-1)" }}
        >
          <div className="container">
            <div style={{ paddingBottom: 48 }}>
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
                Ziro Market / Learn
              </div>
              <h1
                style={{
                  fontSize: "clamp(2rem,4vw,3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.08,
                }}
              >
                Markets,{" "}
                <em style={{ fontStyle: "normal", fontWeight: 300 }}>
                  explained
                </em>
                <br />
                without the jargon.
              </h1>
              <p
                style={{ marginTop: 12, color: "var(--text-2)", maxWidth: 480 }}
              >
                Plain English. Real examples from the Indian market.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            {posts.length === 0 ? (
              <p style={{ padding: "64px 0", color: "var(--text-3)" }}>
                Posts coming soon.
              </p>
            ) : (
              <BlogListing posts={posts} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
