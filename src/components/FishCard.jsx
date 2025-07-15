import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// Default glassmorphism style
const baseGlassStyle = {
  background: 'rgba(255,255,255,0.25)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: '2rem',
  border: '1.5px solid rgba(255,255,255,0.25)' // fallback border color
};

export default function FishCard({ fish, className = '' }) {
  // Merge dynamic color into glass style
  const containerStyle = useMemo(() => ({
    ...baseGlassStyle,
    borderColor: fish.color,
    // allow overriding via className if needed
  }), [fish.color]);

  // Fallbacks
  const name = fish.name || 'Unknown Fish';
  const mood = fish.mood || 'Undefined Mood';
  const description = fish.description || 'No description available.';

  return (
    <article
      className={`flex flex-col items-center p-6 max-w-xs mx-auto mt-6 ${className}`}
      style={containerStyle}
      aria-label={`${name} card`}
    >
      <div
        className="w-24 h-16 mb-4"
        dangerouslySetInnerHTML={{ __html: fish.svg }}
        role="img"
        aria-label={`${name} illustration`}
      />

      <header className="text-center mb-2">
        <h2 className="text-2xl font-bold" style={{ color: fish.color }}>
          {name}
        </h2>
        <p className="text-lg font-semibold opacity-85" style={{ color: fish.color }}>
          {mood}
        </p>
      </header>

      <section className="text-center text-base text-slate-700">
        {description}
      </section>
    </article>
  );
}

FishCard.propTypes = {
  fish: PropTypes.shape({
    name: PropTypes.string.isRequired,
    mood: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    svg: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string
};
