// src/components/Background.tsx

export default function Background() {
  return (
    <>
      <style>{`
        @keyframes drift-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.15); }
        }

        @keyframes drift-reverse {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 60px) scale(1.05); }
        }

        .animate-drift-1 {
          animation: drift-slow 18s ease-in-out infinite;
        }

        .animate-drift-2 {
          animation: drift-reverse 22s ease-in-out infinite;
        }

        .animate-drift-3 {
          animation: drift-slow 15s ease-in-out infinite 3s;
        }
      `}</style>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] -top-40 -left-20 animate-drift-1"
          style={{ willChange: "transform" }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[110px] top-1/3 -right-32 animate-drift-2"
          style={{ willChange: "transform" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[90px] -bottom-20 left-1/4 animate-drift-3"
          style={{ willChange: "transform" }}
        />
      </div>

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}