"use client";

export function TrackedDownloadLink({ resourceId, href, children }: { resourceId: string; href: string; children: React.ReactNode }) {
  const handleClick = () => {
    fetch("/api/downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    }).catch(() => {}); // best-effort — never blocks the actual download
  };

  return (
    <a href={href} onClick={handleClick} className="primary-button" target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
