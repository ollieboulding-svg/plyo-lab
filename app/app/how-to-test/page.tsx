export default function HowToTestPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>How to Test (Plyo Lab)</h1>
      <p>
        Use the same method each time so your baseline and retest are fair.
        Warm up properly and record your best attempt (unless stated).
      </p>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>20m Sprint</h2>
        <ul>
          <li>Flat surface (track is best)</li>
          <li>Standing start, start timer on first movement</li>
          <li>2–3 attempts, full rest (1–2 minutes), record best</li>
        </ul>
        <p><strong>Video:</strong> (Add your YouTube link below)</p>
        <div style={{ aspectRatio: "16/9", width: "100%", background: "#111" }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="20m Sprint Testing"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>Vertical Jump</h2>
        <ul>
          <li>Use a wall + chalk, or a jump measuring device</li>
          <li>Two-foot takeoff, controlled landing</li>
          <li>2–3 attempts, record best</li>
        </ul>
        <div style={{ aspectRatio: "16/9", width: "100%", background: "#111" }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Vertical Jump Testing"
            allowFullScreen
          />
        </div>
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>Broad Jump</h2>
        <ul>
          <li>Two-foot takeoff, land and “stick” the landing</li>
          <li>Measure from start line to back of the heel</li>
          <li>2–3 attempts, record best</li>
        </ul>
        <div style={{ aspectRatio: "16/9", width: "100%", background: "#111" }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Broad Jump Testing"
            allowFullScreen
          />
        </div>
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>Push-Ups</h2>
        <ul>
          <li>Full lockout at the top</li>
          <li>Chest to fist depth (or consistent depth standard)</li>
          <li>Stop the test when form breaks</li>
        </ul>
        <div style={{ aspectRatio: "16/9", width: "100%", background: "#111" }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Push-Up Testing"
            allowFullScreen
          />
        </div>
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>1km Run</h2>
        <ul>
          <li>Track or flat route is best</li>
          <li>Continuous run (no stopping)</li>
          <li>Record time as <strong>mm.ss</strong> (example: 3.56 = 3m56s)</li>
        </ul>
        <div style={{ aspectRatio: "16/9", width: "100%", background: "#111" }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="1km Run Testing"
            allowFullScreen
          />
        </div>
      </section>

      <hr style={{ margin: "20px 0" }} />

      <p>
        Once you’ve completed baseline testing, follow a 4–6 week training block,
        then retest using the same setup.
      </p>
    </main>
  );
}
