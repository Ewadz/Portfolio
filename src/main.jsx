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
import { profile, projects, certifications, achievements, skills } from "./data";
import "./style.css";
const nav = [
  ["home", "Home", Home],
  ["about", "About", User],
  ["projects", "Projects", FolderOpen],
  ["skills", "Skills", Layers],
  ["certifications", "Certifications", Award],
  ["achievements", "Achievements", Award],
  ["contact", "Contact", Mail],
];
// ECHO is a local portfolio assistant. Its answers are grounded in portfolio
// data and a public-safe summary of the CV; it is not a generative AI model.
const resumeKnowledge = {
  education: [
    "Bachelor of Science in Computer Science, specializing in Software Engineering, at Manuel S. Enverga University Foundation (2023–2027)",
    "Mobile App and Web Development at STI College Lucena (2020–2022)",
  ],
  technical: {
    "Programming and development": "Foundational Python, JavaScript, HTML and CSS; web, mobile and desktop development; SQL and database fundamentals; manual software testing",
    "IT support": "Basic hardware and software troubleshooting, Windows installation and configuration, driver troubleshooting, maintenance and diagnostics",
    "Networking": "IP addressing, network devices, connectivity troubleshooting and basic network configuration",
    "Cybersecurity": "Fundamental security concepts, common threats and vulnerabilities, online safety, network security and data protection",
  },
  softSkills: ["Problem-solving", "Willingness to learn", "Teamwork and collaboration", "Time management", "Attention to detail", "Adaptability"],
  cvProjects: {
    MacroID: "Participated in desktop application development using Python and PyQt6, including application design, database integration and debugging.",
    WhatsForDinner: "Worked on an introductory iOS application using Swift and Xcode, with API integration and Firebase.",
  },
  cvCertifications: ["Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)", "Introduction to Cybersecurity — Cisco Networking Academy", "Google Cybersecurity Professional Certificate — Coursera"],
};

const echoStopWords = new Set(["the", "and", "for", "with", "what", "which", "where", "when", "about", "does", "have", "tell", "show", "your", "eduard", "please", "more", "details", "can", "you", "his", "her", "this", "that", "are", "was", "from", "latest", "newest", "recent", "project", "projects", "certification", "certifications", "certificate", "certificates", "skill", "skills", "course", "courses"]);
const echoTokens = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9+#]+/g, " ").split(/\s+/).filter(w => w.length > 2 && !echoStopWords.has(w));
const echoScore = (query, values) => {
  const wanted = new Set(echoTokens(query));
  return [...new Set(values.flatMap(echoTokens))].reduce((sum, w) => sum + (wanted.has(w) ? 1 : 0), 0);
};
const echoList = (items) => items.length === 1 ? items[0] : items.slice(0, -1).join(", ") + " and " + items[items.length - 1];

// Interpret explicit navigation requests separately from information questions.
// Section names are matched only after detecting a navigation action.
function echoNavigationTarget(input) {
  const q = String(input || "").toLowerCase().trim();
  const navigation = /\b(scroll|navigate|jump|take me|bring me|go to|move (me )?to|head to|open|visit|direct me|show me|bring up)\b/.test(q);
  if (!navigation) return null;
  if (/\b(all|full|entire)\s+(certifications?|certificates?|credentials?)\b|\b(certifications?|credentials?)\s+page\b/.test(q)) return { page: "certifications", label: "all certifications" };
  if (/\b(all|full|entire)\s+projects?\b|\bprojects?\s+page\b/.test(q)) return { page: "projects", label: "all projects" };
  if (/\b(all|full|entire)\s+achievements?\b|\bachievements?\s+page\b/.test(q)) return { page: "achievements", label: "all achievements" };
  const targets = [
    { id: "certifications", label: "certifications", re: /\b(certifications?|certificates?|credentials?|badges?)\b/ },
    { id: "achievements", label: "achievements", re: /\b(achievements?|awards?|honors?|recognition)\b/ },
    { id: "projects", label: "projects", re: /\b(projects?|portfolio work)\b/ },
    { id: "skills", label: "skills", re: /\b(skills?|toolbox|tech stack|technologies|frameworks?)\b/ },
    { id: "about", label: "about", re: /\b(about|bio|biography|background|education)\b/ },
    { id: "contact", label: "contact", re: /\b(contact|email|reach out|hire)\b/ },
    { id: "home", label: "home", re: /\b(home|homepage|top|beginning|start)\b/ },
  ];
  return targets.find(target => target.re.test(q)) || null;
}

// Recognize natural requests for a complete guided portfolio tour.
function echoWantsTour(input) {
  const q = String(input || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  return /\b(tour|walkthrough|walk through|show me around|guide me|guided tour)\b/.test(q) ||
    /\b(explore|introduce|show)\b.*\b(portfolio|website|site|everything)\b/.test(q) ||
    /\b(portfolio|website|site)\b.*\b(explore|tour)\b/.test(q);
}

function echoTourStops() {
  return [
    { id: "home", title: "Welcome / Home", description: `Welcome to ${profile.name}'s portfolio! This is the introduction, where you'll see his background, main interests, and a quick overview of his work.` },
    { id: "about", title: "About", description: `${profile.name} is a Computer Science student specializing in Software Engineering. This section introduces his interests in software development, networking, and cybersecurity, and includes a link to his CV.` },
    { id: "projects", title: "Projects", description: `Here are ${projects.length} projects featured in the portfolio: ${projects.map(p => p.name).join(", ")}. You can select any project to see its details and technologies.` },
    { id: "skills", title: "Skills & Interests", description: `This section shows his growing technical toolbox, including ${skills.map(s => s.title).join(", ")}. These are skills he has practiced or is still learning.` },
    { id: "certifications", title: "Certifications", description: `Here you'll find his certifications and completed learning programs. There are ${certifications.length} listed, and you can open the full certifications page to explore them.` },
    { id: "achievements", title: "Achievements", description: `This section is for awards, recognition, competitions, and milestones. There are ${achievements.length} achievements currently listed.` },
    { id: "contact", title: "Contact", description: `Finally, this is where you can get in touch with Eduard for internships, opportunities, or collaborations using the contact links.` },
  ];
}

function answer(q) {
  const question = String(q || "").toLowerCase().trim();
  const has = (pattern) => pattern.test(question);
  const newest = has(/\b(latest|newest|most recent|recent|last|current)\b/);
  const count = has(/\b(how many|number of|total|count)\b/);
  const all = has(/\b(all|list|every|what are|which are|show|overview)\b/);
  const projectIntent = has(/\b(projects?|apps?|applications?|built|build|developed|portfolio work)\b/);
  const certIntent = has(/\b(certifications?|certificates?|credentials?|badges?|courses?|coursera|issued|sc-900)\b/);
  const achievementIntent = has(/\b(achievements?|awards?|honors?|recognition|milestones?)\b/);
  const skillIntent = has(/\b(skills?|technologies|technology|tools?|frameworks?|programming|languages?|tech stack|interests?)\b/);
  const bullets = (items) => items.map(item => `• ${item}`).join("\n");
  const section = (title, items, ending = "") => `${title}\n\n${bullets(items)}${ending ? `\n\n${ending}` : ""}`;
  const scope = "Sorry, I can only help with questions about Eduard's portfolio, projects, skills, education, certifications, achievements, CV, and professional background. You can also ask me to navigate to a section.";

  if (!question) return "Hi! I'm ECHO, Eduard's portfolio assistant. Ask about his projects, skills, education, certifications, or achievements—or ask me to take you to a section.";
  if (/^(hi|hello|hey|hiya|howdy|greetings|good\s*morning|good\s*afternoon|good\s*evening|good\s*day|goodday|what'?s\s*up|whats\s*up|wassup)(\s+echo)?[!?.\s]*$/i.test(q.trim()) ||/^(echo[\s,]+)(hi|hello|hey|good\s*day|goodday|what'?s\s*up|whats\s*up)[!?.\s]*$/i.test(q.trim())) {
    return "Hello! 👋 I'm ECHO, Eduard's portfolio assistant. How are you today? How can I help you explore his work?";}
  if (/^(how are you|how r u|how's it going|how are things|are you okay)(\s+echo)?[!?.\s]*$/i.test(q.trim())) {
    return "I'm doing great, thanks for asking! 😊 I'm ready to help you explore Eduard's portfolio. What would you like to know?";}
  if (has(/\b(thanks|thank you|thankyou|appreciate it)\b/))
    return "You're very welcome! 😊 Is there anything else you'd like to know about Eduard's portfolio?";
  if (has(/\b(who are you|what are you|are you ai|what can you do|help me|your name)\b/))
    return section("I'm ECHO — Eduard's portfolio assistant.", ["Answer questions about projects, skills, certifications, achievements, and education", "Share professional background and public contact details", "Navigate to sections when you ask me to scroll or go somewhere"], "I'm a portfolio-focused assistant, not a general-purpose AI chatbot.");
  if (achievementIntent) {
    if (!achievements.length) return "There are no achievements listed yet. This section is ready for awards, recognition, competitions, and milestones to be added.";
    if (count) return `Eduard currently lists ${achievements.length} achievements.`;
    return section(`Eduard's Achievements (${achievements.length})`, achievements.map(a => `${a.title} — ${a.organization}${a.date ? ` (${a.date})` : ""}${a.description ? `: ${a.description}` : ""}`));
  }
  if (has(/\b(weather|forecast|temperature|sports?|football|basketball|stocks?|crypto|bitcoin|politics|election|president|joke|riddle|recipe for|cook|movie|celebrity|song|lyrics|capital of|math problem|solve this|homework)\b/)) return scope;

  if (has(/\b(address|phone|mobile number|telephone|where does he live|home location)\b/))
    return `For professional inquiries, you can contact Eduard at ${profile.email}. I don't share private contact details.`;
  if (has(/\b(resume|curriculum vitae|\bcv\b)\b/)) {
    if (has(/\b(download|open|view|link|where|find)\b/) || question === "resume" || question === "cv")
      return `You can view Eduard's CV here: ${profile.resume}\n\nI can also summarize his education, skills, academic projects, and certifications.`;
    return section("Eduard's CV — Overview", ["Education: BS Computer Science, Software Engineering specialization", "Technical skills: Foundational programming, networking, cybersecurity, and IT troubleshooting", "Academic projects: MacroID and WhatsForDinner", "Certifications: Microsoft SC-900, Cisco Introduction to Cybersecurity, and Google Cybersecurity Professional Certificate"], `CV: ${profile.resume}`);
  }
  if (has(/\b(contact|email|reach|hire|internship|intern|linkedin|github|available|availability)\b/)) {
    if (has(/\bgithub\b/)) return `GitHub\n${profile.github}`;
    if (has(/\blinkedin\b/)) return `LinkedIn\n${profile.linkedin}`;
    if (has(/\b(internship|intern|available|availability)\b/)) return section("Internship & Opportunities", [`Status: ${profile.availability}`, `Email: ${profile.email}`], "Please contact Eduard directly to confirm his current availability.");
    return section("Contact Eduard", [`Email: ${profile.email}`, `GitHub: ${profile.github}`, `LinkedIn: ${profile.linkedin}`]);
  }
  if (has(/\b(education|school|college|university|graduat|degree|studied|study|academic background|qualification)\b/))
    return section("Eduard's Education", resumeKnowledge.education);
  if (has(/\b(soft skills|teamwork|communication|adaptability|time management|strengths|personal skills)\b/))
    return section("Soft Skills", resumeKnowledge.softSkills);
  if (has(/\b(troubleshoot|troubleshooting|it support|hardware|drivers?|windows|maintenance)\b/))
    return section("IT Support & Troubleshooting", resumeKnowledge.technical["IT support"].split(/,\s*/));
  if (has(/\b(networking|ip address|network devices|connectivity)\b/) && !certIntent)
    return section("Networking — Foundational Knowledge", resumeKnowledge.technical.Networking.split(/,\s*/));
  if (has(/\b(cybersecurity|cyber threats|vulnerabilities|network security|data protection)\b/) && !certIntent && !projectIntent)
    return section("Cybersecurity — Foundational Knowledge", resumeKnowledge.technical.Cybersecurity.split(/,\s*/), "You can also ask about his cybersecurity certifications.");

  const namedProjects = projects.map(p => ({ p, score: echoScore(question, [p.name, p.id]) }))
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  if (namedProjects.length && !certIntent && !has(/\b(compare|difference between)\b/)) {
    const p = namedProjects[0].p;
    return section(p.name, [`Type: ${p.type}`, `Overview: ${p.description}`, ...(p.details ? [`Details: ${p.details}`] : []), `Technologies: ${(p.stack || []).join(", ")}`]);
  }
  if (projectIntent) {
    if (!projects.length) return "There are no projects listed yet.";
    if (count) return `Eduard currently lists ${projects.length} projects in his portfolio.`;
    if (newest) {
      const p = projects[0];
      return section("First Project in the Portfolio", [`Name: ${p.name}`, `Type: ${p.type}`, `About: ${p.description}`, `Technologies: ${(p.stack || []).join(", ")}`], "Projects are listed newest-first, but completion dates aren't provided, so I can't independently confirm which was finished most recently.");
    }
    return section(`Eduard's Projects (${projects.length})`, projects.map(p => `${p.name} — ${p.type}`), "Ask about a specific project to learn more.");
  }

  const namedCerts = certifications.map(c => ({ c, score: echoScore(question, [c.name, c.issuer]) }))
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  const certCategory = [...new Set(certifications.map(c => c.category).filter(Boolean))]
    .find(category => echoScore(question, [category]) > 0 && has(/\b(certif|credential|course|badge|certificate)\w*\b/));
  if (certIntent || namedCerts.length || certCategory) {
    if (count && !certCategory) return `Eduard currently lists ${certifications.length} certifications and completed learning programs.`;
    if (certCategory) {
      const group = certifications.filter(c => c.category === certCategory);
      return section(`${certCategory} (${group.length})`, group.map(c => `${c.name} — ${c.issuer}${c.issued ? ` (${c.issued})` : ""}`));
    }
    if (newest && certifications.length) {
      const sorted = certifications.filter(c => c.issued && !Number.isNaN(Date.parse(c.issued))).slice().sort((a, b) => Date.parse(b.issued) - Date.parse(a.issued));
      if (sorted.length) {
        const c = sorted[0];
        return section("Most Recently Issued Certification", [`Name: ${c.name}`, `Issuer: ${c.issuer}`, `Issued: ${c.issued}`, ...(c.url ? [`Verify: ${c.url}`] : [])]);
      }
      return "The portfolio doesn't include enough issue-date information to identify the newest certification.";
    }
    if (namedCerts.length && !all && !count) {
      const c = namedCerts[0].c;
      return section(c.name, [`Issuer: ${c.issuer}`, ...(c.issued ? [`Issued: ${c.issued}`] : []), ...(c.detail ? [`About: ${c.detail}`] : []), ...(c.url ? [`Verify: ${c.url}`] : [])]);
    }
    const categories = [...new Set(certifications.map(c => c.category || "Other"))];
    return `Eduard's Certifications (${certifications.length})\n\n${categories.map(category => {
      const group = certifications.filter(c => (c.category || "Other") === category);
      return `${category}\n${bullets(group.map(c => `${c.name} — ${c.issuer}${c.issued ? ` (${c.issued})` : ""}`))}`;
    }).join("\n\n")}`;
  }
  if (skillIntent) {
    const groups = skills.filter(group => echoScore(question, [group.title, ...group.items]) > 0);
    return (groups.length ? groups : skills).map(group => `${group.title}\n${bullets(group.items)}`).join("\n\n") + "\n\nThese are areas Eduard has used or is continuing to learn; they don't imply advanced proficiency.";
  }
  if (has(/\b(who|about|background|student|specializ|introduc|describe|profile)\b/))
    return section(profile.name, [`Field: ${profile.title}`, `About: ${profile.intro}`, `Status: ${profile.availability}`]);
  return scope;
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
  return path === "/projects" ? "projects" : path === "/certifications" ? "certifications" : path === "/achievements" ? "achievements" : "home";
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
        text: "Hey! I’m ECHO. Want to explore Eduard’s projects, skills, certifications, or achievements?",
      },
    ]),
    [active, setActive] = useState("home"),
    [detail, setDetail] = useState(null),
    [termInput, setTermInput] = useState(""),
    [history, setHistory] = useState(["Type help to see available commands."]);
  const [page, setPage] = useState(currentPage);
  const bottom = useRef(null);
  const messagesRef = useRef(null);
  const tourTimers = useRef([]);
  const tourActive = useRef(false);
  const [tourRunning, setTourRunning] = useState(false);

  function clearTourTimers() {
    tourTimers.current.forEach(window.clearTimeout);
    tourTimers.current = [];
  }
  function stopTour(announce = true) {
    const wasRunning = tourActive.current;
    tourActive.current = false;
    clearTourTimers();
    setTourRunning(false);
    if (announce && wasRunning) {
      setChat(c => [...c, { who: "echo", text: "Tour stopped. You can explore on your own, ask me about a section, or request another tour anytime." }]);
    }
  }
  function scrollTourTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function startTour() {
    stopTour(false);
    tourActive.current = true;
    setTourRunning(true);
    setEcho(true);
    setChat(c => [...c, { who: "echo", text: "Welcome! I'll guide you through the portfolio one section at a time. You can stop the tour whenever you like." }]);
    if (page !== "home") {
      openPage("home");
    }
    const stops = echoTourStops();
    stops.forEach((stop, index) => {
      const timer = window.setTimeout(() => {
        if (!tourActive.current) return;
        scrollTourTo(stop.id);
        setChat(c => [...c, { who: "echo", text: `STOP ${index + 1} OF ${stops.length} — ${stop.title}\n\n${stop.description}` }]);
      }, 450 + index * 6500);
      tourTimers.current.push(timer);
    });
    tourTimers.current.push(window.setTimeout(() => {
      if (!tourActive.current) return;
      tourActive.current = false;
      setTourRunning(false);
      setChat(c => [...c, { who: "echo", text: "That's the end of our tour! Feel free to explore any section or ask me about Eduard's work." }]);
    }, 450 + stops.length * 6500));
  }
  useEffect(() => () => {
    tourActive.current = false;
    clearTourTimers();
  }, []);
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
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
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
    setQuery("");
    setEcho(true);
    if (echoWantsTour(text)) {
      setChat(c => [...c, { who: "user", text }]);
      startTour();
      return;
    }
    if (/\b(stop|cancel|end|pause)\b.*\b(tour|guide)\b|^(stop|cancel)\s*$/i.test(text)) {
      setChat(c => [...c, { who: "user", text }]);
      if (tourActive.current) stopTour(true);
      else setChat(c => [...c, { who: "echo", text: "There isn't a tour running. Ask me to tour the portfolio whenever you're ready." }]);
      return;
    }
    if (tourActive.current) stopTour(false);
    const destination = echoNavigationTarget(text);
    const response = destination
      ? `Sure! Taking you to ${destination.label}.`
      : answer(text);
    setChat((c) => [
      ...c,
      { who: "user", text },
      { who: "echo", text: response },
    ]);
    if (destination) {
      // Let React update the page before scrolling. Works from subpages too.
      if (destination.page) {
        openPage(destination.page);
      } else {
        go(destination.id);
      }
    }
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
          <button onClick={() => setMobile(true)} 
              aria-label="Open navigation menu">
        <Menu />
          </button>
          <b>Eduard.dev</b>
          <span className="mobilebar-spacer" aria-hidden="true" />
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
                      <b>{String(projects.length).padStart(2, "0")}</b>
                      <small>Projects</small>
                    </div>
                    <div>
                      <b>{String(certifications.length).padStart(2, "0")}</b>
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
                    <div className="cert-card" key={c.name}>
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
                        <div className="cert-actions">
                          <span className="cert-tag">Issued {c.issued}</span>

                          {c.url && (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-link"
                            >
                              View credential <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="small-note">
                  A collection of credentials earned through continuous learning and professional development.
                </p>
              </section>
              <section id="achievements" className="section">
                <div className="section-top">
                  <div>
                    <div className="section-label">// 05 — RECOGNITION</div>
                    <h2>Achievements<span className="dot">.</span></h2>
                  </div>
                  <button className="view-all-link" onClick={() => openPage("achievements")}>
                    VIEW ALL ACHIEVEMENTS <ArrowUpRight size={16} />
                  </button>
                </div>
                {achievements.filter((a) => a.featured !== false).length ? (
                  <div className="achievement-grid">
                    {achievements.filter((a) => a.featured !== false).slice(0, 2).map((a) => (
                      <article className="achievement-card" key={a.id || a.title}>
                        {a.image ? <div className="achievement-image"><img src={a.image} alt={a.title} loading="lazy" /></div> : <div className="achievement-symbol"><Award size={30} /></div>}
                        <div className="achievement-info">
                          <div className="project-meta">{a.organization}</div>
                          <h3>{a.title}</h3>
                          {a.description && <p>{a.description}</p>}
                          <div className="achievement-actions">
                            {a.date && <span className="cert-tag">{a.date}</span>}
                            {a.url && <a className="text-link" href={a.url} target="_blank" rel="noopener noreferrer">View achievement <ExternalLink size={14} /></a>}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="section-intro">Awards, recognition, competitions, and milestones will appear here as they are added.</p>
                )}
                <p className="small-note">A collection of milestones and accomplishments throughout my academic and professional journey.</p>
              </section>
              <section id="contact" className="section contact">
                <div className="section-label">// 06 — CONTACT</div>
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
                <button className="collection-back" onClick={() => go("projects")}><ArrowLeft size={17} /> BACK</button>
                <div className="section-label">// WORK / ALL PROJECTS</div>
                <h1>All projects<span className="dot">.</span></h1>
                <p className="collection-intro">Student projects and applications I've worked on, from desktop systems to web and mobile apps.</p>
                <div className="all-project-grid">
                  {projects.map((p, i) => (
                    <button className="project-card" key={p.id} onClick={() => setDetail(p)}>
                      <div className="project-image"><img src={p.image} alt={p.name + " project screenshot"} loading="lazy" /><span className="project-open"><ArrowUpRight size={18} /></span></div>
                      <div className="project-info"><div className="project-meta">{String(i + 1).padStart(2, "0")} / {p.type}</div><h3>{p.name}</h3><p>{p.description}</p><div className="tags">{p.stack.map(t => <span key={t}>{t}</span>)}</div></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : page === "certifications" ? (
              <div className="collection-page">
                <button className="collection-back" onClick={() => go("certifications")}><ArrowLeft size={17} /> BACK </button>
                <div className="section-label">// LEARNING / ALL CERTIFICATIONS</div>
                <h1>Certifications<span className="dot">.</span></h1>
                <p className="collection-intro">Credentials and completed learning programs, grouped by field. Select Verify to view the original credential.</p>
                {[...new Set(certifications.map(c => c.category || "Other Certifications"))].map(category => (
                  <section className="credential-group" key={category}>
                    <div className="credential-group-title"><span>{category.toUpperCase()}</span><span>{String(certifications.filter(c => (c.category || "Other Certifications") === category).length).padStart(2, "0")}</span></div>
                    <div className="credential-grid">
                      {certifications.filter(c => (c.category || "Other Certifications") === category).map(c => (
                        <article className="credential-card" key={c.name}>
                          <div className="credential-icon"><img src={c.image} alt={c.issuer + " badge"} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} /></div>
                          <h3>{c.name}</h3><span className="credential-issuer">{c.issuer}</span><p>{c.detail}</p>
                          {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="credential-verify">VERIFY <ArrowUpRight size={13} /></a> : <span className="credential-issuer">Verification link not added</span>}
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="collection-page">
                <button className="collection-back" onClick={() => go("achievements")}><ArrowLeft size={17} /> BACK</button>
                <div className="section-label">// RECOGNITION / ALL ACHIEVEMENTS</div>
                <h1>Achievements<span className="dot">.</span></h1>
                <p className="collection-intro">Awards, recognition, competitions, and milestones from my academic and professional journey.</p>
                {achievements.length ? (
                  <>
                    <div className="credential-group-title achievement-group-title">
                      <span>ACHIEVEMENTS</span>
                      <span>{String(achievements.length).padStart(2, "0")}</span>
                    </div>
                    <div className="credential-grid achievement-credential-grid">
                      {achievements.map((a) => (
                        <article className="credential-card achievement-credential-card" key={a.id || a.title}>
                          <div className="credential-icon achievement-credential-icon">
                            {a.image ? <img src={a.image} alt={a.title} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} /> : <Award size={28} />}
                          </div>
                          <h3>{a.title}</h3>
                          <span className="credential-issuer">{a.organization}</span>
                          {a.description && <p>{a.description}</p>}
                          {a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer" className="credential-verify">Verify<ArrowUpRight size={13} /></a> : <span className="credential-issuer">Details link not added</span>}
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="achievement-empty">
                    <Award size={34} />
                    <h2>No achievements added yet<span className="dot">.</span></h2>
                    <p>This page is ready for awards, recognition, competitions, and milestones. Add your entries to the achievements array in <code>src/data.js</code>.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <button
        className="echo-launch"
        onClick={() => setEcho((v) => !v)}
        aria-label="Open ECHO portfolio guide"
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
              <small>Portfolio knowledge assistant</small>
            </div>
            <button onClick={() => setEcho(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="echo-messages" ref={messagesRef}>
            {chat.map((m, i) => (
              <div key={i} className={"message " + m.who} style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {m.text}
              </div>
            ))}
            <div ref={bottom} />
          </div>
          <div className="suggestions">
            {tourRunning ? (
              <button type="button" onClick={() => stopTour(true)}>Stop tour</button>
            ) : (
              <button type="button" onClick={() => send("Tour me through the portfolio")}>Take a tour</button>
            )}
            {["Show projects", "What are your skills?", "Certifications", "Achievements"].map(
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
            ECHO guides you through the portfolio using its current content.
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
