import { useEffect, useRef } from "react";

/* 滚动入场动画 Hook */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* 数字滚动计数 Hook */
function useCountUp(target, duration = 1600) {
  const ref = useRef(null);
  const displayed = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || el.dataset.counted === "1") return;
          el.dataset.counted = "1";
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            displayed.current = Math.round(target * ease);
            el.textContent = displayed.current;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return ref;
}

/* 视频卡片：自动循环播放 */
function HoverVideo({ src, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      {...props}
    />
  );
}

const Icon = ({ d, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  play: "M5 3l14 9-14 9V3z",
  film: "M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5M4.18 2h15.64c1.2 0 2.18.98 2.18 2.18v15.64c0 1.2-.98 2.18-2.18 2.18H4.18C2.98 22 2 21.02 2 19.82V4.18C2 2.98 2.98 2 4.18 2z",
  spark: "M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z",
  teach:
    "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z",
  cpu: "M4 4h16v16H4z M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  wand:
    "M15 4V2 M15 16v-2 M8 9h2 M20 9h2 M17.8 11.8L19 13 M15 9h.01 M17.8 6.2L19 5 M3 21l9-9 M12.2 6.2L11 5",
  target: "M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
  edit: "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  layers:
    "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  check: "M20 6L9 17l-5-5",
  quote: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

function Navbar() {
  return (
    <nav className="nav glass">
      <div className="logo font-display">
        <span className="mark">L</span>
        HONGAN&nbsp;LIU
      </div>
      <div className="links">
        <a href="#about">个人经历</a>
        <a href="#works">精选项目</a>
        <a href="#services">服务领域</a>
        <a href="#process">工作流程</a>
        <a href="#strengths">个人优势</a>
        <a href="#contact">联系方式</a>
      </div>
      <a href="#contact" className="btn btn-primary nav-cta">
        联系我
      </a>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero">
      <video
        className="hero-video"
        src="/assets/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
      />
      <div className="hero-mask" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="container">
        <div className="badge glass">
          <span className="dot" />
          AVAILABLE FOR PROJECTS
        </div>
        <h1 className="chrome-text font-display">
          HONGAN
          <br />
          LIU
        </h1>
        <div className="role">
          AIGC 导演 <span>/</span> AIGC 讲师
        </div>
        <p className="desc">
          用 AI 重构影像叙事。专注 AIGC 影视级内容创作与教学，
          从创意概念到成片交付，让每一帧都兼具想象力与工业品质。
        </p>
        <div className="actions">
          <a href="#works" className="btn btn-primary">
            观看作品 <Icon d={icons.arrow} size={17} />
          </a>
          <a href="#contact" className="btn btn-ghost">
            合作咨询
          </a>
        </div>
        <div className="hero-meta">
          <div className="meta-item">
            <span className="meta-label">SCROLL TO EXPLORE</span>
            <span className="meta-line" />
          </div>
          <div className="meta-item">
            <span className="meta-label">BASED IN 江西宜春</span>
            <span className="meta-line" />
          </div>
          <div className="meta-item">
            <span className="meta-label">SINCE 2022</span>
            <span className="meta-line" />
          </div>
        </div>
      </div>
      <div className="scroll-hint">SCROLL</div>
    </header>
  );
}

function About() {
  const stats = [
    { num: 3, suffix: "年+", label: "AIGC 创作经验" },
    { num: 80, suffix: "+", label: "AIGC 影视作品" },
    { num: 30, suffix: "+", label: "商业合作项目" },
    { num: 500, suffix: "+", label: "培训学员" },
    { num: 1000, suffix: "万+", label: "全网播放量" },
  ];
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="panel glass reveal">
          <div className="photo-wrap">
            <img className="photo" src="/assets/avatar.png" alt="刘洪安" />
            <div className="photo-tag glass">刘洪安 · AIGC DIRECTOR</div>
            <div className="photo-badge glass">
              <Icon d={icons.spark} size={16} /> 即刻接单
            </div>
          </div>
          <div className="info">
            <span className="section-label">ABOUT ME</span>
            <h2>
              你好，我是<span style={{ color: "var(--accent)" }}>刘洪安</span>
            </h2>
            <p>
              一名深耕 AI 生成内容领域的导演与讲师。我将计算机科学的工程思维与影视创作的叙事美学相结合，
              熟练运用 Midjourney、即梦、可灵、Runway、ComfyUI 等工具搭建高效的 AIGC 影像生产管线，
              完成从剧本分镜、AI 生成到后期合成的全流程创作。
            </p>
            <p>
              作为讲师，我把复杂的模型原理与工具链拆解为可落地的实战方法论，
              帮助学员从零基础到独立产出商业级 AIGC 作品，用 AI 放大每个人的创作力。
            </p>
            <div className="contacts">
              <span className="contact-chip">
                <Icon d={icons.phone} size={16} /> 159 7027 1291
              </span>
              <span className="contact-chip">
                <Icon d={icons.mail} size={16} /> 2633913477@qq.com
              </span>
              <span className="contact-chip">
                <Icon d={icons.pin} size={16} /> 江西 · 宜春
              </span>
            </div>
          </div>
        </div>
        <div className="stats glass reveal">
          {stats.map((s) => (
            <CountStat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CountStat({ num, suffix, label }) {
  const ref = useCountUp(num);
  return (
    <div className="stat">
      <div className="num">
        <span ref={ref}>0</span>
        <em>{suffix}</em>
      </div>
      <div className="lbl">{label}</div>
    </div>
  );
}

function Works() {
  const works = [
    {
      src: "/assets/work1.mp4",
      idx: "01",
      title: "AI 概念短片 · 幻境序章",
      desc: "全片由 AI 生成完成，从分镜脚本、画面生成到剪辑调色独立执导，探索 AI 影像的叙事边界与电影感表达。",
      tags: ["AI 短片", "导演 / 剪辑", "即梦 · 可灵"],
    },
    {
      src: "/assets/work2.mp4",
      idx: "02",
      title: "AI 视觉实验 · 光影重塑",
      desc: "以风格化提示词工程与 ControlNet 精准控制为核心，实现电影级光影与构图，呈现稳定的视觉一致性。",
      tags: ["视觉实验", "ComfyUI", "ControlNet"],
    },
    {
      src: "/assets/work3.mp4",
      idx: "03",
      title: "AI 商业广告 · 品牌叙事",
      desc: "为品牌量身打造的 AIGC 广告片，将产品卖点融入 AI 生成的超现实场景，以极低成本实现高规格视效。",
      tags: ["商业广告", "品牌", "全流程制作"],
    },
  ];
  return (
    <section id="works" className="works">
      <div className="divider" />
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="section-label">FEATURED WORKS</span>
            <h2>
              精选<span style={{ color: "var(--accent)" }}>项目</span>
            </h2>
          </div>
          <span style={{ color: "var(--ink-soft)", fontSize: 14, letterSpacing: "0.2em" }}>
            AIGC SHOWREEL 2026
          </span>
        </div>
        <div className="grid">
          {works.map((w) => (
            <div className="work-card glass reveal" key={w.idx}>
              <div className="video-box">
                <HoverVideo src={w.src} />
                <span className="idx">{w.idx}</span>
                <div className="play-hint">
                  <span className="circle">
                    <Icon d={icons.play} size={26} />
                  </span>
                </div>
              </div>
              <div className="body">
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <div className="tags">
                  {w.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <span className="card-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 新增：服务领域 ---------- */
function Services() {
  const list = [
    {
      icon: icons.film,
      title: "AIGC 影视短片",
      desc: "从剧本策划、分镜设计、画面生成到后期合成，独立完成全流程 AI 短片制作，电影级调色与节奏把控。",
      price: "¥ 3,000 / 分钟起",
    },
    {
      icon: icons.layers,
      title: "品牌 AIGC 广告",
      desc: "为品牌量身打造 AIGC 广告片，将产品卖点融入超现实 AI 场景，以极低成本实现高规格视觉特效。",
      price: "¥ 5,000 / 条起",
    },
    {
      icon: icons.teach,
      title: "企业定制培训",
      desc: "企业内部 AIGC 创作赋能培训，结合行业场景定制案例与作业，让团队快速上手 AI 影像生产力。",
      price: "¥ 8,000 / 天起",
    },
    {
      icon: icons.wand,
      title: "AIGC 工具链搭建",
      desc: "为个人或团队搭建可复用的 AIGC 生产管线，ComfyUI 工作流编排、批量生成自动化、提示词资产沉淀。",
      price: "按需报价",
    },
  ];
  return (
    <section id="services" className="services">
      <div className="divider" />
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="section-label">SERVICES</span>
            <h2>
              我能为你<span style={{ color: "var(--accent)" }}>做什么</span>
            </h2>
          </div>
          <span className="head-side">从创意到成片 · 一站式 AIGC 服务</span>
        </div>
        <div className="grid">
          {list.map((s, i) => (
            <div className="svc-card glass reveal" key={s.title} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="svc-idx font-display">0{i + 1}</div>
              <div className="svc-icon">
                <Icon d={s.icon} size={24} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="svc-footer">
                <span className="svc-price">{s.price}</span>
                <span className="svc-arrow">
                  <Icon d={icons.arrow} size={18} />
                </span>
              </div>
              <span className="card-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 新增：工作流程 ---------- */
function Process() {
  const steps = [
    { step: "01", title: "需求沟通", desc: "明确风格、时长、交付物" },
    { step: "02", title: "创意分镜", desc: "脚本拆解 · 镜头设计" },
    { step: "03", title: "AI 生成", desc: "画面 · 视频 · 角色一致性" },
    { step: "04", title: "后期合成", desc: "剪辑 · 调色 · 音效" },
    { step: "05", title: "成片交付", desc: "源文件 · 多格式输出" },
  ];
  return (
    <section id="process" className="process">
      <div className="divider" />
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="section-label">WORKFLOW</span>
            <h2>
              <span style={{ color: "var(--accent)" }}>工作流程</span> · 五步法
            </h2>
          </div>
          <span className="head-side">高效 · 透明 · 可追溯</span>
        </div>
        <div className="flow glass reveal">
          <div className="flow-line" />
          {steps.map((s, i) => (
            <div className="flow-node" key={s.step} style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="flow-dot">
                <span>{s.step}</span>
              </div>
              <div className="flow-title">{s.title}</div>
              <div className="flow-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  const list = [
    {
      icon: icons.film,
      title: "AI 影视导演",
      desc: "具备完整的导演思维：剧本拆解、分镜设计、镜头语言与节奏把控，让 AI 生成画面服务于叙事，而非堆砌特效。",
      tools: ["分镜脚本", "镜头语言", "剪辑节奏"],
    },
    {
      icon: icons.cpu,
      title: "全流程技术管线",
      desc: "精通文生图、图生视频、局部重绘、风格迁移与高清修复，搭建稳定可复用的 AIGC 生产管线，成片效率倍增。",
      tools: ["ComfyUI", "Midjourney", "即梦", "可灵", "Runway"],
    },
    {
      icon: icons.teach,
      title: "体系化教学",
      desc: "课程从原理到实战层层递进，配套真实商业案例与作业点评，帮助学员快速建立可接单变现的 AIGC 创作能力。",
      tools: ["课程研发", "实战带教", "作业点评"],
    },
    {
      icon: icons.spark,
      title: "工程化思维",
      desc: "计算机科学科班出身，善于用代码与自动化工具扩展 AI 能力边界，批量处理、工作流编排与质量把控一并落地。",
      tools: ["Python", "自动化", "工作流编排"],
    },
  ];
  return (
    <section id="strengths" className="strengths">
      <div className="divider" />
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="section-label">WHY ME</span>
            <h2>
              个人<span style={{ color: "var(--accent)" }}>优势</span>
            </h2>
          </div>
          <span className="head-side">选择我，就是选择专业</span>
        </div>
        <div className="grid">
          {list.map((s) => (
            <div className="st-card glass reveal" key={s.title}>
              <div className="icon">
                <Icon d={s.icon} size={26} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="tools">
                {s.tools.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <span className="card-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 新增：客户评价 ---------- */
function Testimonials() {
  const list = [
    {
      quote:
        "洪安的 AIGC 技术水平非常扎实，和他合作出来的效果完全超出预期，低成本就实现了电影级的视觉效果，下次还会找他。",
      name: "王总",
      role: "某科技公司 · 品牌总监",
    },
    {
      quote:
        "作为讲师，他能把复杂的模型原理解释得非常清楚，课程实战性特别强，我上完两周就能独立接 AIGC 的商单了。",
      name: "陈同学",
      role: "课程学员 · 自由创作者",
    },
    {
      quote:
        "团队培训非常系统，从工具到方法论都覆盖到了。现在我们内部已经能用 AIGC 快速出提案小样，效率提升了好几倍。",
      name: "李经理",
      role: "某广告公司 · 创意经理",
    },
  ];
  return (
    <section className="testimonials">
      <div className="divider" />
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="section-label">TESTIMONIALS</span>
            <h2>
              客户与学员<span style={{ color: "var(--accent)" }}>怎么说</span>
            </h2>
          </div>
          <span className="head-side">真实反馈 · 口碑见证</span>
        </div>
        <div className="grid">
          {list.map((t, i) => (
            <div className="tm-card glass reveal" key={t.name} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="tm-quote">
                <Icon d={icons.quote} size={28} />
              </div>
              <p className="tm-text">“{t.quote}”</p>
              <div className="tm-foot">
                <div className="tm-avatar">
                  <Icon d={icons.user} size={22} />
                </div>
                <div>
                  <div className="tm-name">{t.name}</div>
                  <div className="tm-role">{t.role}</div>
                </div>
              </div>
              <span className="card-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="glow-ring" />
      <div className="orb orb-c1" />
      <div className="orb orb-c2" />
      <div className="container">
        <div className="reveal">
          <span className="section-label">GET IN TOUCH</span>
          <h2 className="chrome-text font-display">
            LET'S CREATE
            <br />
            TOGETHER
          </h2>
          <p className="sub">
            无论是 AIGC 影视项目合作、企业培训，还是课程咨询，
            都欢迎随时与我联系。期待与你一起，用 AI 创造下一个令人惊艳的作品。
          </p>
          <div className="cards">
            <a className="c-card glass" href="tel:15970271291">
              <span className="ic">
                <Icon d={icons.phone} size={22} />
              </span>
              <span>
                <div className="t">电话 / 微信</div>
                <div className="v">159 7027 1291</div>
              </span>
            </a>
            <a className="c-card glass" href="mailto:2633913477@qq.com">
              <span className="ic">
                <Icon d={icons.mail} size={22} />
              </span>
              <span>
                <div className="t">电子邮箱</div>
                <div className="v">2633913477@qq.com</div>
              </span>
            </a>
            <div className="c-card glass">
              <span className="ic">
                <Icon d={icons.pin} size={22} />
              </span>
              <span>
                <div className="t">所在城市</div>
                <div className="v">江西 · 宜春 / 全国可合作</div>
              </span>
            </div>
          </div>
          <div className="footer-bar">
            <span>© 2026 HONGAN LIU. ALL RIGHTS RESERVED.</span>
            <span>DIRECTING THE FUTURE WITH AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useReveal();
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Works />
      <Services />
      <Process />
      <Strengths />
      <Testimonials />
      <Contact />
    </>
  );
}
