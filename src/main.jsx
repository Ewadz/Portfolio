import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  User,
  FolderOpen,
  Layers,
  Award,
  Mail,
  Menu,
  X,
  ArrowUpRight,
  Download,
  Terminal,
  Sun,
  Moon,
  Send,
  Sparkles,
  Code2,
  ChevronRight,
  ExternalLink,
  Shield,
  Network,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Wrench,
  CheckCircle2,
  Cpu,
  Globe,
  Database,
  GitBranch,
  Smartphone,
  TestTube2,
  LockKeyhole,
} from "lucide-react";
import { profile, projects, certifications, skills } from "./data";
import "./style.css";
const nav = [
  ["home", "Home", Home],
  ["about", "About", User],
  ["projects", "Projects", FolderOpen],
  ["skills", "Skills", Layers],
  ["certifications", "Certifications", Award],
  ["contact", "Contact", Mail],
];
function answer(q) {
  let t = q.toLowerCase();
  if (/hello|hi|hey|welcome/.test(t))
    return "Hello! I’m ECHO, Eduard’s portfolio guide. Ask me about his projects, skills, or certifications.";
  if (/macro|river|invertebrate/.test(t))
    return (
      projects[0].description +
      " Technologies: " +
      projects[0].stack.join(", ") +
      "."
    );
  if (/sweet|bakery/.test(t))
    return (
      projects[1].description +
      " Built with " +
      projects[1].stack.join(", ") +
      "."
    );
  if (/tahanan|manila|rental/.test(t)) return projects[2].description;
  if (/dinner|recipe|swift/.test(t)) return projects[3].description;
  if (/seafood|buyer/.test(t)) return projects[4].description;
  if (/project|work|build/.test(t))
    return (
      "Eduard has five featured student projects: " +
      projects.map((p) => p.name).join(", ") +
      ". Select any project card to read more."
    );
  if (/certif|badge|cisco|microsoft|sc-900/.test(t))
    return "His credentials include Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900) and Cisco Networking Academy’s Introduction to Cybersecurity.";
  if (/skill|tech|language|stack/.test(t))
    return "His foundational tools and interests include Python, JavaScript, React, Flutter, Swift, PyQt6, networking, cybersecurity, and software testing.";
  if (/contact|email|hire|intern/.test(t))
    return "Use the Contact section to reach Eduard. Contact links can be added in src/data.js.";
  if (/who|about|eduard/.test(t))
    return "Eduard is a Computer Science student specializing in Software Engineering, interested in practical software development, networking, and cybersecurity.";
  return "I can help with Eduard’s projects, technologies, certifications, background, and contact information. Try asking “What is MacroID?” or “What certifications does he have?”";
}
function Wave() {
  const ref = useRef(null);
  useEffect(() => {
    let c = ref.current,
      ctx = c.getContext("2d"),
      raf,
      w,
      h,
      frame = 0;
    const resize = () => {
      w = c.width = innerWidth * devicePixelRatio;
      h = c.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    addEventListener("resize", resize);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function draw() {
      let W = innerWidth,
        H = innerHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(70,70,70,.18)";
      for (let row = 0; row < 13; row++)
        for (let col = 0; col < 60; col++) {
          let x = col * 29 - 40,
            y =
              H * 0.72 +
              row * 13 +
              Math.sin(col * 0.18 + frame * 0.012 + row * 0.22) * 12;
          ctx.beginPath();
          ctx.arc(x, y, 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      if (!reduce) frame++;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="wave" aria-hidden="true" />;
}
function currentPage() {
  const path = window.location.pathname.replace(/\/$/, "");
  return path === "/projects" ? "projects" : path === "/certifications" ? "certifications" : "home";
}

function App() {
  const [dark, setDark] = useState(true),
    [mobile, setMobile] = useState(false),
    [echo, setEcho] = useState(false),
    [terminal, setTerminal] = useState(false),
    [projectIndex, setProjectIndex] = useState(0),
    [query, setQuery] = useState(""),
    [chat, setChat] = useState([
      {
        who: "echo",
        text: "Hey! I’m ECHO. Want to explore Eduard’s projects, skills, or certifications?",
      },
    ]),
    [active, setActive] = useState("home"),
    [detail, setDetail] = useState(null),
    [termInput, setTermInput] = useState(""),
    [history, setHistory] = useState(["Type help to see available commands."]);
  const [page, setPage] = useState(currentPage);
  const bottom = useRef(null);
  useEffect(() => {
    const onPopState = () => setPage(currentPage());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  function openPage(next) {
    window.history.pushState({}, "", next === "home" ? "/" : `/${next}`);
    setPage(next);
    setMobile(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    let fn = (e) => {
      if (e.key === "Escape") {
        setEcho(false);
        setDetail(null);
        setTerminal(false);
      }
    };
    addEventListener("keydown", fn);
    return () => removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, echo]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    if (page === "home") document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [page]);
  function go(id) {
    if (page !== "home") {
      openPage("home");
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 40);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobile(false);
  }
  function send(v) {
    const text = (v ?? query).trim();
    if (!text) return;
    setChat((c) => [
      ...c,
      { who: "user", text },
      { who: "echo", text: answer(text) },
    ]);
    setQuery("");
    setEcho(true);
  }
  function runTerm() {
    let v = termInput.trim().toLowerCase();
    if (!v) return;
    setHistory((h) => [
      ...h,
      "visitor@eduard-os:~$ " + v,
      ...(v === "help"
        ? ["Commands: about, projects, skills, certifications, contact, clear"]
        : v === "clear"
          ? []
          : nav.some((n) => n[0] === v)
            ? ["Navigating to " + v + "..."]
            : ["Unknown command. Type help."]),
    ]);
    if (v === "clear") setHistory([]);
    else if (nav.some((n) => n[0] === v)) go(v);
    setTermInput("");
  }
  return (
    <>
      <Wave />
      <div className="app">
        <aside className={"sidebar " + (mobile ? "open" : "")}>
          <div className="brand">
            <Code2 size={25} />
            <span>
              Eduard<span className="muted">.dev</span>
            </span>
            <button className="closemobile" onClick={() => setMobile(false)}>
              <X />
            </button>
          </div>
          <div className="availability">
            <span className="statusdot" />
            {profile.availability}
          </div>
          <nav>
            {nav.map(([id, label, Icon]) => (
              <button
                key={id}
                className={(page !== "home" ? page === id : active === id) ? "selected" : ""}
                onClick={() => go(id)}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-note">
              <span className="eyebrow">// CURRENT FOCUS</span>
              <strong>Building useful software.</strong>
              <p>Learning, experimenting, improving.</p>
            </div>
            <button className="sidebar-action" onClick={() => setEcho(true)}>
              <Sparkles size={17} /> Ask ECHO <span>↗</span>
            </button>
            <div className="theme-row">
              <button
                onClick={() => setDark(false)}
                aria-label="Light mode"
                className={!dark ? "on" : ""}
              >
                <Sun size={17} />
              </button>
              <button
                onClick={() => setDark(true)}
                aria-label="Dark mode"
                className={dark ? "on" : ""}
              >
                <Moon size={17} />
              </button>
              <button
                onClick={() => setTerminal(true)}
                aria-label="Developer terminal"
              >
                <Terminal size={17} />
              </button>
            </div>
            <small>© 2026 Eduard A. Matubaran</small>
          </div>
        </aside>
        <main>
          <header className="mobilebar">
            <button onClick={() => setMobile(true)}>
              <Menu />
            </button>
            <b>Eduard.dev</b>
            <button onClick={() => setEcho(true)}>
              <Sparkles />
            </button>
          </header>
          <div className="main-inner">
            {page === "home" ? (<>
            <section id="home" className="hero">           
          <div className="hero-portrait">
            <div className="portrait-frame portrait-hover">
              <img
                src="/profile-default.png"
                alt="Eduard portrait"
                className="portrait-default"
              />
              <img
                src="/profile-hover.png"
                alt=""
                className="portrait-second"
              />
            </div>

            <span className="decor deco1">+</span>
            <span className="decor deco2">_</span>
            <span className="decor deco3">+</span>
            <span className="portrait-caption">01 / HELLO WORLD</span>
          </div>

              <div className="hero-copy">
                <div className="eyebrow">
                  SOFTWARE ENGINEERING / COMPUTER SCIENCE
                </div>
                <h1>
                  Eduard A.
                  <br />
                  <span>
                    Matubaran<span className="cursor">|</span>
                  </span>
                </h1>
                <p className="intro">{profile.intro}</p>
                <div className="pills">
                  <span>
                    <Code2 size={15} /> Development
                  </span>
                  <span>
                    <Network size={15} /> Networking
                  </span>
                  <span>
                    <Shield size={15} /> Cybersecurity
                  </span>
                </div>
                <div className="stats">
                  <div>
                    <b>05</b>
                    <small>Projects</small>
                  </div>
                  <div>
                    <b>02</b>
                    <small>Credentials</small>
                  </div>
                  <div>
                    <b>∞</b>
                    <small>Curiosity</small>
                  </div>
                </div>
                <div className="hero-actions">
                  <button className="primary" onClick={() => go("projects")}>
                    Explore my work <ArrowUpRight size={18} />
                  </button>
                  <button className="outline" onClick={() => setEcho(true)}>
                    <Sparkles size={17} /> Meet ECHO
                  </button>
                </div>
              </div>
            </section>
            <section id="about" className="section about">
              <div className="section-label">// 01 — ABOUT</div>
              <div className="about-grid">
                <h2>
                  Curious by nature.
                  <br />
                  <span>Building by practice.</span>
                </h2>
                <div>
                  <p>
                    I'm a Computer Science student specializing in Software
                    Engineering. I enjoy turning ideas into useful software and
                    learning through real projects.
                  </p>
                  <p>
                    My interests include application development, networking,
                    cybersecurity, and improving the way people interact with
                    technology.
                  </p>
                  <button className="text-link" onClick={() => go("contact")}>
                    Let's connect <ArrowUpRight size={17} />
                  </button>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-btn"
                  >
                  View CV <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </section>
            <section id="projects" className="section">
              <div className="section-top">
                <div>
                  <div className="section-label">// 02 — SELECTED WORK</div>
                  <h2>
                    Things I've built<span className="dot">.</span>
                  </h2>
                </div>
                <button className="view-all-link" onClick={() => openPage("projects")}>
                  VIEW ALL PROJECTS <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="project-carousel-toolbar">
                <span className="carousel-hint">
                  DRAG OR USE ARROWS TO EXPLORE{" "}
                  <span aria-hidden="true">↔</span>
                </span>
                <div className="carousel-controls">
                  <button
                    aria-label="Previous projects"
                    disabled={projectIndex === 0}
                    onClick={() => setProjectIndex((v) => Math.max(0, v - 1))}
                  >
                    <ArrowLeft size={19} />
                  </button>
                  <span>
                    {String(projectIndex + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <button
                    aria-label="Next projects"
                    disabled={projectIndex >= projects.length - 1}
                    onClick={() =>
                      setProjectIndex((v) =>
                        Math.min(projects.length - 1, v + 1),
                      )
                    }
                  >
                    <ArrowRight size={19} />
                  </button>
                </div>
              </div>
              <div
                className="project-viewport"
                onTouchStart={(e) => {
                  e.currentTarget.dataset.startX = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const delta =
                    Number(e.currentTarget.dataset.startX) -
                    e.changedTouches[0].clientX;
                  if (Math.abs(delta) > 45)
                    setProjectIndex((v) =>
                      Math.max(
                        0,
                        Math.min(projects.length - 1, v + (delta > 0 ? 1 : -1)),
                      ),
                    );
                }}
              >
                <div
                  className="project-track"
                  style={{
                    transform: `translateX(calc(-${projectIndex} * (var(--project-width) + 20px)))`,
                  }}
                >
                  {projects.map((p, i) => (
                    <button
                      className="project-card"
                      key={p.id}
                      onClick={() => setDetail(p)}
                    >
                      <div className="project-image">
                        <img
                          src={p.image}
                          alt={p.name + " project screenshot"}
                        />
                        <span className="project-open">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                      <div className="project-info">
                        <div className="project-meta">
                          {String(i + 1).padStart(2, "0")} / {p.type}
                        </div>
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <div className="tags">
                          {p.stack.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="project-dots" aria-label="Select project">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    aria-label={"Go to " + p.name}
                    aria-current={projectIndex === i ? "true" : undefined}
                    className={projectIndex === i ? "current" : ""}
                    onClick={() => setProjectIndex(i)}
                  />
                ))}
              </div>
            </section>
            <section id="skills" className="section">
              <div className="section-label">// 03 — TOOLBOX</div>
              <h2>
                Skills & interests<span className="dot">.</span>
              </h2>
              <p className="section-intro">
                Tools I've used and areas I'm continuing to explore.
              </p>
              <div className="skill-grid">
                {skills.map((s, i) => (
                  <div className="skill-card" key={s.title}>
                    <span className="skill-num">0{i + 1}</span>
                    <div className="skill-heading">
                      <span className="skill-heading-icon">
                        {i === 0 ? (
                          <Code2 size={21} />
                        ) : i === 1 ? (
                          <Wrench size={21} />
                        ) : (
                          <Cpu size={21} />
                        )}
                      </span>
                      <h3>{s.title}</h3>
                    </div>
                    <div className="skill-items">
                      {s.items.map((x) => (
                        <span className="skill-chip" key={x}>
                          <span className="skill-chip-mark">
                            {{
                              Python: "Py",
                              Java: "Jv",
                              JavaScript: "JS",
                              React: "⚛",
                              Swift: "Sw",
                              Flutter: "Fl",
                              Dart: "Da",
                              Git: "Gt",
                              GitHub: "GH",
                              Vite: "V",
                              PyQt6: "Qt",
                              FastAPI: "API",
                              Firebase: "Fb",
                              Networking: "◎",
                              Cybersecurity: "◇",
                              "Software Testing": "✓",
                              "UI / UX": "UI",
                              "Software Engineering": "SE",
                            }[x] || "•"}
                          </span>
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="skills-footnote">
                <CheckCircle2 size={16} /> A growing toolbox — practical
                experience, fundamentals, and subjects I am exploring.
              </p>
            </section>
            <section id="certifications" className="section">
              <div className="section-top">
                <div>
                  <div className="section-label">// 04 — LEARNING</div>
                  <h2>Certifications<span className="dot">.</span></h2>
                </div>
                <button className="view-all-link" onClick={() => openPage("certifications")}>
                  VIEW ALL CERTIFICATIONS <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="cert-grid">
                {certifications.filter((c) => c.featured).map((c, i) => (
                  <div className="cert-card" key={c.short}>
                    <div className="cert-symbol">
                      <img
                        src={c.image}
                        alt={c.issuer + " badge"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                      <span
                        className="cert-fallback"
                        style={{ display: "none" }}
                      >
                        {i === 0 ? <Shield size={32} /> : <Network size={32} />}
                      </span>
                    </div>
                    <div>
                      <div className="project-meta">{c.issuer}</div>
                      <h3>{c.name}</h3>
                      <p>{c.detail}</p>
                      <span className="cert-tag">{c.short}</span>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-link"
                        >
                          View credential <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="small-note">
                A collection of credentials earned through continuous learning and professional development.
              </p>
            </section>
            <section id="contact" className="section contact">
              <div className="section-label">// 05 — CONTACT</div>
              <h2>
                Have something
                <br />
                in mind<span className="dot">?</span>
              </h2>
              <p>
                I'm always interested in learning opportunities, projects, and
                conversations about technology.
              </p>
              <div className="contact-actions">
                {profile.email ? (
                  <a className="primary" href={"mailto:" + profile.email}>
                    Send an email <ArrowUpRight size={17} />
                  </a>
                ) : (
                  <span className="placeholder-contact">
                    Add your email in src/data.js to enable direct contact.
                  </span>
                )}
                {profile.github && (
                  <a
                    className="outline"
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ArrowUpRight size={17} />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    className="outline"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn <ArrowUpRight size={17} />
                  </a>
                )}
              </div>
            </section>
            <footer>
              <span>EDUARD.PORTFOLIO / BUILT WITH CURIOSITY</span>
              <button onClick={() => go("home")}>BACK TO TOP ↑</button>
            </footer>
            </>) : page === "projects" ? (
              <div className="collection-page">
                <button className="collection-back" onClick={() => go("projects")}><ArrowLeft size={17}/> BACK</button>
                <div className="section-label">// WORK / ALL PROJECTS</div>
                <h1>All projects<span className="dot">.</span></h1>
                <p className="collection-intro">Student projects and applications I've worked on, from desktop systems to web and mobile apps.</p>
                <div className="all-project-grid">
                  {projects.map((p, i) => (
                    <button className="project-card" key={p.id} onClick={() => setDetail(p)}>
                      <div className="project-image"><img src={p.image} alt={p.name + " project screenshot"} loading="lazy"/><span className="project-open"><ArrowUpRight size={18}/></span></div>
                      <div className="project-info"><div className="project-meta">{String(i + 1).padStart(2,"0")} / {p.type}</div><h3>{p.name}</h3><p>{p.description}</p><div className="tags">{p.stack.map(t => <span key={t}>{t}</span>)}</div></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="collection-page">
                <button className="collection-back" onClick={() => go("certifications")}><ArrowLeft size={17}/> BACK </button>
                <div className="section-label">// LEARNING / ALL CERTIFICATIONS</div>
                <h1>Certifications<span className="dot">.</span></h1>
                <p className="collection-intro">Credentials and completed learning programs, grouped by field. Select Verify to view the original credential.</p>
                {[...new Set(certifications.map(c => c.category || "Other Certifications"))].map(category => (
                  <section className="credential-group" key={category}>
                    <div className="credential-group-title"><span>{category.toUpperCase()}</span><span>{String(certifications.filter(c => (c.category || "Other Certifications") === category).length).padStart(2,"0")}</span></div>
                    <div className="credential-grid">
                      {certifications.filter(c => (c.category || "Other Certifications") === category).map(c => (
                        <article className="credential-card" key={c.short}>
                          <div className="credential-icon"><img src={c.image} alt={c.issuer + " badge"} loading="lazy" onError={e => {e.currentTarget.style.display="none";}} /></div>
                          <h3>{c.name}</h3><span className="credential-issuer">{c.issuer}</span><p>{c.detail}</p>
                          {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="credential-verify">VERIFY <ArrowUpRight size={13}/></a> : <span className="credential-issuer">Verification link not added</span>}
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <button
        className="echo-launch"
        onClick={() => setEcho((v) => !v)}
        aria-label="Open ECHO AI guide"
      >
        <span className="echo-orb" />
        <span>
          ECHO <small>YOUR PORTFOLIO GUIDE</small>
        </span>
      </button>
      {echo && (
        <div
          className="echo-panel"
          role="dialog"
          aria-label="ECHO portfolio assistant"
        >
          <div className="echo-header">
            <span className="echo-orb" />
            <div>
              <b>ECHO</b>
              <small>Portfolio knowledge assistant · Online</small>
            </div>
            <button onClick={() => setEcho(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="echo-messages">
            {chat.map((m, i) => (
              <div key={i} className={"message " + m.who}>
                {m.text}
              </div>
            ))}
            <div ref={bottom} />
          </div>
          <div className="suggestions">
            {["Show projects", "What are your skills?", "Certifications"].map(
              (q) => (
                <button key={q} onClick={() => send(q)}>
                  {q}
                </button>
              ),
            )}
          </div>
          <form
            className="echo-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about Eduard..."
              aria-label="Ask ECHO"
            />
            <button aria-label="Send">
              <Send size={17} />
            </button>
          </form>
          <small className="echo-disclaimer">
            ECHO uses local, curated answers. No external AI service.
          </small>
        </div>
      )}
      {detail && (
        <div className="overlay" onClick={() => setDetail(null)}>
          <div
            className="modal"
            role="dialog"
            aria-label={detail.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setDetail(null)}>
              <X />
            </button>
            <img src={detail.image} alt="Conceptual project preview" />
            <div className="modal-content">
              <span className="section-label">{detail.type}</span>
              <h2>{detail.name}</h2>
              <p>{detail.details}</p>
              <div className="tags">
                {detail.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {terminal && (
        <div className="overlay" onClick={() => setTerminal(false)}>
          <div className="terminal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terminal-title">
              <span>● ● ●</span> developer terminal{" "}
              <button onClick={() => setTerminal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="terminal-history">
              {history.map((h, i) => (
                <div key={i}>{h}</div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runTerm();
              }}
            >
              <span>visitor@eduard-os:~$</span>
              <input
                autoFocus
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                aria-label="Terminal command"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
