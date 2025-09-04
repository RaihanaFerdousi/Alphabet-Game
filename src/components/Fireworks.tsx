import React, { useEffect, useState } from 'react';

interface FireworksProps {
  isActive: boolean;
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

export const Fireworks: React.FC<FireworksProps> = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const colors = ['#f43f5e', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    const newParticles: Particle[] = [];

    for (let burst = 0; burst < 4; burst++) {
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 40;

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        
        newParticles.push({
          id: burst * 12 + i,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1
        });
      }
    }

    setParticles(newParticles);

    const animationInterval = setInterval(() => {
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1,
          life: particle.life - 0.015
        })).filter(particle => particle.life > 0);

        if (updatedParticles.length === 0) {
          clearInterval(animationInterval);
          setTimeout(onComplete, 500);
        }

        return updatedParticles;
      });
    }, 40);

    return () => clearInterval(animationInterval);
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 12px ${particle.color}`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
      

      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-r from-rose-300 to-blue-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.8 + Math.random() * 0.8}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};