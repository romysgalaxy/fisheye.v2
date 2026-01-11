export default function Loading() {
  return (
    <main>
      <section
        className="photographers-section"
        aria-label="Chargement des photographes"
      >
        <div className="photographers-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="photographer-card skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text skeleton-text--title"></div>
              <div className="skeleton-text skeleton-text--subtitle"></div>
              <div className="skeleton-text skeleton-text--small"></div>
              <div className="skeleton-text skeleton-text--small"></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
