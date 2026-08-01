"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Noise = "Silent" | "Quiet" | "Conversation" | "Collaborative";
type Zone = "Central" | "East" | "South" | "Downtown";
type Kind = "Library" | "Campus commons" | "Café";
type Hours = Array<[number, number] | null>;

type Space = {
  id: string;
  name: string;
  building: string;
  zone: Zone;
  kind: Kind;
  lat: number;
  lng: number;
  walkFromFrist: number;
  noise: Noise;
  groupMax: number;
  groupLabel: string;
  access: string;
  reservable: boolean;
  features: string[];
  firstYearTip: string;
  hours: Hours;
  hoursLabel: string;
  officialUrl: string;
  officialSource: string;
  verified: string;
};

type Report = {
  id: string;
  spaceId: string;
  status: "plenty" | "some" | "full";
  seats: number;
  note: string;
  createdAt: number;
  expiresAt: number;
  reporter?: string;
};

type DemoAccount = { netid: string; karma: number };

const libraryHours: Hours = [[10, 21], [8, 21], [8, 21], [8, 21], [8, 21], [8, 21], [10, 19]];
const branchHours: Hours = [null, [9, 17], [9, 17], [9, 17], [9, 17], [9, 17], null];
const flexibleCampusHours: Hours = [[9, 23], [7, 24], [7, 24], [7, 24], [7, 24], [7, 24], [9, 24]];

const spaces: Space[] = [
  {
    id: "firestone-discovery", name: "Discovery Hub", building: "Firestone Library", zone: "Central", kind: "Library",
    lat: 40.3495, lng: -74.6575, walkFromFrist: 4, noise: "Collaborative", groupMax: 12, groupLabel: "Best for 4–12",
    access: "TigerCard after visitor hours", reservable: false, features: ["Group tables", "Outlets", "Conversation", "Tiger Tea Room"],
    firstYearTip: "Enter through the courtyard beside the Chapel. Unlike most Firestone rooms, conversation is welcome here.",
    hours: libraryHours, hoursLabel: "Library hours vary by term", officialUrl: "https://library.princeton.edu/services/firestone-library", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "firestone-group", name: "Group Study Rooms", building: "Firestone Library", zone: "Central", kind: "Library",
    lat: 40.3497, lng: -74.6576, walkFromFrist: 4, noise: "Collaborative", groupMax: 10, groupLabel: "Rooms for 1–4 or 5–10",
    access: "Reservation recommended", reservable: true, features: ["Whiteboard walls", "Monitors", "Accessible options", "Doors"],
    firstYearTip: "Six rooms are on the first floor. Two larger rooms are on the Elfers mezzanine; those two are not wheelchair accessible.",
    hours: libraryHours, hoursLabel: "Open during Firestone hours", officialUrl: "https://library.princeton.edu/visit-and-spaces/spaces/firestone-study-rooms", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "firestone-tower", name: "Tower Reading Rooms", building: "Firestone Library", zone: "Central", kind: "Library",
    lat: 40.3497, lng: -74.6572, walkFromFrist: 5, noise: "Conversation", groupMax: 6, groupLabel: "Comfortable for 2–6",
    access: "Walk-in", reservable: false, features: ["Conversation allowed", "Tables", "Outlets", "Upper floors"],
    firstYearTip: "A useful Firestone fallback when silent reading rooms feel intimidating. Follow signs for the tower rooms.",
    hours: libraryHours, hoursLabel: "Open during Firestone hours", officialUrl: "https://library.princeton.edu/services/firestone-library", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "firestone-thomas", name: "Thomas-Graham Reading Room", building: "Firestone Library", zone: "Central", kind: "Library",
    lat: 40.3494, lng: -74.6578, walkFromFrist: 5, noise: "Quiet", groupMax: 4, groupLabel: "Best for solo–4",
    access: "Walk-in", reservable: false, features: ["Natural light", "Quiet", "Large tables", "Accessible"],
    firstYearTip: "Good for studying alongside friends, but keep conversation to a minimum. Use the Discovery Hub for active group work.",
    hours: libraryHours, hoursLabel: "Open during Firestone hours", officialUrl: "https://library.princeton.edu/services/firestone-library", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "lewis-commons", name: "Lewis Library Commons", building: "Lewis Science Library", zone: "East", kind: "Library",
    lat: 40.3468, lng: -74.6511, walkFromFrist: 8, noise: "Conversation", groupMax: 8, groupLabel: "Best for 2–8",
    access: "TigerCard when exterior doors lock", reservable: false, features: ["Group tables", "Outlets", "Natural light", "Science neighborhood"],
    firstYearTip: "The colorful Frank Gehry building can be confusing: enter from Washington Road and use the central stair or elevator.",
    hours: branchHours, hoursLabel: "Check today’s branch hours", officialUrl: "https://library.princeton.edu/services/lewis-science-library", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "engineering", name: "Engineering Library", building: "Fine Hall Wing", zone: "East", kind: "Library",
    lat: 40.3461, lng: -74.6518, walkFromFrist: 8, noise: "Quiet", groupMax: 5, groupLabel: "Best for 1–5",
    access: "Walk-in during building hours", reservable: false, features: ["Desks", "Outlets", "Quieter fallback", "Near Lewis"],
    firstYearTip: "A less obvious alternative beside Lewis. It is especially convenient after classes in the science neighborhood.",
    hours: libraryHours, hoursLabel: "Check live library hours", officialUrl: "https://library.princeton.edu/visit-and-spaces/locations", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "stokes-rooms", name: "Stokes Group Study Rooms", building: "Wallace Hall, Lower Level", zone: "South", kind: "Library",
    lat: 40.3473, lng: -74.6559, walkFromFrist: 6, noise: "Collaborative", groupMax: 10, groupLabel: "Rooms for 4–6 or up to 10",
    access: "Reservation recommended", reservable: true, features: ["Two group rooms", "Doors", "Whiteboards", "SPIA neighborhood"],
    firstYearTip: "Wallace Hall sits beside Robertson. Go to the lower level; room 067 is the larger option for groups up to 10.",
    hours: branchHours, hoursLabel: "Open during Stokes hours", officialUrl: "https://library.princeton.edu/visit-and-spaces/spaces/stokes-group-study-rooms", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "east-asian", name: "East Asian Reading Room", building: "Frist Campus Center, 3rd Floor", zone: "Central", kind: "Library",
    lat: 40.3469, lng: -74.6553, walkFromFrist: 1, noise: "Quiet", groupMax: 4, groupLabel: "Best for solo–4",
    access: "Walk-in during library hours", reservable: false, features: ["Quiet", "Central", "Reading tables", "Hidden gem"],
    firstYearTip: "You are already in Frist—take the stairs or elevator to the third floor. Many first-years do not realize a library is upstairs.",
    hours: branchHours, hoursLabel: "Check today’s branch hours", officialUrl: "https://library.princeton.edu/services/east-asian-library", officialSource: "Princeton Library", verified: "Aug 1, 2026",
  },
  {
    id: "frist-commons", name: "Frist Commons", building: "Frist Campus Center", zone: "Central", kind: "Campus commons",
    lat: 40.3469, lng: -74.6553, walkFromFrist: 0, noise: "Collaborative", groupMax: 14, groupLabel: "Flexible for 2–14",
    access: "Open campus commons", reservable: false, features: ["Food nearby", "Large tables", "Central", "Conversation"],
    firstYearTip: "The easiest first meetup spot. Use it when your group is still gathering, then move to a quieter room if needed.",
    hours: flexibleCampusHours, hoursLabel: "Campus-center access varies", officialUrl: "https://odus.princeton.edu/centers-spaces/frist-campus-center", officialSource: "Princeton ODUS", verified: "Aug 1, 2026",
  },
  {
    id: "campus-club", name: "Campus Club Commons", building: "Campus Club", zone: "East", kind: "Campus commons",
    lat: 40.3480, lng: -74.6517, walkFromFrist: 7, noise: "Collaborative", groupMax: 12, groupLabel: "Flexible for 2–12",
    access: "Student commons; events may limit space", reservable: false, features: ["Couches", "Group tables", "Conversation", "Coffee events"],
    firstYearTip: "Campus Club is a student space, not an eating club. It is a relaxed choice for project meetings and casual studying.",
    hours: flexibleCampusHours, hoursLabel: "Building access varies", officialUrl: "https://odus.princeton.edu/centers-spaces/campus-club", officialSource: "Princeton ODUS", verified: "Aug 1, 2026",
  },
  {
    id: "fields-center", name: "Fields Center Common Spaces", building: "Carl A. Fields Center", zone: "South", kind: "Campus commons",
    lat: 40.3445, lng: -74.6571, walkFromFrist: 7, noise: "Conversation", groupMax: 10, groupLabel: "Best for 2–10",
    access: "Community programming may take priority", reservable: false, features: ["Welcoming commons", "Meeting areas", "Conversation", "Community resources"],
    firstYearTip: "A welcoming place to learn about cultural and affinity resources. Check the event schedule before bringing a large group.",
    hours: flexibleCampusHours, hoursLabel: "Program hours vary", officialUrl: "https://fieldscenter.princeton.edu/", officialSource: "Princeton University", verified: "Aug 1, 2026",
  },
  {
    id: "ppl", name: "Princeton Public Library", building: "65 Witherspoon Street", zone: "Downtown", kind: "Library",
    lat: 40.3519, lng: -74.6604, walkFromFrist: 11, noise: "Conversation", groupMax: 8, groupLabel: "Rooms and tables for 1–8",
    access: "Public; card required to reserve rooms", reservable: true, features: ["Reservable rooms", "Wi‑Fi", "Café", "Downtown"],
    firstYearTip: "No TigerCard needed to enter. This is the best off-campus fallback; bring a library card if you want to reserve a room.",
    hours: [[12, 18], [9, 21], [9, 21], [9, 21], [9, 21], [9, 18], [9, 18]], hoursLabel: "Typical library schedule; verify today", officialUrl: "https://princetonlibrary.org/hours/", officialSource: "Princeton Public Library", verified: "Aug 1, 2026",
  },
  {
    id: "small-world", name: "Small World Coffee", building: "14 Witherspoon Street", zone: "Downtown", kind: "Café",
    lat: 40.3503, lng: -74.6600, walkFromFrist: 9, noise: "Conversation", groupMax: 6, groupLabel: "Best for 1–6",
    access: "Purchase expected; seating not guaranteed", reservable: false, features: ["Ample seating", "Coffee", "Wi‑Fi", "Lively"],
    firstYearTip: "A Princeton favorite and often crowded. Better for conversation and writing than silent work; avoid occupying a large table at peak times.",
    hours: [[7, 19], [7, 19], [7, 19], [7, 19], [7, 19], [7, 20], [7, 20]], hoursLabel: "Typical café schedule; verify today", officialUrl: "https://smallworldcoffee.com/pages/witherspoon-cafe", officialSource: "Small World Coffee", verified: "Aug 1, 2026",
  },
  {
    id: "library-cafe", name: "Library Café", building: "Princeton Public Library Lobby", zone: "Downtown", kind: "Café",
    lat: 40.3519, lng: -74.6604, walkFromFrist: 11, noise: "Conversation", groupMax: 5, groupLabel: "Best for 1–5",
    access: "Public; purchase optional", reservable: false, features: ["Coffee", "Library seating", "Conversation", "Public access"],
    firstYearTip: "The café closes earlier than the library. You can take drinks into much of the building and continue studying after the café closes.",
    hours: [null, [7, 13], [7, 13], [7, 13], [7, 13], [7, 13], [7, 13]], hoursLabel: "Café hours; library remains open later", officialUrl: "https://princetonpl.org/cafe/", officialSource: "Princeton Public Library", verified: "Aug 1, 2026",
  },
];

const statusCopy = {
  plenty: { label: "Plenty of space", className: "green" },
  some: { label: "Some space", className: "amber" },
  full: { label: "Reported full", className: "red" },
};

function scheduleState(space: Space, now: Date) {
  const slot = space.hours[now.getDay()];
  if (!slot || !Array.isArray(slot) || slot.length !== 2) return { open: false, label: "Hours unavailable", className: "neutral" };
  const current = now.getHours() + now.getMinutes() / 60;
  const [start, end] = slot;
  if (current >= start && current < end) return { open: true, label: `Open · until ${end > 12 ? end - 12 : end}${end >= 12 ? "pm" : "am"}`, className: "green" };
  if (current < start) return { open: false, label: `Closed · opens ${start > 12 ? start - 12 : start}${start >= 12 ? "pm" : "am"}`, className: "neutral" };
  return { open: false, label: "Closed for today", className: "neutral" };
}

function activeReportFor(spaceId: string, reports: Report[], now: Date) {
  return reports.filter((report) => report.spaceId === spaceId && report.expiresAt > now.getTime()).sort((a, b) => b.createdAt - a.createdAt)[0];
}

function minutesAgo(timestamp: number, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - timestamp) / 60000));
}

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [query, setQuery] = useState("");
  const [groupSize, setGroupSize] = useState(4);
  const [zone, setZone] = useState<"All" | Zone>("All");
  const [noise, setNoise] = useState<"All" | Noise>("All");
  const [kind, setKind] = useState<"All" | Kind>("All");
  const [openOnly, setOpenOnly] = useState(false);
  const [firstYearMode, setFirstYearMode] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Space | null>(null);
  const [modal, setModal] = useState<"detail" | "report" | "karma" | "login" | null>(null);
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [loginError, setLoginError] = useState("");
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Walking times from Frist");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    const storedFavorites = window.localStorage.getItem("hoagiespaces:favorites");
    const storedReports = window.localStorage.getItem("hoagiespaces:reports");
    const storedAccount = window.localStorage.getItem("hoagiespaces:account");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedReports) setReports((JSON.parse(storedReports) as Report[]).filter((report) => report.expiresAt > Date.now()));
    if (storedAccount) setAccount(JSON.parse(storedAccount));
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => { window.localStorage.setItem("hoagiespaces:favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { window.localStorage.setItem("hoagiespaces:reports", JSON.stringify(reports)); }, [reports]);
  useEffect(() => {
    if (account) window.localStorage.setItem("hoagiespaces:account", JSON.stringify(account));
    else window.localStorage.removeItem("hoagiespaces:account");
  }, [account]);

  function distanceMinutes(space: Space) {
    if (!origin) return space.walkFromFrist;
    const latMiles = (space.lat - origin.lat) * 69;
    const lngMiles = (space.lng - origin.lng) * 53;
    return Math.max(1, Math.round(Math.sqrt(latMiles ** 2 + lngMiles ** 2) * 20));
  }

  function useLocation() {
    if (!navigator.geolocation) { setLocationMessage("Location is unavailable"); return; }
    setLocationMessage("Locating you…");
    navigator.geolocation.getCurrentPosition(
      (position) => { setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude }); setLocationMessage("Walking times from you"); },
      () => setLocationMessage("Location denied · using Frist"),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return spaces
      .filter((space) => space.groupMax >= groupSize)
      .filter((space) => zone === "All" || space.zone === zone)
      .filter((space) => noise === "All" || space.noise === noise)
      .filter((space) => kind === "All" || space.kind === kind)
      .filter((space) => !openOnly || scheduleState(space, now).open)
      .filter((space) => !normalized || [space.name, space.building, space.zone, space.kind, ...space.features].join(" ").toLowerCase().includes(normalized))
      .sort((a, b) => {
        const aReport = activeReportFor(a.id, reports, now);
        const bReport = activeReportFor(b.id, reports, now);
        const availabilityScore = (report?: Report) => report?.status === "plenty" ? 3 : report?.status === "some" ? 2 : report?.status === "full" ? -3 : 0;
        const firstYearScore = (space: Space) => firstYearMode && space.zone === "Central" ? 1 : 0;
        return (availabilityScore(bReport) + firstYearScore(b) - distanceMinutes(b) / 20) - (availabilityScore(aReport) + firstYearScore(a) - distanceMinutes(a) / 20);
      });
  }, [query, groupSize, zone, noise, kind, openOnly, firstYearMode, reports, now, origin]);

  function openDetail(space: Space) { setSelected(space); setModal("detail"); }
  function openReport(space?: Space) { setSelected(space ?? spaces[0]); setModal("report"); }
  function closeModal() { setModal(null); }

  function signInDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const netid = String(new FormData(event.currentTarget).get("netid") ?? "").trim().toLowerCase().replace(/@princeton\.edu$/, "");
    if (!/^[a-z0-9]{2,8}$/.test(netid)) {
      setLoginError("Enter a 2–8 character Princeton NetID.");
      return;
    }
    setAccount({ netid, karma: 10 });
    setLoginError("");
    setModal(null);
  }

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const spaceId = String(form.get("spaceId"));
    const timestamp = Date.now();
    const report: Report = {
      id: crypto.randomUUID(), spaceId, status: String(form.get("status")) as Report["status"],
      seats: Number(form.get("seats")), note: String(form.get("note") ?? "").slice(0, 80),
      createdAt: timestamp, expiresAt: timestamp + 20 * 60 * 1000,
      reporter: account?.netid,
    };
    setReports((current) => [report, ...current.filter((item) => item.spaceId !== spaceId)]);
    if (account) setAccount({ ...account, karma: account.karma + 5 });
    setModal(null);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">H</span><span>hoagie<span className="brand-light">spaces</span></span></a>
        <nav aria-label="Primary"><a className="nav-active" href="#finder">Find a spot</a><a href="#first-year">First-year guide</a><button className="nav-link" onClick={() => setModal("karma")}>Tiger Karma</button><a href="#sources">Data sources</a></nav>
        <div className="profile">
          {account ? <button className="account-chip" onClick={() => setModal("karma")}><span>{account.netid.slice(0, 1).toUpperCase()}</span><b>{account.netid}</b><small>{account.karma} karma</small></button> : <button className="netid-button" onClick={() => setModal("login")}>Sign in with NetID</button>}
          <button className="report-nav" onClick={() => openReport()}>＋ Report availability</button>
        </div>
      </header>

      <section className="finder-hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> {spaces.length} researched Princeton study spots</div>
          <h1>Find a place your<br /><em>whole group</em> can use.</h1>
          <p>Campus and downtown spaces, explained for first-years. Filter by group size, noise, walking time, official hours, and fresh community reports.</p>
          <div className="freshness"><strong>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</strong><span>Schedule status updates automatically · Community reports expire after 20 minutes</span></div>
        </div>
        <div className="first-year-panel" id="first-year">
          <div className="mode-line"><span>FIRST-YEAR MODE</span><button className={`switch ${firstYearMode ? "on" : ""}`} onClick={() => setFirstYearMode((value) => !value)} aria-pressed={firstYearMode}><i /></button></div>
          <h2>{firstYearMode ? "No campus knowledge required." : "Standard discovery mode."}</h2>
          <p>{firstYearMode ? "We prioritize central, easy-to-enter spaces and explain how to find each room, whether you can talk, and what access you need." : "Results are ranked by availability reports, group fit, and walking time."}</p>
          <button className="location-button" onClick={useLocation}>⌖ {locationMessage}</button>
        </div>
      </section>

      <section className="finder" id="finder">
        <div className="search-shell">
          <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search whiteboards, Firestone, café…" /></label>
          <label className="group-picker"><span>GROUP SIZE</span><div><button onClick={() => setGroupSize(Math.max(1, groupSize - 1))} aria-label="Decrease group size">−</button><strong>{groupSize === 12 ? "12+" : groupSize}</strong><button onClick={() => setGroupSize(Math.min(12, groupSize + 1))} aria-label="Increase group size">＋</button></div></label>
          <button className={`open-toggle ${openOnly ? "selected" : ""}`} onClick={() => setOpenOnly((value) => !value)}><span className="availability-dot green" /> Open now</button>
        </div>

        <div className="filter-bar">
          <div><span>Area</span>{(["All", "Central", "East", "South", "Downtown"] as const).map((value) => <button className={zone === value ? "active" : ""} onClick={() => setZone(value)} key={value}>{value}</button>)}</div>
          <div><span>Type</span>{(["All", "Library", "Campus commons", "Café"] as const).map((value) => <button className={kind === value ? "active" : ""} onClick={() => setKind(value)} key={value}>{value}</button>)}</div>
          <select aria-label="Noise filter" value={noise} onChange={(event) => setNoise(event.target.value as typeof noise)}><option>All</option><option>Silent</option><option>Quiet</option><option>Conversation</option><option>Collaborative</option></select>
        </div>

        <div className="results-heading"><div><span className="section-kicker">BEST MATCHES</span><h2>{results.length} spots fit a group of {groupSize}{groupSize === 12 ? "+" : ""}</h2></div><p>Ranked by group fit, fresh reports, walking time, and first-year ease.</p></div>

        {results.length ? <div className="results-grid">
          {results.map((space) => {
            const report = activeReportFor(space.id, reports, now);
            const schedule = scheduleState(space, now);
            return <article className="result-card" key={space.id}>
              <div className="result-top">
                <div className="badge-row"><span className={`status-pill ${schedule.className}`}><span />{schedule.label}</span>{report && <span className={`status-pill ${statusCopy[report.status].className}`}><span />Live: {statusCopy[report.status].label}</span>}</div>
                <button className={`save ${favorites.includes(space.id) ? "saved" : ""}`} onClick={() => setFavorites((items) => items.includes(space.id) ? items.filter((id) => id !== space.id) : [...items, space.id])} aria-label={`Save ${space.name}`}>{favorites.includes(space.id) ? "★" : "☆"}</button>
              </div>
              <div className="result-title"><div><span>{space.kind} · {space.zone}</span><h3>{space.name}</h3><p>{space.building}</p></div><div className="walk"><strong>{distanceMinutes(space)}</strong><small>min walk</small></div></div>
              <div className="fit-row"><div><small>GROUP FIT</small><strong>{space.groupLabel}</strong></div><div><small>NOISE</small><strong>{space.noise}</strong></div></div>
              {report ? <div className="live-report"><span className="pulse" /><strong>{report.seats} seats reported</strong><span>{minutesAgo(report.createdAt, now)}m ago{report.note ? ` · “${report.note}”` : ""}</span></div> : <button className="empty-report" onClick={() => openReport(space)}>No fresh report · add one ＋</button>}
              <div className="tag-row large">{space.features.slice(0, 4).map((feature) => <span key={feature}>{feature}</span>)}</div>
              {firstYearMode && <div className="first-year-tip"><b>’30 TIP</b><p>{space.firstYearTip}</p></div>}
              <div className="source-row"><span>Official details checked {space.verified}</span><a href={space.officialUrl} target="_blank" rel="noreferrer">{space.officialSource} ↗</a></div>
              <div className="card-actions"><button onClick={() => openDetail(space)}>Details</button><a className="directions" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${space.lat},${space.lng}&travelmode=walking`}>Walking directions →</a></div>
            </article>;
          })}
        </div> : <div className="no-results"><strong>No exact match yet.</strong><p>Try a smaller group, select “All” areas, or turn off “Open now.”</p><button onClick={() => { setZone("All"); setKind("All"); setNoise("All"); setOpenOnly(false); }}>Reset filters</button></div>}
      </section>

      <section className="data-section" id="sources">
        <div><span className="section-kicker light">HONEST LIVE DATA</span><h2>Useful now. Clear about uncertainty.</h2><p>HoagieSpaces combines researched space attributes with schedule-based open status and optional 20-minute community reports. It does not claim access to occupancy sensors or guarantee a seat.</p></div>
        <ul><li><b>Official</b><span>Hours, room features, group limits, reservation and accessibility notes link to the source.</span></li><li><b>Live on your device</b><span>Current time, “open now,” location-based walking estimates, saved spots, and expiring reports.</span></li><li><b>Still needed</b><span>A campus deployment would add shared NetID reports and official room-booking integrations.</span></li></ul>
      </section>

      <section className="karma-section" id="karma">
        <div><span className="section-kicker">TIGER KARMA</span><h2>Campus help, recognized.</h2><p>Tiger Karma is HoagieSpaces’ proposed trust and contribution score—not money, dining points, or an official University program. Helpful community actions earn recognition while keeping study-space reports useful.</p></div>
        <div className="karma-steps"><article><b>+5</b><span>Fresh availability report</span></article><article><b>+3</b><span>Confirm another report</span></article><article><b>+10</b><span>Accepted hours or access correction</span></article></div>
        <button className="secondary" onClick={() => setModal("karma")}>How trust and privacy work →</button>
      </section>

      <footer><div className="footer-brand"><span className="brand-mark small">H</span><strong>hoagie<span>spaces</span></strong></div><p>Built for Princeton first-years · Not an official University service</p><div className="source-links"><a href="https://library.princeton.edu/visit-and-spaces/locations" target="_blank" rel="noreferrer">Live library directory ↗</a><a href="https://princetonlibrary.org/hours/" target="_blank" rel="noreferrer">Public Library hours ↗</a></div></footer>

      {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={closeModal}>×</button>
        {modal === "login" ? <form onSubmit={signInDemo}><span className="section-kicker">PRINCETON COMMUNITY</span><h2 id="modal-title">Continue with your NetID</h2><p className="modal-intro">This public MVP never asks for your Princeton password. Entering a NetID creates a device-local prototype profile; it is <strong>not University-verified yet</strong>.</p><label>Princeton NetID<div className="netid-input"><input name="netid" autoCapitalize="none" autoComplete="username" placeholder="abc123" autoFocus /><span>@princeton.edu</span></div></label>{loginError && <p className="form-error">{loginError}</p>}<button className="primary wide" type="submit">Continue to prototype →</button><div className="cas-note"><b>Production authentication</b><span>HoagieSpaces is ready to connect to Princeton CAS. CAS sends students through Princeton’s sign-in and Duo flow, then the server validates a one-time ticket. OIT or TigerApps must approve and configure the production service URL.</span><a href="https://www.cs.princeton.edu/~cmoretti/cos333/CAS/" target="_blank" rel="noreferrer">Read Princeton’s CAS guidance ↗</a></div></form>
        : modal === "karma" ? <div className="detail-modal"><span className="section-kicker">TIGER KARMA</span><h2 id="modal-title">A reputation signal for helpful Tigers.</h2><p className="modal-intro">The score rewards timely, accurate contributions. It has no cash value and should never affect access to campus spaces.</p><div className="detail-grid"><div><small>Report a space</small><strong>+5 karma</strong></div><div><small>Confirm a report</small><strong>+3 karma</strong></div><div><small>Accepted correction</small><strong>+10 karma</strong></div><div><small>Expired / disputed</small><strong>No penalty by default</strong></div></div><div className="policy-note"><strong>Trust design:</strong> reports expire after 20 minutes; repeated false reports can be rate-limited; precise movement history is never shown; only a NetID-verified account could publish to a shared production feed.</div>{account ? <div className="signed-summary"><span>{account.netid}@princeton.edu</span><strong>{account.karma} Tiger Karma</strong><button onClick={() => { setAccount(null); setModal(null); }}>Sign out of prototype</button></div> : <button className="primary" onClick={() => setModal("login")}>Create prototype profile →</button>}</div>
        : modal === "report" && selected ? <form onSubmit={submitReport}><span className="section-kicker">20-MINUTE REPORT</span><h2 id="modal-title">What do you see?</h2><p className="modal-intro">This report stays on this device and expires automatically.{account ? " You’ll earn 5 prototype Tiger Karma." : " Sign in to attach a prototype NetID and earn karma."}</p><label>Space<select name="spaceId" defaultValue={selected.id}>{spaces.map((space) => <option value={space.id} key={space.id}>{space.name} · {space.building}</option>)}</select></label><div className="form-row"><label>Availability<select name="status" defaultValue="some"><option value="plenty">Plenty of space</option><option value="some">Some space</option><option value="full">Looks full</option></select></label><label>Open seats<input name="seats" type="number" min="0" max="100" defaultValue="4" /></label></div><label>Optional note<input name="note" maxLength={80} placeholder="e.g. two tables near the windows" /></label><button className="primary wide" type="submit">Publish expiring report →</button></form>
        : selected && <div className="detail-modal"><span className="section-kicker">{selected.kind} · {selected.zone}</span><h2 id="modal-title">{selected.name}</h2><p className="modal-intro">{selected.building} · approximately {distanceMinutes(selected)} minutes away</p><div className="detail-grid"><div><small>Group fit</small><strong>{selected.groupLabel}</strong></div><div><small>Noise</small><strong>{selected.noise}</strong></div><div><small>Access</small><strong>{selected.access}</strong></div><div><small>Reservation</small><strong>{selected.reservable ? "Available / recommended" : "Walk-in"}</strong></div></div><div className="tag-row large">{selected.features.map((feature) => <span key={feature}>{feature}</span>)}</div><div className="policy-note"><strong>First-year directions:</strong> {selected.firstYearTip}</div><div className="modal-actions"><a className="primary" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}&travelmode=walking`}>Open walking directions →</a><a className="secondary" href={selected.officialUrl} target="_blank" rel="noreferrer">Verify official details ↗</a></div></div>}
      </section></div>}
    </main>
  );
}
