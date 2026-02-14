const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

// Prefer real AWS region env vars; fallback to your custom one; else unknown
const region =
  process.env.AWS_REGION ||
  process.env.AWS_DEFAULT_REGION ||
  process.env.REGION ||
  "Unknown";

app.get('/', (req, res) => {
  const now = new Date().toISOString();

  res.send(`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AWS Multi-Region DR Demo</title>
      <style>
        :root{
          --bg: #0b1220;
          --card: rgba(255,255,255,0.06);
          --card2: rgba(255,255,255,0.08);
          --text: rgba(255,255,255,0.92);
          --muted: rgba(255,255,255,0.72);
          --border: rgba(255,255,255,0.10);
          --accent: #ff9900; /* AWS-ish orange */
          --good: #2ecc71;
          --shadow: 0 10px 30px rgba(0,0,0,0.35);
          --radius: 16px;
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          color: var(--text);
          background: radial-gradient(1200px 600px at 20% 10%, rgba(255,153,0,0.25), transparent 60%),
                      radial-gradient(900px 500px at 80% 30%, rgba(46,204,113,0.18), transparent 60%),
                      linear-gradient(180deg, #070b14, var(--bg));
          min-height: 100vh;
        }

        .container {
          max-width: 980px;
          margin: 0 auto;
          padding: 28px 18px 60px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .logo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(255,153,0,0.14);
          border: 1px solid rgba(255,153,0,0.25);
        }

        .titlewrap { min-width: 0; }
        h1 {
          font-size: 18px;
          margin: 0;
          letter-spacing: 0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .subtitle {
          margin: 2px 0 0;
          font-size: 13px;
          color: var(--muted);
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.04);
          color: var(--text);
          font-size: 13px;
          text-decoration: none;
        }
        .chip strong { font-weight: 700; }
        .dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: var(--good);
          box-shadow: 0 0 0 4px rgba(46,204,113,0.15);
        }

        .hero {
          margin-top: 18px;
          padding: 18px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
        }

        .hero h2 {
          margin: 0 0 8px;
          font-size: 22px;
          letter-spacing: 0.2px;
        }
        .hero p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 860px) {
          .grid { grid-template-columns: 1.1fr 0.9fr; }
        }

        .card {
          padding: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
        .card h3 {
          margin: 0 0 10px;
          font-size: 16px;
          letter-spacing: 0.2px;
        }
        .card p, .card li { color: var(--muted); line-height: 1.6; }
        .card ul { margin: 10px 0 0; padding-left: 18px; }
        .card li { margin: 6px 0; }

        .regionBox {
          display: grid;
          gap: 10px;
        }
        .badgeRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--card2);
          font-size: 13px;
        }
        .badge .label { color: rgba(255,255,255,0.65); }
        .badge .value { font-weight: 700; color: var(--text); }

        .regionHighlight {
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,153,0,0.35);
          background: rgba(255,153,0,0.10);
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: #ffd08a;
        }

        .footer {
          margin-top: 18px;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-align: center;
        }

        .btn {
          border: 1px solid rgba(255,153,0,0.35);
          background: rgba(255,153,0,0.12);
        }
      </style>
    </head>
    <body>
      <div class="container">

        <div class="topbar">
          <div class="brand">
            <div class="logo" aria-label="AWS logo">
              <!-- Inline SVG "AWS-style" mark (no external files needed) -->
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6.2 17.1c3.6 2.3 8 2.4 11.6.3" stroke="#ff9900" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 8.2l4-3.2 4 3.2v7.6l-4 3.2-4-3.2V8.2z" stroke="rgba(255,255,255,0.85)" stroke-width="1.6" />
                <path d="M9.5 10.2h5" stroke="rgba(255,255,255,0.85)" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M9.5 12.3h5" stroke="rgba(255,255,255,0.85)" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="titlewrap">
              <h1>AWS Multi-Region Disaster Recovery Demo</h1>
              <div class="subtitle">App Runner • Multi-region deployment • DR-ready routing</div>
            </div>
          </div>

          <div class="actions">
            <span class="chip"><span class="dot"></span> Status: <strong>Healthy</strong></span>
            <span class="chip btn">Serving Region: <strong>${region}</strong></span>
          </div>
        </div>

        <div class="hero">
          <h2>Project Overview</h2>
          <p>
            This application runs in multiple AWS Regions using <strong>AWS App Runner</strong>.
            It demonstrates <strong>high availability</strong>, <strong>automated deployments</strong>, and a
            <strong>disaster recovery strategy</strong> where traffic can fail over between regions.
          </p>
        </div>

        <div class="grid">
          <div class="card">
            <h3>How It Works</h3>
            <ul>
              <li>Code is pushed to GitHub.</li>
              <li>AWS App Runner builds and deploys automatically.</li>
              <li>The same app is deployed in two regions (e.g., US-East-1 and US-West-2).</li>
              <li>Each region runs independently (stateless app design).</li>
              <li>Traffic can be routed via Route 53 for health-check based failover.</li>
            </ul>
          </div>

          <div class="card regionBox">
            <h3>Current Serving Region</h3>

            <div class="regionHighlight">${region}</div>

            <div class="badgeRow">
              <div class="badge">
                <span class="label">Timestamp</span>
                <span class="value">${now}</span>
              </div>
              <div class="badge">
                <span class="label">Port</span>
                <span class="value">${port}</span>
              </div>
            </div>

            <div class="badgeRow">
              <div class="badge">
                <span class="label">Routing</span>
                <span class="value">Multi-Region Ready</span>
              </div>
            </div>

            <p style="margin: 2px 0 0;">
              Tip: open the app URL from each region to confirm the region label changes.
            </p>
          </div>

          <div class="card" style="grid-column: 1 / -1;">
            <h3>Architecture Highlights</h3>
            <ul>
              <li>Fully managed deployment (no server management)</li>
              <li>Auto-scaling enabled</li>
              <li>Stateless design for easy multi-region deployment</li>
              <li>Disaster Recovery ready (Route 53 failover)</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          Built on AWS App Runner • Multi-region deployment demo • © ${(new Date()).getFullYear()}
        </div>

      </div>
    </body>
  </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${region}`);
});
