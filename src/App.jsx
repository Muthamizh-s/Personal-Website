import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import avatarImg from './assets/avatar.png';
import {
  Brain, Code, Globe, Server, Cloud, Cpu,
  Rocket, Mail, Send, FileText, MapPin,
  CircleDot, ChevronUp, ArrowRight, Star,
  ExternalLink, GraduationCap, Award, Trophy,
  BookOpen, Lightbulb, Zap, Terminal,
  Menu, X, Download,
  Monitor, Database, GitBranch, Container,
  Sparkles, Target, Users, Building2,
  Calendar, CheckCircle2, Play, Coffee
} from 'lucide-react';

/* Brand icons (removed from Lucide, custom SVGs) */
function Github({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

function Linkedin({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

// ──────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

const SKILLS = [
  {
    category: 'Programming',
    Icon: Terminal,
    color: 'cyan',
    dotColor: '#00d4ff',
    items: ['Python', 'JavaScript', 'PHP'],
  },
  {
    category: 'Frontend',
    Icon: Monitor,
    color: 'purple',
    dotColor: '#a855f7',
    items: ['HTML5', 'CSS3', 'React Native'],
  },
  {
    category: 'Backend & Database',
    Icon: Database,
    color: 'pink',
    dotColor: '#f472b6',
    items: ['MySQL', 'MongoDB'],
  },
  {
    category: 'Tools & Platforms',
    Icon: Cloud,
    color: 'green',
    dotColor: '#10b981',
    items: ['AWS', 'Docker', 'Git', 'GitHub'],
  },
  {
    category: 'AI & Advanced Tech',
    Icon: Brain,
    color: 'orange',
    dotColor: '#fb923c',
    items: ['LLMs', 'RAG', 'LangChain', 'LangGraph', 'AI APIs'],
  },
];

const EXPERIENCES = [
  {
    title: 'Software Developer & Tech Coach',
    company: 'Technology Garage',
    location: 'Trichy',
    period: 'May 2025 – Present',
    current: true,
    achievements: [
      'Train and mentor students in Python, Web Development, and AI technologies.',
      'Conduct hands-on sessions focused on real-world project building.',
      'Develop AI-based applications using LLMs and RAG architecture.',
      'Work with LangChain and LangGraph for intelligent workflows.',
      'Guide students in building scalable, production-ready applications.',
      'Contribute to internal tools and automation systems.',
    ],
  },
  {
    title: 'Frontend Web Developer Intern',
    company: 'Ozone Cyber Security',
    location: '',
    period: 'May 2024 – Jun 2024',
    current: false,
    achievements: [
      'Built a To-Do List application for internal team use.',
      'Improved team productivity through effective task tracking features.',
      'Collaborated with the backend team using Python for logic integration.',
      'Applied rigorous testing and debugging for stable performance.',
    ],
  },
];

const PROJECTS = [
  {
    Icon: Globe,
    title: 'Department Website',
    desc: 'Designed and maintained a full department website focused on performance, accessibility, and visual clarity. Led the development as Technical Lead, coordinating the team through multiple iterations.',
    tags: ['HTML', 'CSS', 'Bootstrap'],
    tagColor: 'cyan',
    featured: false,
  },
  {
    Icon: Play,
    title: 'WebRTC Local Video Call App',
    desc: 'Developed a real-time peer-to-peer video communication application using WebRTC. Focused on low latency, smooth signaling, and reliable connection management.',
    tags: ['WebRTC', 'JavaScript', 'Node.js'],
    tagColor: 'purple',
    featured: false,
  },
  {
    Icon: Brain,
    title: 'AI-Based Systems',
    desc: 'Building LLM-powered applications with RAG pipelines for smarter, context-aware responses. Exploring multi-agent orchestration using LangGraph for complex reasoning tasks.',
    tags: ['Python', 'LangChain', 'LangGraph', 'AI APIs'],
    tagColor: 'pink',
    featured: true,
  },
];

const TAG_COLORS = {
  cyan: 'tag-cyan',
  purple: 'tag-purple',
  pink: 'tag-pink',
  green: 'tag-green',
};

// ──────────────────────────────────────────────
// HOOKS
// ──────────────────────────────────────────────
function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* Typing animation hook */
function useTyping(strings, typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = strings[index];
    let timeout;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % strings.length);
    } else {
      timeout = setTimeout(
        () => {
          setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
        },
        isDeleting ? deleteSpeed : typeSpeed
      );
    }
    return () => clearTimeout(timeout);
  }, [text, index, isDeleting, strings, typeSpeed, deleteSpeed, pauseTime]);

  return text;
}

/* Animated counter hook */
function useCounter(end, duration = 2000, trigger = true) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => frameRef.current && cancelAnimationFrame(frameRef.current);
  }, [end, duration, trigger]);

  return count;
}

/* Tilt card hook – follows mouse for 3D parallax */
function useTilt(intensity = 10) {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02,1.02,1.02)`;
  }, [intensity]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  }, []);

  return { ref, handleMove, handleLeave };
}

// ──────────────────────────────────────────────
// INTERACTIVE COMPONENTS
// ──────────────────────────────────────────────

/* ─── Floating Particles ─── */
function Particles({ count = 30 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 190 : 270, // cyan or purple
    }));

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      particlesRef.current.forEach((p) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse interaction – gentle push away
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(200, 100%, 65%, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ─── Mouse Glow Follower ─── */
function MouseGlow() {
  const glowRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <div ref={glowRef} className="mouse-glow" />;
}

/* ─── Tilt Card wrapper ─── */
function TiltCard({ children, className = '', style, intensity = 8 }) {
  const { ref, handleMove, handleLeave } = useTilt(intensity);
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: 'transform 0.2s ease' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ─── Magnetic button ─── */
function MagneticBtn({ children, className = '', href, onClick, ...rest }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      ref={ref}
      className={className}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.2s ease' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ─── Animated counter display ─── */
function CountUp({ end, suffix = '', label, trigger }) {
  const value = useCounter(end, 1800, trigger);
  return (
    <div className="hero-stat">
      <div className="hero-stat-value">
        {value}{suffix}
      </div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

// ──────────────────────────────────────────────
// SECTION COMPONENTS
// ──────────────────────────────────────────────

/* ─── Navbar ─── */
function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handler = () => {
      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Terminal size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
          <span>&lt;MS /&gt;</span>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className={activeSection === l.href.replace('#', '') ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <MagneticBtn href="#contact" className="nav-cta">
              <Rocket size={14} /> Hire Me
            </MagneticBtn>
          </li>
        </ul>
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} color="var(--text-primary)" /> : <Menu size={22} color="var(--text-primary)" />}
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" onClick={() => setMenuOpen(false)} style={{ color: 'var(--accent-cyan)' }}>
          <Rocket size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Hire Me
        </a>
      </div>
    </>
  );
}

/* ─── Hero ─── */
function Hero() {
  const typedText = useTyping([
    'AI Developer',
    'Fullstack Engineer',
    'Tech Coach',
    'Problem Solver',
    'Mentor',
  ], 90, 50, 2200);

  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero section" id="home">
      <div className="container">
        <div className="hero-grid">
          {/* Left */}
          <div className="hero-content">
            <div className="hero-label">
              <span className="hero-label-dot" />
              <CircleDot size={12} style={{ color: 'var(--accent-green)' }} />
              Available for Opportunities
            </div>
            <h1 className="hero-name">
              Muthamizh<br />
              <span className="gradient-text">Selvan</span>
            </h1>
            <p className="hero-tagline">
              <span className="typed-text">{typedText}</span>
              <span className="typing-cursor">|</span>
            </p>
            <p className="hero-desc">
              I'm a Software Developer and Tech Coach specializing in AI systems,
              fullstack development, and real-world problem solving.
              I build, teach, and continuously explore intelligent solutions.
            </p>
            <div className="hero-cta">
              <MagneticBtn href="#projects" className="btn btn-primary">
                <Rocket size={16} /> View Projects
              </MagneticBtn>
              <MagneticBtn href="#contact" className="btn btn-outline">
                <Send size={16} /> Contact Me
              </MagneticBtn>
              <MagneticBtn
                href="#"
                className="btn btn-ghost"
                onClick={(e) => e.preventDefault()}
                title="Resume download coming soon"
              >
                <Download size={16} /> Resume
              </MagneticBtn>
            </div>
            <div className="hero-stats" ref={statsRef}>
              <CountUp end={1} suffix="+" label="Years Exp." trigger={statsVisible} />
              <CountUp end={3} suffix="+" label="Projects" trigger={statsVisible} />
              <CountUp end={85} suffix="%" label="GPA Grade" trigger={statsVisible} />
              <div className="hero-stat">
                <div className="hero-stat-value">∞</div>
                <div className="hero-stat-label">Learning</div>
              </div>
            </div>
          </div>

          {/* Right – Avatar */}
          <div className="hero-visual">
            <div className="hero-avatar-ring">
              <div className="hero-avatar">
                <img src={avatarImg} alt="Muthamizh Selvan - AI Developer" />
              </div>

              <TiltCard className="hero-badge hero-badge-1" intensity={12}>
                <span className="hero-badge-icon"><Brain size={20} color="var(--accent-cyan)" /></span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Speciality</div>
                  <div>AI & LLM Systems</div>
                </div>
              </TiltCard>

              <TiltCard className="hero-badge hero-badge-2" intensity={12}>
                <span className="hero-badge-icon"><MapPin size={20} color="var(--accent-pink)" /></span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Based in</div>
                  <div>Tamil Nadu, India</div>
                </div>
              </TiltCard>

              <TiltCard className="hero-badge hero-badge-3" intensity={12}>
                <span className="hero-badge-icon"><Zap size={20} color="var(--accent-green)" /></span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
                  <div>Open to Work</div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  const focusCards = [
    {
      Icon: Cpu,
      title: 'AI & Automation',
      desc: 'Building intelligent systems using LLMs, RAG pipelines, and autonomous agent workflows that solve real problems.',
    },
    {
      Icon: Server,
      title: 'Scalable Applications',
      desc: 'Designing and deploying applications that scale — from architecture decisions to cloud deployment.',
    },
    {
      Icon: Users,
      title: 'Teaching & Mentorship',
      desc: 'Helping students and developers grow by bridging the gap between theory and hands-on implementation.',
    },
  ];

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-text reveal-left">
            <div className="section-header">
              <p className="section-label">
                <Code size={14} /> 01. &lt;about_me /&gt;
              </p>
              <h2 className="section-title">Who I Am</h2>
              <div className="divider" />
            </div>
            <p>
              I am a Software Developer and Tech Coach based in <strong style={{ color: 'var(--accent-cyan)' }}>Tamil Nadu</strong>, currently working at <strong style={{ color: 'var(--accent-cyan)' }}>Technology Garage, Trichy</strong>. My role combines both development and mentorship, where I train students in modern technologies while also building practical applications.
            </p>
            <p>
              My journey started with web development and system administration, and over time I transitioned into AI-focused systems. I now work with <strong style={{ color: 'var(--accent-purple)' }}>LLMs, RAG architectures</strong>, and tools like <strong style={{ color: 'var(--accent-purple)' }}>LangChain and LangGraph</strong> to build intelligent applications.
            </p>
            <div className="about-highlight">
              <Lightbulb size={18} style={{ flexShrink: 0, color: 'var(--accent-cyan)', marginRight: '12px' }} />
              <span>I enjoy breaking down complex concepts and helping others learn by building real projects. My focus is always on practical implementation rather than just theory.</span>
            </div>
            <p>
              Beyond coding, I'm deeply interested in problem-solving, automation, and building systems that can make smarter decisions using data.
            </p>
          </div>

          <div className="about-focus-cards reveal-right">
            {focusCards.map((f, i) => (
              <TiltCard key={f.title} className="focus-card card" intensity={6} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="focus-card-icon">
                  <f.Icon size={28} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Skills ─── */
function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <section className="section" id="skills" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.02) 50%, transparent)' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">
            <Code size={14} /> 02. &lt;skills /&gt;
          </p>
          <h2 className="section-title">Tech Stack</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Technologies and tools I use to bring ideas to life. <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hover to explore →</span>
          </p>
        </div>
        <div className="skills-grid">
          {SKILLS.map((cat, i) => (
            <TiltCard
              key={cat.category}
              className="skill-category card reveal"
              intensity={5}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="skill-cat-header">
                <div className={`skill-cat-icon ${cat.color}`}>
                  <cat.Icon size={20} />
                </div>
                <span className="skill-cat-name">{cat.category}</span>
              </div>
              <div className="skill-items">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className={`skill-item${hoveredSkill === item ? ' skill-item-active' : ''}`}
                    onMouseEnter={() => setHoveredSkill(item)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <span className="skill-item-dot" style={{ background: cat.dotColor }} />
                    {item}
                    {hoveredSkill === item && <Sparkles size={12} className="skill-sparkle" />}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Experience ─── */
function Experience() {
  const [expandedExp, setExpandedExp] = useState(0);

  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">
            <Code size={14} /> 03. &lt;experience /&gt;
          </p>
          <h2 className="section-title">Work History</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Where I've worked and what I've built. Click to explore each role.
          </p>
        </div>
        <div className="timeline">
          {EXPERIENCES.map((exp, i) => (
            <div key={i} className="timeline-item reveal">
              <div className={`timeline-dot${exp.current ? ' current' : ''}`} />
              <TiltCard
                className={`exp-card card${expandedExp === i ? ' exp-card-expanded' : ''}`}
                intensity={4}
              >
                <div
                  className="exp-card-clickable"
                  onClick={() => setExpandedExp(expandedExp === i ? -1 : i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="exp-company-row">
                    <span className="exp-company">
                      <Building2 size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      {exp.company}
                    </span>
                    <span className="exp-period">
                      <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      {exp.period}
                    </span>
                  </div>
                  <div className="exp-title">{exp.title}</div>
                  {exp.current && (
                    <div style={{ marginBottom: '14px' }}>
                      <span className="tag tag-green">
                        <CircleDot size={10} /> Current Role
                      </span>
                    </div>
                  )}
                </div>
                <div className={`exp-details${expandedExp === i ? ' exp-details-show' : ''}`}>
                  <ul className="exp-achievements">
                    {exp.achievements.map((a, j) => (
                      <li key={j} style={{ animationDelay: `${j * 0.08}s` }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '3px' }} />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Projects ─── */
function Projects() {
  return (
    <section className="section" id="projects" style={{ background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.02) 50%, transparent)' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">
            <Code size={14} /> 04. &lt;projects /&gt;
          </p>
          <h2 className="section-title">What I've Built</h2>
          <div className="divider" />
          <p className="section-subtitle">
            A selection of projects from development to AI systems.
          </p>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((proj, i) => (
            <TiltCard
              key={proj.title}
              className={`project-card card reveal${proj.featured ? ' featured' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
              intensity={5}
            >
              {proj.featured ? (
                <>
                  <div className="project-content">
                    <div className="project-header">
                      <div>
                        <div className="tag tag-pink" style={{ marginBottom: '10px' }}>
                          <Star size={12} /> Featured Project
                        </div>
                        <h3 className="project-title">{proj.title}</h3>
                      </div>
                    </div>
                    <p className="project-desc">{proj.desc}</p>
                    <div className="project-technologies">
                      {proj.tags.map((t) => (
                        <span key={t} className={`tag ${TAG_COLORS[proj.tagColor]}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="project-visual">
                    <div className="project-featured-orb">
                      <proj.Icon size={48} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="project-header">
                    <div className="project-icon"><proj.Icon size={24} /></div>
                    <ExternalLink size={16} color="var(--text-muted)" className="project-link-icon" />
                  </div>
                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-desc">{proj.desc}</p>
                  <div className="project-technologies">
                    {proj.tags.map((t) => (
                      <span key={t} className={`tag ${TAG_COLORS[proj.tagColor]}`}>{t}</span>
                    ))}
                  </div>
                </>
              )}
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Education ─── */
function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">
            <Code size={14} /> 05. &lt;education /&gt;
          </p>
          <h2 className="section-title">Education</h2>
          <div className="divider" />
        </div>
        <div className="reveal">
          <TiltCard className="education-card card" intensity={4}>
            <div>
              <h3 className="edu-degree">Bachelor of Vocational (B.Voc)</h3>
              <div className="edu-field">
                <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Software Development & System Administration
              </div>
              <div className="edu-institution">
                <GraduationCap size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                St. Joseph's College (Autonomous), Trichy
              </div>
              <div className="edu-period">
                <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                2022 – 2025
              </div>
              <div className="edu-highlights">
                <div className="edu-highlight">
                  <Award size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                  Technical Lead – Department Website
                </div>
                <div className="edu-highlight">
                  <Target size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                  Active in development and technical activities
                </div>
                <div className="edu-highlight">
                  <Code size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                  Specialized in fullstack & system administration
                </div>
              </div>
            </div>
            <div className="edu-grade">
              <div className="edu-grade-value">85%</div>
              <div className="edu-grade-label">Final Grade</div>
            </div>
          </TiltCard>
        </div>

        {/* Certifications */}
        <div style={{ marginTop: '48px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }} className="reveal">
            <Trophy size={22} color="var(--accent-cyan)" /> Certifications
          </h3>
          <div className="cert-grid">
            <TiltCard className="cert-card card reveal" intensity={6}>
              <div className="cert-icon">
                <Coffee size={22} />
              </div>
              <div>
                <div className="cert-name">Java Object-Oriented Programming</div>
                <div className="cert-issuer">
                  <Linkedin size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  LinkedIn Learning
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Currently Doing + Philosophy ─── */
function NowAndPhilosophy() {
  const currentData = [
    {
      Icon: Rocket,
      title: 'Building',
      items: ['AI-powered applications', 'Automation systems', 'LLM + RAG pipelines'],
    },
    {
      Icon: BookOpen,
      title: 'Exploring',
      items: ['Multi-agent systems (LangGraph)', 'Advanced prompt engineering', 'Cloud-native deployments'],
    },
    {
      Icon: GraduationCap,
      title: 'Teaching',
      items: ['Real-world development', 'Python & AI fundamentals', 'Project-based learning'],
    },
  ];

  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.02) 50%, transparent)' }}>
      <div className="container">
        {/* Currently */}
        <div className="section-header reveal">
          <p className="section-label">
            <Code size={14} /> 06. &lt;right_now /&gt;
          </p>
          <h2 className="section-title">What I'm Doing Now</h2>
          <div className="divider" />
        </div>
        <div className="current-grid">
          {currentData.map((card, i) => (
            <TiltCard key={i} className="current-card card reveal" intensity={6} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="current-status">
                <div className="current-status-dot" />
                Active
              </div>
              <div className="current-title">
                <card.Icon size={20} style={{ color: 'var(--accent-cyan)', verticalAlign: 'middle', marginRight: '8px' }} />
                {card.title}
              </div>
              <div className="current-items">
                {card.items.map((item) => (
                  <div key={item} className="current-item">
                    <ArrowRight size={12} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Philosophy */}
        <div style={{ marginTop: '80px' }} className="reveal">
          <div className="philosophy-block card">
            <p style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Lightbulb size={16} /> My Philosophy
            </p>
            <p className="philosophy-quote">
              I believe in learning by building. Every concept becomes clear only
              when applied to real-world problems.
            </p>
            <div className="divider" style={{ margin: '0 auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px' }}>
              — Muthamizh Selvan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(''), 4000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">
            <Code size={14} /> 07. &lt;contact /&gt;
          </p>
          <h2 className="section-title">Let's Connect</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Whether it's a job opportunity, collaboration, or just a curious conversation — I'd love to hear from you.
          </p>
        </div>

        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info reveal-left">
            <a href="mailto:iam.muthamizh.s@gmail.com" className="contact-item" id="contact-email">
              <div className="contact-item-icon" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Mail size={20} color="var(--accent-cyan)" />
              </div>
              <div>
                <div className="contact-item-label">Email</div>
                <div className="contact-item-value">iam.muthamizh.s@gmail.com</div>
              </div>
            </a>

            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="contact-item" id="contact-github">
              <div className="contact-item-icon" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <Github size={20} color="var(--accent-purple)" />
              </div>
              <div>
                <div className="contact-item-label">GitHub</div>
                <div className="contact-item-value">github.com/muthamizh</div>
              </div>
            </a>

            <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" className="contact-item" id="contact-linkedin">
              <div className="contact-item-icon" style={{ background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.2)' }}>
                <Linkedin size={20} color="var(--accent-pink)" />
              </div>
              <div>
                <div className="contact-item-label">LinkedIn</div>
                <div className="contact-item-value">linkedin.com/in/muthamizh</div>
              </div>
            </a>

            {/* Focus areas */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} /> My Focus Areas
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['AI + Automation', 'Scalable Apps', 'Real-world Problem Solving', 'Mentorship'].map((f) => (
                  <span key={f} className="tag tag-cyan">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="reveal-right">
            <div className="contact-form card">
              <h3>
                <Send size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Send a Message
              </h3>
              {status === 'sent' ? (
                <div className="form-success">
                  <div className="form-success-icon">
                    <CheckCircle2 size={48} />
                  </div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Message sent!</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
                    I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={`form-group${focused === 'name' ? ' form-group-focused' : ''}`}>
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className={`form-group${focused === 'email' ? ' form-group-focused' : ''}`}>
                    <label htmlFor="contact-email-input">Email Address</label>
                    <input
                      id="contact-email-input"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className={`form-group${focused === 'msg' ? ' form-group-focused' : ''}`}>
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      rows="5"
                      placeholder="Hi Muthamizh, I'd like to talk about..."
                      required
                      value={form.message}
                      onFocus={() => setFocused('msg')}
                      onBlur={() => setFocused('')}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <MagneticBtn className="btn btn-primary form-submit" onClick={() => {}}>
                    <Send size={16} /> Send Message
                  </MagneticBtn>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-socials">
          {[
            { Icon: Mail, href: 'mailto:iam.muthamizh.s@gmail.com', label: 'Email' },
            { Icon: Github, href: 'https://github.com/', label: 'GitHub' },
            { Icon: Linkedin, href: 'https://linkedin.com/in/', label: 'LinkedIn' },
          ].map((s) => (
            <MagneticBtn
              key={s.label}
              href={s.href}
              className="footer-social-link"
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              <s.Icon size={18} />
            </MagneticBtn>
          ))}
        </div>
        <p className="footer-text">
          Designed & Built by <span>Muthamizh Selvan</span> &nbsp;·&nbsp;{' '}
          <span style={{ fontFamily: 'var(--font-mono)' }}>&lt;MS /&gt;</span>
          &nbsp;·&nbsp; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

/* ─── Scroll-to-top ─── */
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <MagneticBtn
      className={`scroll-top-btn${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      id="scroll-to-top"
    >
      <ChevronUp size={20} />
    </MagneticBtn>
  );
}

// ──────────────────────────────────────────────
// ROOT APP
// ──────────────────────────────────────────────
export default function App() {
  useReveal();

  return (
    <div id="app-root">
      {/* Interactive backgrounds */}
      <Particles count={35} />
      <MouseGlow />

      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <Navbar />
      <main>
        <Hero />
        <div className="glow-line" />
        <About />
        <div className="glow-line" />
        <Skills />
        <div className="glow-line" />
        <Experience />
        <div className="glow-line" />
        <Projects />
        <div className="glow-line" />
        <Education />
        <div className="glow-line" />
        <NowAndPhilosophy />
        <div className="glow-line" />
        <Contact />
      </main>
      <Footer />
      <ScrollTop />
    </div>
  );
}
