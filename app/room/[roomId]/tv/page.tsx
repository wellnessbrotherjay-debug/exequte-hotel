'use client';

import { useEffect, useState } from 'react';
import { Orbitron } from 'next/font/google';
import Image from 'next/image';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
});

export default function TVDisplay() {
  const [time, setTime] = useState(45.0);
  const [phase, setPhase] = useState("GET READY");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev - 0.1;
        if (newTime < 0) {
          setPhase(phase => {
            if (phase === "GET READY") return "WORK";
            if (phase === "WORK") return "REST";
            return "GET READY";
          });
          return 45.0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-1: #05060a;
          --bg-2: #0b1420;
          --cyan: #00afff;
          --red: #ff3e3e;
          --text: #e8e8e8;
          --sub: #94a3b8;
          --panel: #0c121a;
          --border: rgba(0,175,255,.35);
          --radius: 14px;
          --glow: 0 0 0 1px var(--border), 0 0 24px rgba(0,175,255,.12);
        }

        html, body {
          height: 100%;
          margin: 0;
          background: radial-gradient(1200px 800px at 50% 20%, rgba(0,175,255,.10), transparent),
                    linear-gradient(180deg,var(--bg-1),var(--bg-2));
          color: var(--text);
          overflow: hidden;
        }

        .tv-safe {
          height: 100%;
          padding: min(2.5vh,24px) min(3vw,36px);
          box-sizing: border-box;
          display: grid;
          grid-template-rows: auto 1fr;
          gap: min(2vh,20px);
        }

        .grid {
          display: grid;
          grid-template-columns: 45fr 30fr 25fr;
          grid-template-rows: 1fr;
          gap: min(2vw,24px);
          height: 100%;
        }

        .card {
          background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.00));
          border-radius: var(--radius);
          box-shadow: var(--glow);
          position: relative;
          overflow: hidden;
        }

        .media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(.92) contrast(1.02);
        }

        /* Timer styles */
        .timer {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(600px 400px at 50% 45%, rgba(0,175,255,.10), rgba(0,175,255,0) 60%);
        }

        .phase {
          position: absolute;
          top: 22px;
          width: 100%;
          text-align: center;
          color: #7dd3fc;
          font-size: clamp(12px,1vw,16px);
          letter-spacing: .45em;
          text-transform: uppercase;
        }

        .digits {
          font-family: ${orbitron.style.fontFamily}, sans-serif;
          font-weight: 800;
          font-size: clamp(38px,6vw,120px);
          color: #7dd3fc;
          text-shadow: 0 0 28px rgba(0,175,255,.45);
        }

        .blueprint {
          position: absolute;
          bottom: 22px;
          width: 100%;
          text-align: center;
          color: var(--sub);
          font-size: clamp(10px,.95vw,14px);
          letter-spacing: .28em;
          text-transform: uppercase;
        }

        .next { color: var(--red); }

        /* Right column */
        .right-col {
          display: grid;
          grid-template-rows: 58% 1fr;
          gap: min(2vh,18px);
        }

        .caption {
          position: absolute;
          left: 18px;
          bottom: 16px;
          right: 18px;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,.55));
          padding: 38px 8px 8px 8px;
          border-radius: 12px;
          pointer-events: none;
        }

        .cap-title {
          font-weight: 700;
          font-size: clamp(12px,1.05vw,18px);
          text-shadow: 0 2px 12px rgba(0,0,0,.6);
        }

        .cap-sub {
          margin-top: 6px;
          display: inline-block;
          font-size: clamp(10px,.85vw,13px);
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 999px;
          padding: 4px 10px;
          backdrop-filter: blur(2px);
        }

        @media (max-aspect-ratio: 16/10) {
          .grid { grid-template-columns: 48fr 32fr 20fr; }
        }

        @media (max-width: 1400px) {
          .digits { font-size: clamp(36px,7.2vw,108px); }
        }
      `}</style>

      <div className={`tv-safe ${orbitron.variable}`}>
        {/* TOP: dynamic logo + headings */}
        <div className="top">
          <div className="logo-row">
            <Image 
              src="/builder-logo.png" 
              alt="RaceFit"
              width={32}
              height={32}
              style={{
                height: '1.6em',
                width: 'auto',
                filter: 'drop-shadow(0 0 12px rgba(0,175,255,.35))'
              }}
            />
            <span>RACEFIT</span>
          </div>
          <div className={`stage-title ${orbitron.className}`}>STAGE TIMER</div>
          <div className="stage-sub">45s WORK · 15s REST · STRENGTH · ROUND 1/1</div>
        </div>

        {/* MAIN 3-COLUMN GRID */}
        <div className="grid">
          {/* LEFT: MAIN VIDEO */}
          <section className="card main-video">
            <video 
              className="media" 
              src="/videos/current.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
            />
            <div className="caption">
              <div className="cap-title" id="exerciseTitle">
                BOSU Side Plank Hip Drops
              </div>
              <div className="cap-sub" id="equipment">
                Equipment: BOSU
              </div>
            </div>
          </section>

          {/* CENTER: TIMER */}
          <section className="card timer">
            <div className="phase" id="phaseText">{phase}</div>
            <div className={`digits ${orbitron.className}`}>
              {time.toFixed(1)}
            </div>
            <div className="blueprint">
              <span>INTERVAL BLUEPRINT</span><br/>
              <span>WORK <strong>45s</strong> &nbsp;&nbsp; CHANGE <strong>15s</strong></span><br/>
              <span className="next">NEXT: REST</span> &nbsp;&nbsp; <span>NEXT CUE IN: 45S</span>
            </div>
          </section>

          {/* RIGHT: UP NEXT + QR */}
          <aside className="right-col">
            <section className="card upnext">
              <span className="title">UP NEXT</span>
              <video 
                className="media" 
                src="/videos/next.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline
              />
              <span className="label" id="nextTitle">
                DB Squat Woodchops
              </span>
            </section>

            <section className="card qr">
              <h4>SCAN TO START WORKOUT</h4>
              <Image
                src="/qr-remote.png"
                alt="QR Code to control workout"
                width={180}
                height={180}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 0 0 3px rgba(255,255,255,.08), 0 8px 30px rgba(0,0,0,.35)'
                }}
              />
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
