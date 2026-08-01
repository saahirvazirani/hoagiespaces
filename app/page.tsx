"use client";

import { FormEvent, useMemo, useState } from "react";

type Space = {
  id: number;
  name: string;
  building: string;
  walk: number;
  status: "Plenty of seats" | "Filling up" | "Crowded";
  tone: "green" | "amber" | "red";
  updated: string;
  confidence: "High confidence" | "Community signal" | "Typical pattern";
  noise: "Silent" | "Quiet" | "Collaborative";
  seats: string;
  tags: string[];
  accessible: boolean;
  hours: string;
  x: number;
  y: number;
  source: string;
};

const spaces: Space[] = [
  {
    id: 1,
    name: "Discovery Hub",
    building: "Firestone Library",
    walk: 4,
    status: "Plenty of seats",
    tone: "green",
    updated: "2 min ago",
    confidence: "High confidence",
    noise: "Collaborative",
    seats: "12–18 open",
    tags: ["Outlets", "Group friendly", "Nearby coffee"],
    accessible: true,
    hours: "Open today · 8am–9pm",
    x: 42,
    y: 54,
    source: "Princeton Library",
  },
  {
    id: 2,
    name: "Thomas-Graham Reading Room",
    building: "Firestone Library",
    walk: 5,
    status: "Filling up",
    tone: "amber",
    updated: "6 min ago",
    confidence: "Community signal",
    noise: "Quiet",
    seats: "4–7 open",
    tags: ["Natural light", "Outlets", "Individual desks"],
    accessible: true,
    hours: "Open today · 8am–9pm",
    x: 39,
    y: 47,
    source: "Princeton Library",
  },
  {
    id: 3,
    name: "Third Floor Commons",
    building: "Lewis Science Library",
    walk: 8,
    status: "Plenty of seats",
    tone: "green",
    updated: "9 min ago",
    confidence: "Community signal",
    noise: "Quiet",
    seats: "8–12 open",
    tags: ["Outlets", "Soft seating", "Natural light"],
    accessible: true,
    hours: "Open today · 9am–5pm",
    x: 77,
    y: 28,
    source: "Princeton Library",
  },
  {
    id: 4,
    name: "Elfers Reading Room",
    building: "Firestone Library",
    walk: 5,
    status: "Filling up",
    tone: "amber",
    updated: "Typical at this time",
    confidence: "Typical pattern",
    noise: "Silent",
    seats: "Likely 3–6 open",
    tags: ["Silent zone", "Long tables", "Natural light"],
    accessible: true,
    hours: "Open today · 8am–9pm",
    x: 45,
    y: 43,
    source: "Princeton Library",
  },
  {
    id: 5,
    name: "Group Study Rooms",
    building: "Firestone Library",
    walk: 4,
    status: "Crowded",
    tone: "red",
    updated: "4 min ago",
    confidence: "High confidence",
    noise: "Collaborative",
    seats: "Reservations limited",
    tags: ["Whiteboard walls", "Monitor", "Groups 1–10"],
    accessible: true,
    hours: "Reservation required",
    x: 47,
    y: 57,
    source: "Princeton Library",
  },
];

const quickNeeds = ["Quiet", "Group of 4", "Whiteboard", "Outlets", "Accessible"];

export default function Home() {
  const [activeNeed, setActiveNeed] = useState("Quiet");
  const [view, setView] = useState<"list" | "map">("list");
  const [modal, setModal] = useState<"request" | "report" | "detail" | null>(null);
  const [selected, setSelected] = useState<Space | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const rankedSpaces = useMemo(() => {
    const copy = [...spaces];
    if (activeNeed === "Quiet") return copy.sort((a) => (a.noise === "Quiet" || a.noise === "Silent" ? -1 : 1));
    if (activeNeed === "Group of 4") return copy.sort((a) => (a.noise === "Collaborative" ? -1 : 1));
    if (activeNeed === "Whiteboard") return copy.sort((a) => (a.tags.some((tag) => tag.includes("Whiteboard")) ? -1 : 1));
    return copy;
  }, [activeNeed]);

  function openDetail(space: Space) {
    setSelected(space);
    setModal("detail");
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestSent(true);
  }

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReportSent(true);
  }

  function closeModal() {
    setModal(null);
    setRequestSent(false);
    setReportSent(false);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="HoagieSpaces home">
          <span className="brand-mark">H</span>
          <span>hoagie<span className="brand-light">spaces</span></span>
        </a>
        <nav aria-label="Primary navigation">
          <a className="nav-active" href="#discover">Discover</a>
          <button className="nav-link" onClick={() => setModal("request")}>My requests <span className="nav-count">1</span></button>
          <a href="#how">How it works</a>
        </nav>
        <div className="profile">
          <div className="karma"><span>✦</span><strong>42</strong> karma</div>
          <button className="avatar" aria-label="Open profile">SV</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> 23 community reports in the last hour</div>
          <h1>Your next study spot<br />is already <em>waiting.</em></h1>
          <p>Real-time, student-powered space availability across Princeton. Find the right environment—or help the next Tiger find theirs.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setModal("request")}>Find me a space <span>→</span></button>
            <button className="secondary" onClick={() => setModal("report")}><span>＋</span> Report an opening</button>
          </div>
          <div className="trust-row">
            <span><b>✓</b> NetID community</span>
            <span><b>✓</b> Reports expire automatically</span>
            <span><b>✓</b> No room claiming</span>
          </div>
        </div>

        <div className="match-card" aria-label="Live match example">
          <div className="match-header">
            <span className="match-label"><span className="pulse" /> LIVE MATCH</span>
            <span className="match-time">just now</span>
          </div>
          <div className="match-space">
            <div className="space-icon">F</div>
            <div>
              <p className="mini-label">A SPACE MATCHES YOUR REQUEST</p>
              <h2>Discovery Hub</h2>
              <p>Firestone Library · 4 min walk</p>
            </div>
            <div className="match-score"><strong>94%</strong><span>match</span></div>
          </div>
          <div className="match-details">
            <div><span className="availability-dot green" /><strong>12–18 seats</strong><small>reported 2m ago</small></div>
            <div><span className="detail-symbol">◖</span><strong>Collaborative</strong><small>conversation welcome</small></div>
            <div><span className="detail-symbol">⌁</span><strong>Outlets</strong><small>along every table</small></div>
          </div>
          <button className="match-button" onClick={() => openDetail(spaces[0])}>View space & directions <span>→</span></button>
          <p className="match-footnote">Community report · Availability is not a reservation</p>
        </div>
      </section>

      <section className="discover" id="discover">
        <div className="section-head">
          <div>
            <span className="section-kicker">LIVE AROUND CAMPUS</span>
            <h2>Spaces that fit right now</h2>
          </div>
          <div className="view-toggle" aria-label="Choose results view">
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>☷ List</button>
            <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>⌖ Map</button>
          </div>
        </div>

        <div className="filters" aria-label="Filter spaces">
          <span>I need</span>
          {quickNeeds.map((need) => (
            <button key={need} className={activeNeed === need ? "filter-active" : ""} onClick={() => setActiveNeed(need)}>{need}</button>
          ))}
          <button className="all-filters">All filters <span>⌄</span></button>
        </div>

        {view === "list" ? (
          <div className="space-grid">
            {rankedSpaces.slice(0, 3).map((space) => (
              <article className="space-card" key={space.id}>
                <button
                  className={`save ${saved.includes(space.id) ? "saved" : ""}`}
                  onClick={() => setSaved((current) => current.includes(space.id) ? current.filter((id) => id !== space.id) : [...current, space.id])}
                  aria-label={`Save ${space.name}`}
                >{saved.includes(space.id) ? "★" : "☆"}</button>
                <div className="space-card-top">
                  <span className={`status-pill ${space.tone}`}><span />{space.status}</span>
                  <span className="updated">{space.updated}</span>
                </div>
                <h3>{space.name}</h3>
                <p className="building">{space.building} · {space.walk} min walk</p>
                <div className="card-stats">
                  <div><span>◉</span><strong>{space.noise}</strong><small>noise level</small></div>
                  <div><span>◫</span><strong>{space.seats}</strong><small>estimated</small></div>
                </div>
                <div className="tag-row">{space.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="confidence"><span>✓</span>{space.confidence} <b>·</b> {space.hours}</div>
                <button className="card-cta" onClick={() => openDetail(space)}>See this space <span>→</span></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="map-panel" aria-label="Campus map with study space pins">
            <div className="map-road road-one" /><div className="map-road road-two" />
            <span className="map-label chapel">Chapel</span><span className="map-label frist">Frist</span><span className="map-label nassau">Nassau Hall</span>
            {spaces.map((space) => (
              <button key={space.id} style={{ left: `${space.x}%`, top: `${space.y}%` }} className={`map-pin ${space.tone}`} onClick={() => openDetail(space)} aria-label={`Open ${space.name}`}>
                {space.seats.match(/\d+/)?.[0] ?? "!"}
              </button>
            ))}
            <div className="map-legend"><span><i className="green" />Open</span><span><i className="amber" />Filling</span><span><i className="red" />Crowded</span></div>
          </div>
        )}
        <p className="data-note">Official attributes and hours are linked to Princeton sources. Availability reports shown in this MVP are simulated demo data.</p>
      </section>

      <section className="how" id="how">
        <div>
          <span className="section-kicker light">THE HANDOFF LOOP</span>
          <h2>A marketplace for moments,<br />not rooms.</h2>
          <p>HoagieSpaces never lets students buy, reserve, or claim public space. It matches timely, expiring information with the students who need it.</p>
        </div>
        <ol>
          <li><span>01</span><div><strong>Post what you need</strong><p>“Quiet, outlets, for two, near Frist.”</p></div></li>
          <li><span>02</span><div><strong>Get a verified match</strong><p>Static space data + recent community reports.</p></div></li>
          <li><span>03</span><div><strong>Confirm the handoff</strong><p>Your arrival keeps the next recommendation honest.</p></div></li>
        </ol>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark small">H</span><strong>hoagie<span>spaces</span></strong></div>
        <p>Built by Princeton students · A PrincetonBuilds MVP</p>
        <div className="source-links">
          <a href="https://library.princeton.edu/services/firestone-library" target="_blank" rel="noreferrer">Firestone data ↗</a>
          <a href="https://library.princeton.edu/visit-and-spaces/locations" target="_blank" rel="noreferrer">Library hours ↗</a>
          <a href="https://library.princeton.edu/services/disability-accessibility-services" target="_blank" rel="noreferrer">Accessibility ↗</a>
        </div>
      </footer>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            {modal === "request" && !requestSent && (
              <form onSubmit={submitRequest}>
                <span className="section-kicker">SPACE REQUEST</span>
                <h2 id="modal-title">What does your group need?</h2>
                <p className="modal-intro">We’ll watch for the best live match for the next 45 minutes.</p>
                <label>Group size<select defaultValue="4"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label>
                <div className="form-row">
                  <label>Noise level<select defaultValue="Quiet"><option>Silent</option><option>Quiet</option><option>Collaborative</option></select></label>
                  <label>Near<select defaultValue="Frist"><option>Frist</option><option>Firestone</option><option>Lewis Library</option><option>Anywhere</option></select></label>
                </div>
                <fieldset><legend>Must have</legend><label className="check"><input type="checkbox" defaultChecked /> Outlets</label><label className="check"><input type="checkbox" defaultChecked /> Whiteboard</label><label className="check"><input type="checkbox" /> Accessible route</label></fieldset>
                <button className="primary wide" type="submit">Create live request <span>→</span></button>
              </form>
            )}
            {modal === "request" && requestSent && (
              <div className="success-state"><div className="success-icon">✓</div><span className="section-kicker">REQUEST ACTIVE</span><h2 id="modal-title">We found 3 possible matches.</h2><p>Your strongest match is the Discovery Hub at Firestone. We’ll alert you if a closer verified opening appears.</p><button className="primary wide" onClick={() => { setSelected(spaces[0]); setModal("detail"); }}>View 94% match <span>→</span></button></div>
            )}
            {modal === "report" && !reportSent && (
              <form onSubmit={submitReport}>
                <span className="section-kicker">HELP THE NEXT TIGER</span>
                <h2 id="modal-title">What’s opening up?</h2>
                <p className="modal-intro">Reports expire after 15 minutes and never reserve or claim a space.</p>
                <label>Space<select defaultValue="Discovery Hub"><option>Discovery Hub · Firestone</option><option>Thomas-Graham · Firestone</option><option>Third Floor Commons · Lewis</option><option>Other</option></select></label>
                <div className="form-row"><label>Seats opening<select defaultValue="4"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label><label>When<select defaultValue="Now"><option>Now</option><option>In 5 minutes</option><option>In 10 minutes</option></select></label></div>
                <fieldset><legend>What’s true right now?</legend><label className="check"><input type="checkbox" defaultChecked /> Outlets nearby</label><label className="check"><input type="checkbox" /> Whiteboard available</label><label className="check"><input type="checkbox" defaultChecked /> Conversation okay</label></fieldset>
                <button className="primary wide" type="submit">Publish 15-minute report <span>＋</span></button>
              </form>
            )}
            {modal === "report" && reportSent && (
              <div className="success-state"><div className="success-icon">+5</div><span className="section-kicker">REPORT PUBLISHED</span><h2 id="modal-title">Three active requests were notified.</h2><p>You earned 5 Tiger Karma. Your report will disappear automatically in 15 minutes unless another student confirms it.</p><button className="primary wide" onClick={closeModal}>Back to live spaces</button></div>
            )}
            {modal === "detail" && selected && (
              <div className="detail-modal">
                <span className={`status-pill ${selected.tone}`}><span />{selected.status}</span>
                <h2 id="modal-title">{selected.name}</h2>
                <p className="modal-intro">{selected.building} · {selected.walk} minute walk</p>
                <div className="detail-banner"><strong>{selected.seats}</strong><span>{selected.updated} · {selected.confidence}</span></div>
                <div className="detail-grid"><div><small>Noise</small><strong>{selected.noise}</strong></div><div><small>Access</small><strong>{selected.accessible ? "Accessible" : "Check route"}</strong></div><div><small>Today</small><strong>{selected.hours.replace("Open today · ", "")}</strong></div><div><small>Source</small><strong>{selected.source}</strong></div></div>
                <div className="tag-row large">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="policy-note"><strong>This is not a reservation.</strong> Availability can change before you arrive. Confirm what you find to help the community.</div>
                <button className="primary wide" onClick={() => setRequestSent(true)}>Start walking · {selected.walk} min <span>→</span></button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
