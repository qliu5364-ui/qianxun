import { useEffect, useRef, useState } from "react";

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

  const startTick = (el) => {
    if (el.dataset.counted === "1") return;
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
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            startTick(el);
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);

    // 兜底：若 1.5 秒后仍未触发（初始已在视口内），强制启动
    const fallback = setTimeout(() => startTick(el), 1500);
    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
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
  close: "M18 6L6 18 M6 6l12 12",
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

/* 静态资源路径：兼容 GitHub Pages 子路径部署 */
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

function Hero() {
  return (
    <header className="hero">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="container">
        <div className="hero-main">
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
            短视频运营 <span>/</span> 短视频编导
          </div>
          <p className="desc">
            两年抖音短视频编导运营经验。擅长账号定位、选题策划、脚本撰写、剪辑发布全流程，
            爆款打造 + 数据复盘，让专业内容精准触达目标用户，助力账号快速涨粉与转化。
          </p>
          <div className="actions">
            <a href="#works" className="btn btn-primary">
              观看作品 <Icon d={icons.arrow} size={17} />
            </a>
            <a href="#contact" className="btn btn-ghost">
              合作咨询
            </a>
          </div>
        </div>

        <aside className="hero-side glass">
          <span className="side-label">CORE STATS · 核心战绩</span>
          <div className="side-stats">
            {[
              ["17w+", "累计涨粉"],
              ["70w+", "单条最高播放"],
              ["22w+", "自然播放爆款"],
            ].map(([num, lbl]) => (
              <div className="side-stat" key={lbl}>
                <span className="n font-display">{num}</span>
                <span className="l">{lbl}</span>
              </div>
            ))}
          </div>
          <div className="side-divider" />
          <span className="side-label">合作方向</span>
          <div className="side-tags">
            {["医疗健康科普", "家居陶瓷", "品牌电商", "本地生活"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="side-note">
            可承接账号全案策划、单条视频制作与团队内容培训，从定位、脚本到发布复盘全链路跟进，
            一周稳定输出 5-6 条高质量内容。
          </p>
        </aside>

        <div className="hero-meta">
          <div className="meta-item">
            <span className="meta-label">SCROLL TO EXPLORE</span>
            <span className="meta-line" />
          </div>
          <div className="meta-item">
            <span className="meta-label">BASED IN 北京</span>
            <span className="meta-line" />
          </div>
          <div className="meta-item">
            <span className="meta-label">SINCE 2024</span>
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
    { num: 2, suffix: "年+", label: "短视频编导运营" },
    { num: 17, suffix: "w+", label: "累计涨粉" },
    { num: 70, suffix: "w+", label: "单条最高播放" },
    { num: 400, suffix: "+", label: "累计科普内容" },
    { num: 22, suffix: "w+", label: "自然播放爆款" },
  ];
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="panel glass reveal">
          <div className="photo-wrap">
            <img className="photo" src={asset("avatar.png")} alt="刘洪安" />
            <div className="photo-tag glass">刘洪安 · 短视频运营 / 短视频编导</div>
          </div>
          <div className="info">
            <span className="section-label">ABOUT ME</span>
            <h2>
              你好，我是<span style={{ color: "var(--accent)" }}>刘洪安</span>
            </h2>
            <p>
              一名深耕抖音短视频编导运营的实战派。两年经验，两个完整爆款账号从 0 到 1 操盘：
              <b>武汉市中医医院「中医张压西」</b>单月涨粉 1.4w，累计涨粉 17w+；
              <b>景德镇妙得陶瓷</b>工厂号自然播放单条 22w+，多平台内容分发形成商业闭环。
            </p>
            <p>
              熟练运用剪映、PS 完成全流程制作，精通抖音算法规则与内容 SOP 沉淀，
              以"痛点开场 + 专业讲解 + 行动引导"的结构，持续打造爆款模型，
              支撑账号一周 5-6 条高频更新节奏。
            </p>
            <div className="contacts">
              <span className="contact-chip">
                <Icon d={icons.phone} size={16} /> 159 7027 1291
              </span>
              <span className="contact-chip">
                <Icon d={icons.mail} size={16} /> 2633913477@qq.com
              </span>
              <span className="contact-chip">
                <Icon d={icons.pin} size={16} /> 北京
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

/* 作品放大预览（灯箱） */
function Lightbox({ work, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose} aria-label="关闭">
          <Icon d={icons.close} size={20} />
        </button>

        <div className="lb-media">
          <video src={work.src} controls autoPlay playsInline loop />
        </div>

        <div className="lb-info">
          <div className="lb-top">
            <span className="lb-idx">{work.idx}</span>
            {work.project && <span className="lb-proj">{work.project}</span>}
          </div>
          <h3>{work.title}</h3>
          <p>{work.desc}</p>
          <div className="lb-tags">
            {work.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <span className="lb-hint">ESC 或点击空白处关闭</span>
        </div>
      </div>
    </div>
  );
}

function Works() {
  const [active, setActive] = useState(null);
  const works = [
    // —— 武汉市中医医院 · 中医张压西抖音号 ——
    {
      src: asset("work1.mp4"),
      idx: "01",
      title: "再厉害的失眠，也别乱吃安眠药",
      desc: "抖音名医 IP「中医张压西」系列，以「症状痛点 + 中医病因 + 调理思路」结构，将专业医学知识转化为通俗口播，精准触达健康需求用户。",
      tags: ["中医科普", "名医 IP", "抖音爆款"],
      project: "武汉市中医医院",
    },
    {
      src: asset("work2.mp4"),
      idx: "02",
      title: "胃肠不适：脾胃虚弱与肠燥津亏怎么调",
      desc: "围绕高频健康问题持续策划选题，以黄金三秒开头精准抓注意力，单条最高播放 70w+，支撑账号一周 5-6 条高频更新节奏。",
      tags: ["爆款打造", "开头钩子", "数据复盘"],
      project: "武汉市中医医院",
    },
    {
      src: asset("work3.mp4"),
      idx: "03",
      title: "85% 的结石，其实不用手术",
      desc: "人设与内容体系搭建，将专业中医内科、肝胆领域知识转化为易传播的短视频内容，参与医生对接、脚本撰写、剪辑发布全环节。",
      tags: ["账号定位", "内容策划", "全流程制作"],
      project: "武汉市中医医院",
    },
    {
      src: asset("work4.mp4"),
      idx: "04",
      title: "糖尿病怎么调？别只盯着降糖",
      desc: "搭建「症状痛点 + 中医病因解释 + 调理思路 + 安全提示」内容结构，沉淀可复用爆款模型，助力账号累计涨粉 17w+。",
      tags: ["涨粉模型", "SOP 沉淀", "内容体系"],
      project: "武汉市中医医院",
    },
    // —— 景德镇妙得陶瓷 · 瓷筷品牌号 ——
    {
      src: asset("work5.mp4"),
      idx: "05",
      title: "源头工厂高端陶瓷筷 · 开箱测评",
      desc: "突出景德镇源头工厂 + 自产自销定位，通过工厂实景、制作工艺和产品展示建立信任，自然播放单条 22w+，获赞 7430、评论 900+。",
      tags: ["工厂背书", "产品展示", "自然流量"],
      project: "景德镇妙得陶瓷",
    },
    {
      src: asset("work6.mp4"),
      idx: "06",
      title: "筷子发霉生菌？换陶瓷筷才是王道",
      desc: "围绕筷子发霉、生菌等生活痛点策划选题，结合陶瓷工艺防霉耐高温特点，痛点开场 + 产品对比 + 促销引导，搭建多元商业闭环。",
      tags: ["痛点营销", "转化链路", "直播联动"],
      project: "景德镇妙得陶瓷",
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
          <span className="head-side">2024 — 2025 · DOUYIN SHOWREEL</span>
        </div>
        <div className="grid">
          {works.map((w) => (
            <div
              className="work-card glass reveal"
              key={w.idx}
              role="button"
              tabIndex={0}
              onClick={() => setActive(w)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(w);
                }
              }}
            >
              <div className="video-box">
                <HoverVideo src={w.src} />
                <span className="idx">{w.idx}</span>
                <div className="play-hint">
                  <span className="circle">
                    <Icon d={icons.play} size={26} />
                  </span>
                  <span className="ph-text">点击放大观看</span>
                </div>
                {w.project && <span className="proj-tag">{w.project}</span>}
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

      {active && <Lightbox work={active} onClose={() => setActive(null)} />}
    </section>
  );
}

/* ---------- 服务领域 ---------- */
function Services() {
  const list = [
    {
      icon: icons.target,
      title: "账号全案策划",
      desc: "账号定位、竞品分析、人设与内容体系搭建。从 0 到 1 设计差异化定位，精准戳中目标客群。",
    },
    {
      icon: icons.film,
      title: "短视频编导运营",
      desc: "抖音全流程：选题策划、脚本撰写、拍摄统筹、剪辑发布、数据复盘。爆款结构 + 高频更新节奏。",
    },
    {
      icon: icons.edit,
      title: "单条视频制作",
      desc: "从素材到成片的全流程制作：剪映剪辑、字幕包装、封面标题优化、口播节奏把控。",
    },
    {
      icon: icons.layers,
      title: "内容 SOP 搭建",
      desc: "沉淀脚本框架、选题逻辑、爆款模型，输出可交接复用的内容生产 SOP，支撑团队一周 5-6 条高频更新。",
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
          <span className="head-side">从定位到涨粉 · 一站式抖音运营</span>
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

/* ---------- 工作流程 ---------- */
function Process() {
  const steps = [
    { step: "01", title: "账号定位", desc: "竞品分析 · 人设与差异化" },
    { step: "02", title: "选题策划", desc: "痛点挖掘 · 爆款结构" },
    { step: "03", title: "脚本撰写", desc: "黄金三秒 · 口播节奏" },
    { step: "04", title: "制作发布", desc: "剪辑包装 · 封面优化" },
    { step: "05", title: "数据复盘", desc: "播放互动 · 迭代优化" },
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
      icon: icons.target,
      title: "账号全案策划",
      desc: "两年操盘经验，两个完整爆款账号从 0 到 1 落地。深谙抖音算法规则，精准定位差异化人设，让专业内容快速找到目标用户。",
      tools: ["账号定位", "竞品分析", "人设设计"],
    },
    {
      icon: icons.film,
      title: "成片统筹能力",
      desc: "熟练运用剪映、PS 完成全流程制作，擅长痛点开场设计、视频结构优化与封面标题包装，具备成熟的成片审美与节奏把控。",
      tools: ["剪映", "PS", "字幕包装", "封面优化"],
    },
    {
      icon: icons.layers,
      title: "数据复盘驱动",
      desc: "每日拆解播放、完播、停留、互动、涨粉数据，通过优化视频结构、封面标题持续提升自然流量与精准转化。",
      tools: ["抖音数据", "粉丝分析", "迭代优化"],
    },
    {
      icon: icons.cpu,
      title: "AI 效率工具",
      desc: "计算机科班出身，熟练运用 ChatGpt、豆包等 AI 软件搭建 Agent 工作流，大幅提升选题策划、脚本撰写效率，支撑多账号运营。",
      tools: ["ChatGpt", "豆包", "Agent 工作流"],
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

/* ---------- 客户评价 ---------- */
function Testimonials() {
  const list = [
    {
      quote:
        "洪安把中医专业内容转译成通俗易懂的短视频口播，让医生和患者都能看懂。账号从 0 到 17w+ 涨粉，他的内容结构 SOP 功不可没。",
      name: "张主任",
      role: "武汉市中医医院 · 中医内科",
    },
    {
      quote:
        "我们是源头工厂，之前账号一直做不起来。洪安来了之后，突出自产自销差异化，单条视频直接跑到 22w+ 自然播放，直播间成交也起来了。",
      name: "陈总",
      role: "景德镇妙得陶瓷 · 工厂负责人",
    },
    {
      quote:
        "他不只是做视频，更懂运营。每次给的脚本都精准戳用户痛点，开头钩子一抓一个准，数据复盘也很扎实，能跟着他学到很多。",
      name: "李女士",
      role: "抖音创业者 · 美食领域",
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
            无论是账号策划、抖音编导运营，还是单条视频制作，
            都欢迎随时与我联系。期待帮你的品牌在抖音上爆起来。
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
                <div className="v">北京 / 全国可合作</div>
              </span>
            </div>
          </div>
          <div className="footer-bar">
            <span>© 2026 HONGAN LIU. ALL RIGHTS RESERVED.</span>
            <span>DIRECTING VIRAL SHORTS ON DOUYIN</span>
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
