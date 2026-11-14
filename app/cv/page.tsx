import { SiteHeader } from "@/components/site/header";

// Starts with /cv so the one robots.txt rule covers it without naming it.
const PDF = "/cv-rohan-kathuria.pdf";

// Unlinked, and kept out of search engines and crawlers (see public/robots.txt).
export const metadata = {
  title: "CV — Rohan Kathuria",
  robots: { index: false, follow: false, noarchive: true },
};

// The site is a static export, so there are no server redirects: /cv/ sends
// the browser on to the PDF itself, with a link in case that's blocked.
export default function CV() {
  return (
    <div className="page">
      <meta httpEquiv="refresh" content={`0; url=${PDF}`} />
      <SiteHeader crumb="CV" back="/" />
      <main className="d-post shell">
        <p>
          Opening <a href={PDF}>my CV (PDF)</a>…
        </p>
      </main>
    </div>
  );
}
