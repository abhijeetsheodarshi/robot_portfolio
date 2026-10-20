import React, { useEffect } from 'react';
import { ALL_COMPONENTS } from '../data/engineeringComponents.js';

export function EngineeringModal({ component, onClose, onSelectComponent }) {
  useEffect(() => {
    window.__engModalActive = true;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSafeClose(e);
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.__engModalActive = false;
      window.__engModalClosing = Date.now();
    };
  }, [component]);

  if (!component) return null;

  const handleSafeClose = (e) => {
    const cx = e?.clientX ?? window.__lastPointerX;
    const cy = e?.clientY ?? window.__lastPointerY;
    if (typeof cx === 'number' && typeof cy === 'number') {
      window.__shelfGlow?.lookAt(cx, cy, true);
    }
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation?.();
      }
    }
    window.__engModalActive = false;
    window.__engModalClosing = Date.now();
    onClose();
  };

  const currentIndex = ALL_COMPONENTS.findIndex((c) => c.id === component.id);
  const totalCount = ALL_COMPONENTS.length;

  const goToPrev = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (currentIndex > 0) {
      onSelectComponent(ALL_COMPONENTS[currentIndex - 1]);
    } else {
      onSelectComponent(ALL_COMPONENTS[totalCount - 1]);
    }
  };

  const goToNext = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (currentIndex < totalCount - 1) {
      onSelectComponent(ALL_COMPONENTS[currentIndex + 1]);
    } else {
      onSelectComponent(ALL_COMPONENTS[0]);
    }
  };

  const isProject = component.type === 'project';
  const isExperience = component.type === 'experience';

  return (
    <div
      className="eng-modal-backdrop"
      onPointerDown={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
        }
      }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
          handleSafeClose(e);
        }
      }}
    >
      <div
        className="eng-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eng-modal-title"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="eng-modal-header">
          <div className="eng-modal-shelf-badge">
            <span className="eng-modal-badge-dot" />
            <span className="eng-modal-badge-text">
              {component.shelf || 'PRODUCTION & INDUSTRIAL ENGINEERING'}
            </span>
          </div>
          <div className="eng-modal-nav-tools">
            <span className="eng-modal-counter">
              {(currentIndex + 1).toString().padStart(2, '0')} / {totalCount.toString().padStart(2, '0')}
            </span>
            <button
              className="eng-modal-icon-btn"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={goToPrev}
              title="Previous Component (Left Arrow)"
              aria-label="Previous component"
            >
              ←
            </button>
            <button
              className="eng-modal-icon-btn"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={goToNext}
              title="Next Component (Right Arrow)"
              aria-label="Next component"
            >
              →
            </button>
            <button
              className="eng-modal-close-btn"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
                window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
                window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
              }}
              onClick={handleSafeClose}
              title="Close (Esc)"
              aria-label="Close dossier"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Title & Category Banner */}
        <div className="eng-modal-banner">
          <div className="eng-modal-tag-chip">
            {component.tag || 'SPEC_SYS'}
          </div>
          <div className="eng-modal-icon">{component.icon || '⚙️'}</div>
          <div>
            <h2 id="eng-modal-title" className="eng-modal-title">
              {component.title || component.name}
            </h2>
            <p className="eng-modal-category">
              {component.company || component.category}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="eng-modal-body">
          {isProject ? (
            /* Dedicated Project View (Neural Network) */
            <div className="eng-internship-view">
              <div className="eng-internship-header-card">
                <h3 className="eng-internship-title">{component.title || 'Ongoing project'}</h3>
                {component.subtitle && (
                  <div className="eng-internship-role-line">
                    {component.subtitle}
                  </div>
                )}
              </div>

              <div className="eng-internship-body-card">
                <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: '1.75', color: '#f0f0f0' }}>
                  {component.content}
                </p>
              </div>
            </div>
          ) : isExperience ? (
            /* Dedicated Experience View (Tata Steel, Hero MotoCorp, WorldQuant) */
            <div className="eng-internship-view">
              <div className="eng-internship-header-card">
                <h3 className="eng-internship-title">{component.title}</h3>
                <div className="eng-internship-role-line">
                  {component.roleLine}
                </div>
                <div className="eng-internship-company">
                  {component.company}
                </div>
              </div>

              <div className="eng-internship-body-card">
                <ul className="eng-internship-bullets">
                  {component.points && component.points.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Fallback generic view */
            <div className="eng-internship-view">
              <div className="eng-internship-header-card">
                <h3 className="eng-internship-title">{component.name}</h3>
                <p className="eng-summary-text">{component.summary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="eng-modal-footer">
          <span className="eng-modal-tip">Tip: Use ← / → arrow keys to inspect next dossier, Esc to close</span>
          <button
            className="eng-modal-action-btn"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation?.();
              window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation?.();
              window.__shelfGlow?.lookAt(e.clientX, e.clientY, true);
            }}
            onClick={handleSafeClose}
          >
            Back to Laboratory
          </button>
        </div>
      </div>
    </div>
  );
}
