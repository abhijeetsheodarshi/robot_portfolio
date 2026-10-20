import React, { useEffect, useState } from 'react';
import { useShelfGlow } from '../lib/useShelfGlow.js';
import { EngineeringModal } from '../components/EngineeringModal.jsx';

export function HomePage({ navigate }) {
  useShelfGlow({ followPage: false });
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    const handleInspect = (e) => {
      if (window.__engModalClosing && Date.now() - window.__engModalClosing < 400) {
        return;
      }
      if (e.detail) {
        setSelectedComponent(e.detail);
      }
    };
    window.addEventListener('inspect-component', handleInspect);
    return () => window.removeEventListener('inspect-component', handleInspect);
  }, []);

  const handleLink = (e, path) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="shelf-page shelf-page--home __variable_7e8b18">
      <main className="shelf-home shelf-glow" data-shelf-glow="true">
        <header className="shelf-home__header">
          <a
            className="shelf-home__greeting"
            aria-label="Hi, I'm Abhijeet, a pre-final year student at BIT, Mesra."
            href="/"
            onClick={(e) => handleLink(e, '/')}
            data-cursor-shadow="true"
          >
            Hi, I'm Abhijeet, a pre-final year student at BIT, Mesra.
          </a>
        </header>

        <div className="shelf-home__content">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.42rem 1rem',
              background: 'rgba(21, 21, 21, 0.82)',
              border: '1px solid rgba(250, 97, 71, 0.45)',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.55), 0 0 12px rgba(250, 97, 71, 0.16)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontFamily: 'ui-monospace, monospace',
              color: 'rgba(255, 255, 255, 0.92)',
              letterSpacing: '0.04em',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#FA6147',
                boxShadow: '0 0 8px #FA6147'
              }}
            />
            <span>tap any 3d model to inspect</span>
          </div>
        </div>
      </main>

      <footer className="shelf-footer">
        <p className="shelf-footer__locations" data-cursor-shadow="true">
          abhijeet sheodarshi
        </p>
        <a className="shelf-footer__email" href="mailto:abhijeetsheodarshi@gmail.com" data-cursor-shadow="true">
          abhijeetsheodarshi@gmail.com
        </a>
        <nav className="shelf-footer__nav" aria-label="Social links">
          <a
            href="https://www.linkedin.com/in/abhijeetsheodarshi/"
            data-cursor-shadow="true"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </nav>
      </footer>

      {/* Engineering Dossier Modal */}
      {selectedComponent && (
        <EngineeringModal
          component={selectedComponent}
          onClose={() => {
            window.__engModalActive = false;
            window.__engModalClosing = Date.now();
            setSelectedComponent(null);
          }}
          onSelectComponent={setSelectedComponent}
        />
      )}
    </div>
  );
}
