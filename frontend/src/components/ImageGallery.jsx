import { useState } from 'react';
import { HiOutlinePhoto, HiXMark, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function ImageGallery({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 style={{
          fontSize: '0.95rem', fontWeight: 600,
          marginBottom: 'var(--space-md)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
        }}>
          <HiOutlinePhoto style={{ color: 'var(--accent-primary)' }} />
          Attached Images ({images.length})
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${images.length === 1 ? '280px' : '150px'}, 1fr))`,
          gap: 'var(--space-md)'
        }}>
          {images.map((url, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: images.length === 1 ? '16/10' : '1',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={url}
                alt={`Evidence ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                color: '#fff', fontSize: '0.7rem', padding: '16px 8px 6px',
                textAlign: 'center'
              }}>
                Image {index + 1} of {images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: 'none', borderRadius: '50%',
              width: 40, height: 40, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', backdropFilter: 'blur(8px)'
            }}
          >
            <HiXMark />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                  border: 'none', borderRadius: '50%',
                  width: 48, height: 48, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', backdropFilter: 'blur(8px)'
                }}
              >
                <HiChevronLeft />
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                  border: 'none', borderRadius: '50%',
                  width: 48, height: 48, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', backdropFilter: 'blur(8px)'
                }}
              >
                <HiChevronRight />
              </button>
            </>
          )}

          <img
            src={images[activeIndex]}
            alt={`Evidence ${activeIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '85vh',
              objectFit: 'contain', borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
            }}
          />

          <div style={{
            position: 'absolute', bottom: 24,
            color: '#fff', fontSize: '0.85rem',
            background: 'rgba(255,255,255,0.12)',
            padding: '6px 18px', borderRadius: 20,
            backdropFilter: 'blur(8px)'
          }}>
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
