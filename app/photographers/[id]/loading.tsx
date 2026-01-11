export default function Loading() {
  return (
    <main>
      {/* Skeleton pour le header photographe */}
      <section className="photographer-header skeleton">
        <div className="photographer-header__info">
          <div className="skeleton-text skeleton-text--title" style={{ width: '200px', height: '2rem' }}></div>
          <div className="skeleton-text" style={{ width: '150px' }}></div>
          <div className="skeleton-text" style={{ width: '250px' }}></div>
        </div>
        <div className="skeleton-text" style={{ width: '150px', height: '3rem', borderRadius: '5px' }}></div>
        <div className="skeleton-image"></div>
      </section>

      {/* Skeleton pour la galerie */}
      <section aria-label="Chargement de la galerie">
        <div className="gallery-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="media-card skeleton">
              <div style={{
                width: '100%',
                height: '300px',
                background: '#e0e0e0',
                borderRadius: '5px',
                marginBottom: '1rem'
              }}></div>
              <div className="skeleton-text skeleton-text--title"></div>
              <div className="skeleton-text skeleton-text--small"></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
