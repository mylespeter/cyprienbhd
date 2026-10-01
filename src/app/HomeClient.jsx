

// 'use client';

// import Link from 'next/link';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   AnimatePresence,
//   MotionConfig,
//   motion,
//   useAnimationFrame,
//   useMotionValue,
//   useMotionValueEvent,
//   useScroll,
//   useSpring,
//   useTransform,
//   useVelocity,
// } from 'framer-motion';
// import { FaGithub, FaTwitter, FaLinkedin, FaResearchgate, FaFacebook, FaTelegram } from 'react-icons/fa';

// /* =====================================================================
//    Tokens & variants
//    ===================================================================== */
// const ease = [0.22, 1, 0.36, 1];

// const stagger = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
// };
// const fadeUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
// };
// const maskUp = {
//   hidden: { y: '110%' },
//   visible: { y: 0, transition: { duration: 0.9, ease } },
// };
// const ruleGrow = {
//   hidden: { scaleX: 0 },
//   visible: { scaleX: 1, transition: { duration: 0.9, ease, delay: 0.25 } },
// };
// // Révélation au scroll, indépendante pour chaque élément
// const rv = (i = 0) => ({
//   initial: { opacity: 0, y: 44 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, margin: '-60px' },
//   transition: { duration: 0.85, ease, delay: Math.min(i, 4) * 0.07 },
// });

// const wrap = 'mx-auto w-full max-w-wrap px-6';
// const sectionCls = 'pt-28 scroll-mt-14';
// const h2Cls = 'text-[clamp(1.7rem,3.6vw,2.3rem)] mb-3 text-green-800 font-semibold leading-tight';
// const h3Cls = 'text-[1.25rem] mb-1 font-semibold leading-tight text-green-800';
// const introCls = 'text-muted max-w-[58ch] mb-10';

// const socialIcons = {
//   github: FaGithub,
//   twitter: FaTwitter,
//   linkedin: FaLinkedin,
//   researchgate: FaResearchgate,
//   facebook: FaFacebook,
//   telegram: FaTelegram,
// };
// const iconFor = (l) => socialIcons[l.icon] || socialIcons[l.label?.toLowerCase()] || FaTwitter;

// /* =====================================================================
//    WebGL — champ de courbes de niveau (relief de parcelle)
//    Les lignes dérivent lentement, le curseur soulève le terrain
//    et fait apparaître des ondulations dorées.
//    ===================================================================== */
// const VERT = `#version 300 es
// in vec2 p;
// void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// const FRAG = `#version 300 es
// precision highp float;
// uniform vec2 uRes;
// uniform float uTime;
// uniform vec2 uMouse;
// uniform vec3 uLine;
// uniform vec3 uAccent;
// uniform float uStrength;
// uniform float uLevels;
// uniform float uEdge;
// out vec4 outColor;

// float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
// float noise(vec2 p){
//   vec2 i = floor(p), f = fract(p);
//   f = f * f * (3.0 - 2.0 * f);
//   return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
//              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
// }
// float fbm(vec2 p){
//   float v = 0.0, a = 0.5;
//   for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + vec2(17.3, 9.1); a *= 0.5; }
//   return v;
// }

// void main(){
//   vec2 uv = gl_FragCoord.xy / uRes;
//   float asp = uRes.x / uRes.y;
//   vec2 p = vec2(uv.x * asp, uv.y);
//   vec2 m = vec2(uMouse.x * asp, uMouse.y);
//   float t = uTime * 0.035;

//   vec2 q = p * 1.7;
//   float h = fbm(q + vec2(t, -t * 0.6) + fbm(q * 0.8 - t) * 0.7);

//   float d = distance(p, m);
//   h += 0.24 * exp(-d * d * 9.0);                        // relief soulevé
//   h += 0.035 * sin(d * 30.0 - uTime * 1.6) * exp(-d * 4.5); // ondulations

//   float x = h * uLevels;
//   float g = abs(fract(x - 0.5) - 0.5) / fwidth(x);
//   float line = 1.0 - smoothstep(0.0, 1.3, g);

//   float x2 = x / 5.0;
//   float g2 = abs(fract(x2 - 0.5) - 0.5) / fwidth(x2);
//   float idx = 1.0 - smoothstep(0.0, 2.2, g2);

//   float near = exp(-d * d * 6.0);
//   float a = (line * 0.30 + idx * 0.50) * uStrength;
//   a *= 1.0 + near * 1.3;

//   float fade = uEdge > 0.0 ? smoothstep(0.0, 0.4, uv.y) : smoothstep(1.0, 0.6, uv.y);
//   a = clamp(a * fade, 0.0, 1.0);

//   vec3 col = mix(uLine, uAccent, clamp(near * 1.4, 0.0, 1.0));
//   outColor = vec4(col * a, a);
// }`;

// function ContourCanvas({
//   line = [0.13, 0.3, 0.2],
//   accent = [0.78, 0.6, 0.25],
//   strength = 1,
//   levels = 14,
//   edge = 1,
//   className = '',
// }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const canvas = ref.current;
//     if (!canvas) return;
//     const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
//     if (!gl) return;

//     const compile = (type, src) => {
//       const s = gl.createShader(type);
//       gl.shaderSource(s, src);
//       gl.compileShader(s);
//       if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
//         console.warn(gl.getShaderInfoLog(s));
//         return null;
//       }
//       return s;
//     };
//     const vs = compile(gl.VERTEX_SHADER, VERT);
//     const fs = compile(gl.FRAGMENT_SHADER, FRAG);
//     if (!vs || !fs) return;

//     const prog = gl.createProgram();
//     gl.attachShader(prog, vs);
//     gl.attachShader(prog, fs);
//     gl.linkProgram(prog);
//     if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
//       console.warn(gl.getProgramInfoLog(prog));
//       return;
//     }
//     gl.useProgram(prog);

//     const buf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buf);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
//     const loc = gl.getAttribLocation(prog, 'p');
//     gl.enableVertexAttribArray(loc);
//     gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

//     const u = (n) => gl.getUniformLocation(prog, n);
//     const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse');
//     gl.uniform3f(u('uLine'), ...line);
//     gl.uniform3f(u('uAccent'), ...accent);
//     gl.uniform1f(u('uStrength'), strength);
//     gl.uniform1f(u('uLevels'), levels);
//     gl.uniform1f(u('uEdge'), edge);

//     const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     const target = { x: 0.72, y: 0.52 };
//     const cur = { x: 0.72, y: 0.52 };
//     const t0 = performance.now();
//     let raf = 0;
//     let running = false;

//     const draw = (now = performance.now()) => {
//       cur.x += (target.x - cur.x) * 0.06;
//       cur.y += (target.y - cur.y) * 0.06;
//       gl.uniform2f(uRes, canvas.width, canvas.height);
//       gl.uniform1f(uTime, reduce ? 12 : (now - t0) / 1000);
//       gl.uniform2f(uMouse, cur.x, cur.y);
//       gl.clearColor(0, 0, 0, 0);
//       gl.clear(gl.COLOR_BUFFER_BIT);
//       gl.drawArrays(gl.TRIANGLES, 0, 3);
//     };
//     const frame = (now) => {
//       if (!running) return;
//       draw(now);
//       raf = requestAnimationFrame(frame);
//     };
//     const start = () => {
//       if (running || reduce) return;
//       running = true;
//       raf = requestAnimationFrame(frame);
//     };
//     const stop = () => {
//       running = false;
//       cancelAnimationFrame(raf);
//     };

//     const resize = () => {
//       const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
//       const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
//       const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
//       if (canvas.width !== w || canvas.height !== h) {
//         canvas.width = w;
//         canvas.height = h;
//         gl.viewport(0, 0, w, h);
//       }
//       draw();
//     };
//     const ro = new ResizeObserver(resize);
//     ro.observe(canvas);

//     const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
//     io.observe(canvas);

//     const onMove = (e) => {
//       const r = canvas.getBoundingClientRect();
//       target.x = (e.clientX - r.left) / r.width;
//       target.y = 1 - (e.clientY - r.top) / r.height;
//     };
//     window.addEventListener('pointermove', onMove, { passive: true });

//     return () => {
//       stop();
//       ro.disconnect();
//       io.disconnect();
//       window.removeEventListener('pointermove', onMove);
//       gl.getExtension('WEBGL_lose_context')?.loseContext();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [line.join(), accent.join(), strength, levels, edge]);

//   return <canvas ref={ref} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
// }

// /* =====================================================================
//    Petits composants d'interaction
//    ===================================================================== */
// function Magnetic({ children, strength = 0.3, className = '' }) {
//   const ref = useRef(null);
//   const mx = useMotionValue(0);
//   const my = useMotionValue(0);
//   const cfg = { stiffness: 220, damping: 16, mass: 0.25 };
//   const x = useSpring(mx, cfg);
//   const y = useSpring(my, cfg);

//   return (
//     <motion.div
//       ref={ref}
//       className={`inline-block ${className}`}
//       style={{ x, y }}
//       onPointerMove={(e) => {
//         const r = ref.current.getBoundingClientRect();
//         mx.set((e.clientX - (r.left + r.width / 2)) * strength);
//         my.set((e.clientY - (r.top + r.height / 2)) * strength);
//       }}
//       onPointerLeave={() => {
//         mx.set(0);
//         my.set(0);
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// function SplitTitle({ text, className }) {
//   const letter = {
//     hidden: { y: '110%', rotate: 7 },
//     visible: { y: 0, rotate: 0, transition: { duration: 1, ease } },
//   };
//   return (
//     <motion.h1
//       className={className}
//       aria-label={text}
//       variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
//     >
//       {text.split(' ').map((w, wi) => (
//         <span key={wi} aria-hidden className="mr-[.25em] inline-block whitespace-nowrap">
//           {[...w].map((ch, ci) => (
//             <span key={ci} className="-mb-[.14em] inline-block overflow-hidden pb-[.14em] align-bottom">
//               <motion.span className="inline-block origin-bottom-left" variants={letter}>
//                 {ch}
//               </motion.span>
//             </span>
//           ))}
//         </span>
//       ))}
//     </motion.h1>
//   );
// }

// function PrimaryButton({ href, children }) {
//   return (
//     <Magnetic strength={0.25}>
//       <a
//         href={href}
//         className="group relative inline-block overflow-hidden bg-green px-[22px] py-[13px] text-[.95rem] font-semibold text-white no-underline"
//       >
//         <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
//         <span className="relative">{children}</span>
//       </a>
//     </Magnetic>
//   );
// }

// /* Portrait : révélation par masque + inclinaison 3D au curseur */
// function Portrait({ src, name }) {
//   const ref = useRef(null);
//   const ry = useMotionValue(0);
//   const rx = useMotionValue(0);
//   const cfg = { stiffness: 140, damping: 18 };
//   const rotateY = useSpring(ry, cfg);
//   const rotateX = useSpring(rx, cfg);

//   return (
//     <div
//       ref={ref}
//       className="relative max-md:max-w-[300px]"
//       style={{ perspective: 900 }}
//       onPointerMove={(e) => {
//         const r = ref.current.getBoundingClientRect();
//         ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
//         rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
//       }}
//       onPointerLeave={() => {
//         ry.set(0);
//         rx.set(0);
//       }}
//     >
//       <motion.div
//         className="absolute inset-0 translate-x-3 translate-y-3 border border-gold"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.1, duration: 0.8 }}
//       />
//       <motion.div
//         className="relative overflow-hidden bg-[#dfe3da]"
//         style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
//         initial={{ clipPath: 'inset(100% 0 0 0)' }}
//         animate={{ clipPath: 'inset(0% 0 0 0)' }}
//         transition={{ duration: 1.3, ease, delay: 0.3 }}
//       >
//         <motion.img
//           className="aspect-[4/5] w-full object-cover"
//           src={src}
//           alt={`Portrait de ${name}`}
//           width="480"
//           height="600"
//           initial={{ scale: 1.35 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 1.8, ease, delay: 0.3 }}
//         />
//       </motion.div>
//     </div>
//   );
// }

// /* =====================================================================
//    Barre de progression + jauge de profondeur (le site descend dans le sol)
//    ===================================================================== */
// function ScrollUI() {
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
//   const depthRef = useRef(null);
//   const fill = useTransform(scrollYProgress, (v) => `${v * 100}%`);

//   useMotionValueEvent(scrollYProgress, 'change', (v) => {
//     if (depthRef.current) depthRef.current.textContent = `${Math.round(v * 120)} cm`;
//   });

//   return (
//     <>
//       <motion.div className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gold" style={{ scaleX }} />
//       <div
//         aria-hidden
//         title="Profondeur"
//         className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
//       >
//         <span ref={depthRef} className="text-[.75rem] tabular-nums text-muted">0 cm</span>
//         <div className="relative h-40 w-px bg-line">
//           <motion.div className="absolute left-0 top-0 w-px bg-green" style={{ height: fill }} />
//           <motion.div
//             className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
//             style={{ top: fill }}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

// /* =====================================================================
//    Header : se cache en descendant, section active soulignée
//    ===================================================================== */
// function Header({ site }) {
//   const { scrollY } = useScroll();
//   const [hidden, setHidden] = useState(false);
//   const [active, setActive] = useState('');

//   useMotionValueEvent(scrollY, 'change', (y) => {
//     const prev = scrollY.getPrevious() ?? 0;
//     setHidden(y > prev && y > 200);
//   });

//   useEffect(() => {
//     const ids = site.nav.map((n) => n.href).filter((h) => h.startsWith('#')).map((h) => h.slice(1));
//     const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
//     if (!els.length) return;
//     const io = new IntersectionObserver(
//       (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
//       { rootMargin: '-45% 0px -50% 0px' }
//     );
//     els.forEach((el) => io.observe(el));
//     return () => io.disconnect();
//   }, [site.nav]);

//   return (
//     <motion.header
//       className="sticky top-0 z-40 border-b border-line bg-bg backdrop-blur-sm"
//       initial={{ y: -40, opacity: 0 }}
//       animate={{ y: hidden ? '-100%' : 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease }}
//     >
//       <div className={`${wrap} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3`}>
//         <a href="#" className="custom-serif text-[1.15rem] font-semibold leading-tight no-underline">
//           {site.name} 
//         </a>
//         <nav aria-label="Sections" className="flex flex-wrap gap-x-[22px] gap-y-[6px] text-[.92rem]">
//           {site.nav.map((n) => {
//             const on = active === n.href.slice(1);
//             return (
//               <a
//                 key={n.href}
//                 href={n.href}
//                 className={`relative no-underline transition-colors hover:text-ink ${on ? 'text-ink' : 'text-muted'}`}
//               >
//                 {n.label}
//                 {on && (
//                   <motion.span
//                     layoutId="nav-underline"
//                     className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold"
//                     transition={{ type: 'spring', stiffness: 400, damping: 32 }}
//                   />
//                 )}
//               </a>
//             );
//           })}
//         </nav>
//       </div>
//     </motion.header>
//   );
// }

// /* =====================================================================
//    Section (titre masqué + filet doré qui se dessine)
//    ===================================================================== */
// function Section({ id, title, intro, children }) {
//   return (
//     <section id={id} className={`${wrap} ${sectionCls}`}>
//       <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
//         <h2 className={h2Cls}>
//           <span className="block overflow-hidden pb-[.12em]">
//             <motion.span className="block" variants={maskUp}>{title}</motion.span>
//           </span>
//         </h2>
//         <motion.div variants={ruleGrow} className="mb-5 h-[2px] w-16 origin-left bg-gold" />
//         {intro && <motion.p className={introCls} variants={fadeUp}>{intro}</motion.p>}
//       </motion.div>
//       {children}
//     </section>
//   );
// }

// /* =====================================================================
//    MODIF — Carrousel infini, maintenant DRAGGABLE
//    Conserve : défilement automatique, ralentissement au survol,
//    accélération selon la vitesse du scroll, inversion de sens.
//    Ajoute : glisser à la souris / au doigt, avec inertie.
//    Au relâchement, le carrousel repart dans le sens du geste.
//    ===================================================================== */
// function InfiniteCarousel({ images, base = 55, imgHeight = 300 }) {
//   const rootRef = useRef(null);
//   const trackRef = useRef(null);
//   const widthRef = useRef(0);
//   const hovering = useRef(false);
//   const dir = useRef(-1);
//   const x = useMotionValue(0);

//   // état du drag
//   const drag = useRef({ active: false, startX: 0, startVal: 0, lastX: 0, lastT: 0, vel: 0 });
//   const inertia = useRef(0); // px/s, décroît tout seul
//   const [grabbing, setGrabbing] = useState(false);

//   const { scrollY } = useScroll();
//   const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
//   const boost = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });

//   const items = useMemo(() => {
//     let set = images;
//     while (set.length && set.length < 8) set = [...set, ...images];
//     return [...set, ...set];
//   }, [images]);

//   useEffect(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     const measure = () => (widthRef.current = el.scrollWidth / 2);
//     measure();
//     const ro = new ResizeObserver(measure);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, [items]);

//   const wrapX = (v) => {
//     const w = widthRef.current;
//     if (!w) return v;
//     let n = v % w;
//     if (n > 0) n -= w;
//     return n;
//   };

//   useAnimationFrame((_, delta) => {
//     const w = widthRef.current;
//     if (!w) return;
//     // pendant le drag, c'est le doigt/la souris qui pilote
//     if (drag.current.active) return;

//     const dt = delta / 1000;
//     const vf = boost.get();
//     if (vf > 0.05) dir.current = -1;
//     else if (vf < -0.05) dir.current = 1;

//     let move = dir.current * base * dt * (hovering.current ? 0.2 : 1);
//     move += move * Math.abs(vf);

//     // inertie issue du dernier geste (amortie)
//     move += inertia.current * dt;
//     inertia.current *= Math.pow(0.02, dt); // ~ s'éteint en 1 seconde

//     x.set(wrapX(x.get() + move));
//   });

//   const onPointerDown = (e) => {
//     if (e.pointerType === 'mouse' && e.button !== 0) return;
//     const d = drag.current;
//     d.active = true;
//     d.startX = e.clientX;
//     d.startVal = x.get();
//     d.lastX = e.clientX;
//     d.lastT = performance.now();
//     d.vel = 0;
//     inertia.current = 0;
//     setGrabbing(true);
//     e.currentTarget.setPointerCapture?.(e.pointerId);
//   };

//   const onPointerMove = (e) => {
//     const d = drag.current;
//     if (!d.active) return;
//     const now = performance.now();
//     const dtm = Math.max(1, now - d.lastT);
//     // vitesse lissée (px/s)
//     const inst = ((e.clientX - d.lastX) / dtm) * 1000;
//     d.vel = d.vel * 0.7 + inst * 0.3;
//     d.lastX = e.clientX;
//     d.lastT = now;
//     x.set(wrapX(d.startVal + (e.clientX - d.startX)));
//   };

//   const endDrag = (e) => {
//     const d = drag.current;
//     if (!d.active) return;
//     d.active = false;
//     setGrabbing(false);
//     e.currentTarget.releasePointerCapture?.(e.pointerId);
//     // le carrousel repart dans le sens du geste, avec l'élan
//     if (Math.abs(d.vel) > 20) dir.current = d.vel > 0 ? 1 : -1;
//     inertia.current = Math.max(-3000, Math.min(3000, d.vel));
//   };

//   return (
//     <div
//       ref={rootRef}
//       className={`relative mt-20 w-full select-none overflow-hidden py-4 ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
//       style={{ touchAction: 'pan-y' }}
//       onPointerEnter={() => (hovering.current = true)}
//       onPointerLeave={() => (hovering.current = false)}
//       onPointerDown={onPointerDown}
//       onPointerMove={onPointerMove}
//       onPointerUp={endDrag}
//       onPointerCancel={endDrag}
//     >
//       <motion.div
//         ref={trackRef}
//         className="flex items-center gap-2 pr-2 will-change-transform"
//         style={{ x, width: 'max-content' }}
//       >
//         {items.map((img, i) => (
//           <div
//             key={i}
//             className="flex-shrink-0 overflow-hidden rounded-sm"
//             style={{ height: imgHeight, width: imgHeight * (4 / 3) }}
//           >
//             <img
//               src={img.src}
//               alt={img.alt || ''}
//               draggable={false}
//               loading="lazy"
//               className="pointer-events-none h-full w-full scale-[1.03] object-cover grayscale-[.35] transition-all duration-700 hover:scale-110 hover:grayscale-0"
//             />
//           </div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

// /* =====================================================================
//    Domaines : horizons de sol, un seul ouvert à la fois
//    ===================================================================== */
// const horizonColors = [
//   'bg-[#3a2a1d] text-[#f3ece2]',
//   'bg-[#6b4a2f] text-[#f7efe4]',
//   'bg-[#a27b4f] text-[#140d06]',
//   'bg-[#d6bf94] text-[#140d06]',
// ];

// function Horizons({ items }) {
//   const [open, setOpen] = useState(0);
//   return (
//     <ol className="grid">
//       {items.map((e, i) => {
//         const isOpen = open === i;
//         return (
//           <motion.li
//             key={e.title}
//             className={`origin-top overflow-hidden ${horizonColors[i % horizonColors.length]}`}
//             initial={{ opacity: 0, scaleY: 0.5, y: 40 }}
//             whileInView={{ opacity: 1, scaleY: 1, y: 0 }}
//             viewport={{ once: true, margin: '-40px' }}
//             transition={{ duration: 0.8, ease, delay: i * 0.08 }}
//           >
//             <button
//               type="button"
//               aria-expanded={isOpen}
//               onClick={() => setOpen(isOpen ? -1 : i)}
//               className="relative grid w-full grid-cols-[150px_1fr] gap-6 px-8 py-7 text-left
//                          max-md:grid-cols-1 max-md:gap-1 max-md:px-5 max-md:py-[22px]"
//             >
//               <span className="text-[.92rem] opacity-80">{e.depth}</span>
//               <span className="block pr-8">
//                 <span className="block text-[1.25rem] font-semibold leading-tight">{e.title}</span>
//                 <AnimatePresence initial={false}>
//                   {isOpen && (
//                     <motion.span
//                       key="content"
//                       className="block overflow-hidden"
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.55, ease }}
//                     >
//                       <span className="block max-w-[58ch] pt-2">{e.text}</span>
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </span>
//               <motion.span
//                 aria-hidden
//                 className="absolute right-6 top-6 text-2xl leading-none"
//                 animate={{ rotate: isOpen ? 45 : 0 }}
//                 transition={{ duration: 0.4, ease }}
//               >
//                 +
//               </motion.span>
//             </button>
//           </motion.li>
//         );
//       })}
//     </ol>
//   );
// }


// /* =====================================================================
//    Parcours : design en cartes + ligne verte qui se remplit au scroll
//    ===================================================================== */
// function Timeline({ items }) {
//   const ref = useRef(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] });
//   const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
//   const height = useTransform(smooth, [0, 1], ['0%', '100%']);

//   return (
//     <div ref={ref} className="relative pl-10 max-md:pl-8">
//       {/* Rail : ligne grise de fond */}
//       <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-gray-300 max-md:left-[5px]">
//         {/* Ligne verte qui se remplit au scroll */}
//         <motion.div
//           className="absolute left-0 top-0 w-full origin-top bg-green-600"
//           style={{ height }}
//         />
//         {/* Pointe lumineuse */}
//         <motion.div
//           aria-hidden
//           className="absolute left-1/2 z-10 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600 shadow-[0_0_0_4px_rgba(19,48,32,.15)]"
//           style={{ top: height }}
//         />
//       </div>

//       <ul className="grid gap-12">
//         {items.map((c) => (
//           <motion.li
//             key={c.years + c.role}
//             className="relative"
//             initial={{ opacity: 0, y: 36 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: '-12% 0px' }}
//             transition={{ duration: 0.8, ease }}
//           >
         

//             <p className="mb-3 inline--3 py-[px] custom-serif text-[.9rem] font-semibold leading-tight text-green-950">
//               {c.years}
//             </p>

//             <div className=" bg-white px- py5 transition-shadow duration-500 hover max-md:px-">
//               <h3 className={h3Cls}>{c.role}</h3>
//               <p className="mb-3 text-[.95rem] font-medium text-yellow-700">{c.org}</p>
//               <p className="max-w-[64ch] text-gray-500">{c.text}</p>

//               {c.points?.length > 0 && (
//                 <ul className="mt-4 grid gap-2">
//                   {c.points.map((pt) => (
//                     <li key={pt} className="flex gap-3 text-[.95rem]">
//                       <span aria-hidden className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-yellow-600" />
//                       <span>{pt}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}

              
//             </div>
//           </motion.li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// /* =====================================================================
//    Réalisations : au survol, les autres s'effacent
//    ===================================================================== */
// function Projects({ items }) {
//   const [hover, setHover] = useState(null);
//   return (
//     <ul className="grid gap-10" onPointerLeave={() => setHover(null)}>
//       {items.map((p, i) => (
//         <motion.li key={p.title} {...rv(i)} onPointerEnter={() => setHover(i)}>
//           <motion.div
//             className="grid grid-cols-[150px_1fr] gap-6 max-md:grid-cols-1 max-md:gap-[2px]"
//             animate={{ opacity: hover === null || hover === i ? 1 : 0.35, x: hover === i ? 8 : 0 }}
//             transition={{ duration: 0.45, ease }}
//           >
//             <p className="pt-[3px] custom-serif text-[1.6rem] font-semibold leading-tight text-green">{p.year}</p>
//             <div>
//               <h3 className={h3Cls}>
//                 <span className="relative inline-block">
//                   {p.title}
//                   <motion.span
//                     aria-hidden
//                     className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gold"
//                     animate={{ scaleX: hover === i ? 1 : 0 }}
//                     transition={{ duration: 0.45, ease }}
//                   />
//                 </span>
//               </h3>
//               <p className="text-[.9rem] text-muted">{p.place}</p>
//               <p className="mt-1 max-w-[62ch] text-muted">{p.text}</p>
//             </div>
//           </motion.div>
//         </motion.li>
//       ))}
//     </ul>
//   );
// }

// /* =====================================================================
//    Page
//    ===================================================================== */
// export default function HomeClient({ site, articles, galleryImages = [] }) {
//   const defaultGallery = Array.from({ length: 15 }, (_, i) => ({
//     src: ['/poules.jpg', '/track.jpg', '/agro.png'][i % 3],
//     alt: 'Champ agricole',
//   }));
//   const gallery = galleryImages.length > 0 ? galleryImages : defaultGallery;

//   return (
//     <MotionConfig reducedMotion="user">
//       <ScrollUI />
//       <Header site={site} />

//       <main>
//         {/* ---------- Hero ---------- */}
//         <section className="relative isolate overflow-hidden">
//           <div className="absolute inset-0 -z-10 opacity-30">
//             <ContourCanvas />
//           </div>

//           <div
//             className={`${wrap} grid min-h-[calc(100svh-57px)] items-center gap-16 py-16
//                         md:grid-cols-[1.25fr_.75fr] max-md:grid-cols-1 max-md:gap-9 max-md:py-10`}
//           >
//             <motion.div initial="hidden" animate="visible" variants={stagger}>
//               <SplitTitle
//                 text={site.name}
//                 className="custom-serif text-[clamp(2rem,6vw,4rem)] font-semibold leading-tigh tacking-[-.015em]"
//               />

//               <motion.p className="mb-6 mt-2 custom-serif text-[1.3rem] leading-tight text-green" variants={fadeUp}>
//                 {site.role}
//               </motion.p>
//               <motion.p className="max-w-[54ch] text-[1.12rem]" variants={fadeUp}>{site.intro}</motion.p>
//               <motion.p className="mt-4 text-muted" variants={fadeUp}>{site.place}</motion.p>

//               <motion.p className="mt-4" variants={fadeUp}>
//                 <a
//                   href={`mailto:${site.email}`}
//                   className="inline-flex items-center gap-2 text-green no-underline transition-colors hover:text-ink"
//                 >
//                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                   {site.email}
//                 </a>
//               </motion.p>

//               {/* MODIF : bouton + « Me contacter » + réseaux sociaux sur UNE seule ligne
//                   (elle passe à la ligne seulement si l'écran est trop étroit) */}
//               <motion.div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4" variants={fadeUp}>
//                 <a
//                   href="#contact"
//                   className="underlin decoration-god decoration-2 underline-offset-[5px] transition-[text-underline-offset] hover:underline-offset-[9px]"
//                 >
//                   Mes projets
//                 </a>
//                 <a
//                   href="#contact"
//                   className="underline decoration-god decoration-2 underline-offset-[5px] transition-[text-underline-offset] hover:underline-offset-[9px]"
//                 >
//                   Me contacter →
//                 </a>

//                 <span aria-hidden className="hidden h-6 w-px bg-line sm:block" />

//                 <div className="flex items-center gap-2">
//                   {site.links?.map((l) => {
//                     const Icon = iconFor(l);
//                     return (
//                       <Magnetic key={l.href} strength={0.5}>
//                         <a
//                           href={l.href}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           aria-label={l.label}
//                           title={l.label}
//                           className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-green transition-colors duration-300 hover:border-green hover:bg-green-700 hover:text-white"
//                         >
//                           <Icon size={18} />
//                         </a>
//                       </Magnetic>
//                     );
//                   })}
//                 </div>
//               </motion.div>
//             </motion.div>

//             <Portrait src={site.photo} name={site.name} />
//           </div>
//         </section>

        
//                 {/* ---------- Carrousel ---------- */}
//         <div className='px-'>
//           <h1 className='text-green-800 text-4xl'>
//             Gallerie de projets
//           </h1>
//         <InfiniteCarousel images={gallery} />
//          <a
//                   href="/projets"
//                   className="underline decoration-god decoration-2 underline-offset-[5px] transition-[text-underline-offset] hover:underline-offset-[9px]"
//                 >
//                   Voir tous les images  →
//                 </a>
//         </div>
       

//         {/* ---------- Domaines ---------- */}
//         <Section
//           id="domaines"
//           title="Domaines d'intervention"
//           intro="Je travaille de la surface de la parcelle vers le bas : ce qui pousse, ce qui nourrit, ce qui structure, ce qui irrigue."
//         >
//           <Horizons items={site.expertise} />
//         </Section>

//         {/* ---------- Parcours ---------- */}
//         <Section
//           id="parcours"
//           title="Parcours"
//           intro="Plus de dix ans entre recherche appliquée, conseil en chambre d'agriculture et accompagnement indépendant, toujours à partir du terrain."
//         >
//           <Timeline items={site.career} />
//         </Section>

//         {/* ---------- Réalisations ---------- */}
//         <Section id="realisations" title="Réalisations">
//           <Projects items={site.projects} />
//         </Section>

//         {/* ---------- Publications ---------- */}
//         <Section
//           id="publications"
//           title="Publications"
//           intro="Notes de terrain et retours d'essais, écrits pour les exploitants et les techniciens."
//         >
//           <ul className="grid">
//             {articles.map((a, i) => (
//               <motion.li
//                 key={a.slug}
//                 {...rv(i)}
//                 className="group relative grid grid-cols-[1fr_190px] gap-7 border-t border-line py-7 last:border-b
//                            max-md:grid-cols-1 max-md:gap-4"
//               >
//                 <div>
//                   <p className="text-[.9rem] text-muted">{a.dateLabel}</p>
//                   <h3 className="mb-2 mt-[2px] custom-serif text-[1.4rem] font-semibold leading-tight">
//                     <Link
//                       href={`/articles/${a.slug}`}
//                       className="no-underline after:absolute after:inset-0 after:content-['']"
//                     >
//                       <span className="bg-[linear-gradient(#b8923f,#b8923f)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:bg-[length:100%_2px]">
//                         {a.title}
//                       </span>
//                     </Link>
//                   </h3>
//                   <p className="max-w-[60ch] text-muted">{a.excerpt}</p>
//                 </div>
//                 {a.cover && (
//                   <motion.div
//                     className="overflow-hidden max-md:order-first"
//                     initial={{ clipPath: 'inset(0 0 100% 0)' }}
//                     whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
//                     viewport={{ once: true, margin: '-40px' }}
//                     transition={{ duration: 1, ease, delay: 0.15 }}
//                   >
//                     <img
//                       className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
//                       src={a.cover}
//                       alt=""
//                     />
//                   </motion.div>
//                 )}
//               </motion.li>
//             ))}
//           </ul>
//         </Section>
//       </main>

//       {/* ---------- Contact / Footer ---------- */}
//       <section
//         id="contact"
//         className="relative isolate mt-32 scroll-mt-14 overflow-hidden bg-[#16241a] pb-10 pt-28 text-[#eef2ec] max-md:mt-[72px] max-md:pt-20"
//       >
//         <div className="absolute inset-0 -z-10">
//           <ContourCanvas line={[0.56, 0.68, 0.58]} accent={[0.85, 0.68, 0.3]} strength={0.85} levels={12} edge={-1} />
//         </div>

//         <div className={wrap}>
//           <div className="mb-20 grid gap-12 md:grid-cols-2 md:gap-20">
//             <div>
//               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
//                 <h2 className="mb-5 text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-tight text-[#f1f4ee]">
//                   <span className="block overflow-hidden pb-[.12em]">
//                     <motion.span className="block" variants={maskUp}>Parlons de votre parcelle</motion.span>
//                   </span>
//                 </h2>
//                 <motion.p className="mb-8 max-w-[58ch] text-[#b9c6bb]" variants={fadeUp}>
//                   Un diagnostic, un essai à monter, une formation : écrivez-moi quelques lignes sur votre situation.
//                 </motion.p>
//                 <motion.p variants={fadeUp}>
//                   <a
//                     href={`mailto:${site.email}`}
//                     className="break-all bg-[linear-gradient(#b8923f,#b8923f)] bg-[length:100%_2px] bg-left-bottom bg-no-repeat pb-1 custom-serif text-[clamp(1.4rem,4.4vw,2.2rem)] font-semibold leading-tight text-[#f1f4ee] no-underline transition-[background-size,color] duration-500 hover:bg-[length:0%_2px] hover:text-gold"
//                   >
//                     {site.email}
//                   </a>
//                 </motion.p>
//                 <motion.p className="mt-3 text-[#b9c6bb]" variants={fadeUp}>{site.phone}</motion.p>
//               </motion.div>
//             </div>

//             <motion.div className="flex flex-col justify-end" {...rv(1)}>
//               <p className="mb-4 text-sm text-[#8fa093]">Retrouvez-moi</p>
//               <div className="flex flex-wrap gap-6">
//                 {site.links?.map((l) => {
//                   const Icon = iconFor(l);
//                   return (
//                     <Magnetic key={l.href} strength={0.35}>
//                       <a
//                         href={l.href}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-[#dfe7dc] no-underline transition-colors hover:text-gold"
//                       >
//                         <Icon size={20} />
//                         <span className="text-[.95rem]">{l.label}</span>
//                       </a>
//                     </Magnetic>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           </div>

//           <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#3d5a3f] pt-6">
//             <p className="text-[.85rem] text-[#8fa093]">
//               © {new Date().getFullYear()} {site.name}. Tous droits réservés.
//             </p>
//             <div className="flex gap-6">
//               <a href="#" className="text-[.85rem] text-[#8fa093] no-underline transition-colors hover:text-gold">
//                 Mentions légales
//               </a>
//               <a href="#" className="text-[.85rem] text-[#8fa093] no-underline transition-colors hover:text-gold">
//                 Politique de confidentialité
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </MotionConfig>
//   );
// }

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaResearchgate, FaFacebook, FaTelegram } from 'react-icons/fa';

/* =====================================================================
   Tokens & variants
   ===================================================================== */
const ease = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const maskUp = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.9, ease } },
};
const ruleGrow = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease, delay: 0.25 } },
};
// Révélation au scroll, indépendante pour chaque élément
const rv = (i = 0) => ({
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.85, ease, delay: Math.min(i, 4) * 0.07 },
});

const wrap = 'mx-auto w-full max-w-wrap px-6';
const sectionCls = 'pt-28 scroll-mt-14';
const h2Cls = 'text-[clamp(1.7rem,3.6vw,2.3rem)] mb-3 text-green-800 font-semibold leading-tight';
const h3Cls = 'text-[1.25rem] mb-1 font-semibold leading-tight text-green-800';
const introCls = 'text-muted max-w-[58ch] mb-10';

const socialIcons = {
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  researchgate: FaResearchgate,
  facebook: FaFacebook,
  telegram: FaTelegram,
};
const iconFor = (l) => socialIcons[l.icon] || socialIcons[l.label?.toLowerCase()] || FaTwitter;

/* =====================================================================
   WebGL — champ de courbes de niveau (relief de parcelle)
   Les lignes dérivent lentement, le curseur soulève le terrain
   et fait apparaître des ondulations dorées.

   CORRECTIONS MOBILE :
   1. smoothstep(1.0, 0.6, x) avait edge0 > edge1 : comportement INDÉFINI
      en GLSL (OK sur desktop, corrompu sur beaucoup de GPU mobiles).
   2. fwidth() pouvait valoir 0 -> division par zéro -> NaN -> blocs/artefacts.
   3. Le motif dépendait de la HAUTEUR du canvas : sur mobile le hero est très
      haut, donc le relief était étiré et flou. Tout est maintenant calculé
      en pixels CSS (échelle constante quel que soit l'écran).
   4. DPR plafonné à 1.5 -> rendu flou sur téléphone. Maintenant jusqu'à 2,
      avec un budget de pixels maximum, et épaisseur des lignes en px CSS.
   5. Moins d'octaves de bruit + 30 fps + GPU « low-power » sur mobile.
   6. Sans souris, le halo doré dérive tout seul sur mobile.
   7. Gestion de la perte de contexte WebGL (fréquente sur mobile) et
      plus de loseContext() au démontage (cassait le mode strict de React).
   ===================================================================== */
const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
#define OCT __OCT__
uniform vec2 uRes;      // taille du canvas en pixels appareil
uniform float uDpr;     // pixels appareil par pixel CSS
uniform float uScale;   // pixels CSS par unité de bruit
uniform float uTime;
uniform vec2 uMouse;    // 0..1 dans le canvas (y vers le haut)
uniform vec3 uLine;
uniform vec3 uAccent;
uniform float uStrength;
uniform float uLevels;
uniform float uEdge;
out vec4 outColor;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCT; i++){ v += a * noise(p); p = p * 2.02 + vec2(17.3, 9.1); a *= 0.5; }
  return v;
}

void main(){
  vec2 resCss = uRes / uDpr;                 // taille en px CSS
  vec2 px = gl_FragCoord.xy / uDpr;          // position en px CSS (origine en bas)
  vec2 p = px / uScale;
  vec2 m = uMouse * resCss / uScale;
  float t = uTime * 0.035;

  vec2 q = p * 1.7;
  float h = fbm(q + vec2(t, -t * 0.6) + fbm(q * 0.8 - t) * 0.7);

  float d = distance(p, m);
  h += 0.24 * exp(-d * d * 9.0);                             // relief soulevé
  h += 0.035 * sin(d * 30.0 - uTime * 1.6) * exp(-d * 4.5);  // ondulations

  float x = h * uLevels;
  float w = max(fwidth(x), 1e-4);            // évite la division par zéro (NaN)

  // distances aux lignes exprimées en px CSS -> épaisseur identique partout
  float g = abs(fract(x - 0.5) - 0.5) / w / uDpr;
  float line = 1.0 - smoothstep(0.0, 1.3, g);

  float g2 = abs(fract(x / 5.0 - 0.5) - 0.5) / (w / 5.0) / uDpr;
  float idx = 1.0 - smoothstep(0.0, 2.2, g2);

  float near = exp(-d * d * 6.0);
  float a = (line * 0.30 + idx * 0.50) * uStrength;
  a *= 1.0 + near * 1.3;

  // fondu aux bords sur une distance en px CSS (edge0 < edge1 : valide partout)
  float fl = min(320.0, resCss.y * 0.45);
  float fade = uEdge > 0.0
    ? smoothstep(0.0, fl, px.y)
    : 1.0 - smoothstep(resCss.y - fl, resCss.y, px.y);
  a = clamp(a * fade, 0.0, 1.0);

  vec3 col = mix(uLine, uAccent, clamp(near * 1.4, 0.0, 1.0));
  outColor = vec4(col * a, a);
}`;

// Crée le rendu WebGL sur un canvas et renvoie une fonction de nettoyage.
function createContour(canvas, { line, accent, strength, levels, edge }) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 768;
  const lite = coarse || small;
  const octaves = lite ? 4 : 5;
  const maxDpr = 2;
  const maxPixels = lite ? 2.2e6 : 3.5e6;
  const minFrameMs = coarse ? 1000 / 30 : 0;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG.replace('__OCT__', String(octaves)));
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n) => gl.getUniformLocation(prog, n);
  const uRes = u('uRes'), uDpr = u('uDpr'), uScale = u('uScale');
  const uTime = u('uTime'), uMouse = u('uMouse');
  gl.uniform3f(u('uLine'), ...line);
  gl.uniform3f(u('uAccent'), ...accent);
  gl.uniform1f(u('uStrength'), strength);
  gl.uniform1f(u('uLevels'), levels);
  gl.uniform1f(u('uEdge'), edge);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const target = { x: 0.72, y: 0.52 };
  const cur = { x: 0.72, y: 0.52 };
  const t0 = performance.now();
  let lastDraw = t0;
  let lastFrame = 0;
  let lastPointer = -1e9;
  let raf = 0;
  let running = false;

  const draw = (now = performance.now()) => {
    const dt = Math.max(0, Math.min(64, now - lastDraw));
    lastDraw = now;
    const time = reduce ? 12 : (now - t0) / 1000;

    // Sur écran tactile : le halo doré dérive seul quand personne ne touche
    if (coarse && !reduce && now - lastPointer > 2500) {
      target.x = 0.5 + 0.32 * Math.sin(time * 0.21);
      target.y = 0.5 + 0.28 * Math.sin(time * 0.16 + 1.3);
    }

    const k = Math.min(1, (0.06 * dt) / 16.7);
    cur.x += (target.x - cur.x) * k;
    cur.y += (target.y - cur.y) * k;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, cur.x, cur.y);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - lastFrame < minFrameMs) return;
    lastFrame = now;
    draw(now);
  };
  const start = () => {
    if (running || reduce) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const resize = () => {
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (!cssW || !cssH) return;

    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    if (cssW * cssH * dpr * dpr > maxPixels) {
      dpr = Math.max(1, Math.sqrt(maxPixels / (cssW * cssH)));
    }
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform1f(uDpr, w / cssW);
    // échelle du relief en px CSS : constante, indépendante de la hauteur du hero
    gl.uniform1f(uScale, Math.max(520, Math.min(900, Math.min(cssW, cssH))));
    draw();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
  io.observe(canvas);

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    lastPointer = performance.now();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1 - (e.clientY - r.top) / r.height;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onMove);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buf);
  };
}

function ContourCanvas({
  line = [0.13, 0.3, 0.2],
  accent = [0.78, 0.6, 0.25],
  strength = 1,
  levels = 14,
  edge = 1,
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const opts = { line, accent, strength, levels, edge };

    let teardown = createContour(canvas, opts);

    // Mobile : le navigateur peut détruire le contexte WebGL (veille, onglet en arrière-plan)
    const onLost = (e) => {
      e.preventDefault();
      teardown?.();
      teardown = null;
    };
    const onRestored = () => {
      teardown = createContour(canvas, opts);
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      teardown?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.join(), accent.join(), strength, levels, edge]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}

/* =====================================================================
   Petits composants d'interaction
   ===================================================================== */
function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 220, damping: 16, mass: 0.25 };
  const x = useSpring(mx, cfg);
  const y = useSpring(my, cfg);

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function SplitTitle({ text, className }) {
  const letter = {
    hidden: { y: '110%', rotate: 7 },
    visible: { y: 0, rotate: 0, transition: { duration: 1, ease } },
  };
  return (
    <motion.h1
      className={className}
      aria-label={text}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
    >
      {text.split(' ').map((w, wi) => (
        <span key={wi} aria-hidden className="mr-[.25em] inline-block whitespace-nowrap">
          {[...w].map((ch, ci) => (
            <span key={ci} className="-mb-[.14em] inline-block overflow-hidden pb-[.14em] align-bottom">
              <motion.span className="inline-block origin-bottom-left" variants={letter}>
                {ch}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

function PrimaryButton({ href, children }) {
  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        className="group relative inline-block overflow-hidden bg-green px-[22px] py-[13px] text-[.95rem] font-semibold text-white no-underline"
      >
        <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
        <span className="relative">{children}</span>
      </a>
    </Magnetic>
  );
}

/* Portrait : révélation par masque + inclinaison 3D au curseur */
function Portrait({ src, name }) {
  const ref = useRef(null);
  const ry = useMotionValue(0);
  const rx = useMotionValue(0);
  const cfg = { stiffness: 140, damping: 18 };
  const rotateY = useSpring(ry, cfg);
  const rotateX = useSpring(rx, cfg);

  return (
    <div
      ref={ref}
      className="relative max-md:max-w-[300px]"
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        ry.set(0);
        rx.set(0);
      }}
    >
      <motion.div
        className="absolute inset-0 translate-x-3 translate-y-3 border border-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      />
      <motion.div
        className="relative overflow-hidden bg-[#dfe3da]"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: 'inset(0% 0 0 0)' }}
        transition={{ duration: 1.3, ease, delay: 0.3 }}
      >
        <motion.img
          className="aspect-[4/5] w-full object-cover"
          src={src}
          alt={`Portrait de ${name}`}
          width="480"
          height="600"
          initial={{ scale: 1.35 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease, delay: 0.3 }}
        />
      </motion.div>
    </div>
  );
}

/* =====================================================================
   Barre de progression + jauge de profondeur (le site descend dans le sol)
   ===================================================================== */
function ScrollUI() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const depthRef = useRef(null);
  const fill = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (depthRef.current) depthRef.current.textContent = `${Math.round(v * 120)} cm`;
  });

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gold" style={{ scaleX }} />
      <div
        aria-hidden
        title="Profondeur"
        className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
      >
        <span ref={depthRef} className="text-[.75rem] tabular-nums text-muted">0 cm</span>
        <div className="relative h-40 w-px bg-line">
          <motion.div className="absolute left-0 top-0 w-px bg-green" style={{ height: fill }} />
          <motion.div
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
            style={{ top: fill }}
          />
        </div>
      </div>
    </>
  );
}

/* =====================================================================
   Header : se cache en descendant, section active soulignée
   ===================================================================== */
function Header({ site }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
  });

  useEffect(() => {
    const ids = site.nav.map((n) => n.href).filter((h) => h.startsWith('#')).map((h) => h.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [site.nav]);

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-line bg-bg backdrop-blur-sm"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: hidden ? '-100%' : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className={`${wrap} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3`}>
        <a href="#" className="custom-serif text-[1.15rem] font-semibold leading-tight no-underline">
          {site.name} 
        </a>
        <nav aria-label="Sections" className="flex flex-wrap gap-x-[22px] gap-y-[6px] text-[.92rem]">
          {site.nav.map((n) => {
            const on = active === n.href.slice(1);
            return (
              <a
                key={n.href}
                href={n.href}
                className={`relative no-underline transition-colors hover:text-ink ${on ? 'text-ink' : 'text-muted'}`}
              >
                {n.label}
                {on && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}

/* =====================================================================
   Section (titre masqué + filet doré qui se dessine)
   ===================================================================== */
function Section({ id, title, intro, children }) {
  return (
    <section id={id} className={`${wrap} ${sectionCls}`}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
        <h2 className={h2Cls}>
          <span className="block overflow-hidden pb-[.12em]">
            <motion.span className="block" variants={maskUp}>{title}</motion.span>
          </span>
        </h2>
        <motion.div variants={ruleGrow} className="mb-5 h-[2px] w-16 origin-left bg-gold" />
        {intro && <motion.p className={introCls} variants={fadeUp}>{intro}</motion.p>}
      </motion.div>
      {children}
    </section>
  );
}

/* =====================================================================
   MODIF — Carrousel infini, maintenant DRAGGABLE
   Conserve : défilement automatique, ralentissement au survol,
   accélération selon la vitesse du scroll, inversion de sens.
   Ajoute : glisser à la souris / au doigt, avec inertie.
   Au relâchement, le carrousel repart dans le sens du geste.
   ===================================================================== */
function InfiniteCarousel({ images, base = 55, imgHeight = 300 }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const widthRef = useRef(0);
  const hovering = useRef(false);
  const dir = useRef(-1);
  const x = useMotionValue(0);

  // état du drag
  const drag = useRef({ active: false, startX: 0, startVal: 0, lastX: 0, lastT: 0, vel: 0 });
  const inertia = useRef(0); // px/s, décroît tout seul
  const [grabbing, setGrabbing] = useState(false);

  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });

  const items = useMemo(() => {
    let set = images;
    while (set.length && set.length < 8) set = [...set, ...images];
    return [...set, ...set];
  }, [images]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => (widthRef.current = el.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  const wrapX = (v) => {
    const w = widthRef.current;
    if (!w) return v;
    let n = v % w;
    if (n > 0) n -= w;
    return n;
  };

  useAnimationFrame((_, delta) => {
    const w = widthRef.current;
    if (!w) return;
    // pendant le drag, c'est le doigt/la souris qui pilote
    if (drag.current.active) return;

    const dt = delta / 1000;
    const vf = boost.get();
    if (vf > 0.05) dir.current = -1;
    else if (vf < -0.05) dir.current = 1;

    let move = dir.current * base * dt * (hovering.current ? 0.2 : 1);
    move += move * Math.abs(vf);

    // inertie issue du dernier geste (amortie)
    move += inertia.current * dt;
    inertia.current *= Math.pow(0.02, dt); // ~ s'éteint en 1 seconde

    x.set(wrapX(x.get() + move));
  });

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const d = drag.current;
    d.active = true;
    d.startX = e.clientX;
    d.startVal = x.get();
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.vel = 0;
    inertia.current = 0;
    setGrabbing(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dtm = Math.max(1, now - d.lastT);
    // vitesse lissée (px/s)
    const inst = ((e.clientX - d.lastX) / dtm) * 1000;
    d.vel = d.vel * 0.7 + inst * 0.3;
    d.lastX = e.clientX;
    d.lastT = now;
    x.set(wrapX(d.startVal + (e.clientX - d.startX)));
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setGrabbing(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    // le carrousel repart dans le sens du geste, avec l'élan
    if (Math.abs(d.vel) > 20) dir.current = d.vel > 0 ? 1 : -1;
    inertia.current = Math.max(-3000, Math.min(3000, d.vel));
  };

  return (
    <div
      ref={rootRef}
      className={`relative mt-20 w-full select-none overflow-hidden py-4 ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ touchAction: 'pan-y' }}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <motion.div
        ref={trackRef}
        className="flex items-center gap-2 pr-2 will-change-transform"
        style={{ x, width: 'max-content' }}
      >
        {items.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 overflow-hidden rounded-sm"
            style={{ height: imgHeight, width: imgHeight * (4 / 3) }}
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              draggable={false}
              loading="lazy"
              className="pointer-events-none h-full w-full scale-[1.03] object-cover grayscale-[.35] transition-all duration-700 hover:scale-110 hover:grayscale-0"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* =====================================================================
   Domaines : horizons de sol, un seul ouvert à la fois
   ===================================================================== */
const horizonColors = [
  'bg-[#3a2a1d] text-[#f3ece2]',
  'bg-[#6b4a2f] text-[#f7efe4]',
  'bg-[#a27b4f] text-[#140d06]',
  'bg-[#d6bf94] text-[#140d06]',
];

function Horizons({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <ol className="grid">
      {items.map((e, i) => {
        const isOpen = open === i;
        return (
          <motion.li
            key={e.title}
            className={`origin-top overflow-hidden ${horizonColors[i % horizonColors.length]}`}
            initial={{ opacity: 0, scaleY: 0.5, y: 40 }}
            whileInView={{ opacity: 1, scaleY: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease, delay: i * 0.08 }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="relative grid w-full grid-cols-[150px_1fr] gap-6 px-8 py-7 text-left
                         max-md:grid-cols-1 max-md:gap-1 max-md:px-5 max-md:py-[22px]"
            >
              <span className="text-[.92rem] opacity-80">{e.depth}</span>
              <span className="block pr-8">
                <span className="block text-[1.25rem] font-semibold leading-tight">{e.title}</span>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      key="content"
                      className="block overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease }}
                    >
                      <span className="block max-w-[58ch] pt-2">{e.text}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <motion.span
                aria-hidden
                className="absolute right-6 top-6 text-2xl leading-none"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.4, ease }}
              >
                +
              </motion.span>
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}


/* =====================================================================
   Parcours : design en cartes + ligne verte qui se remplit au scroll
   ===================================================================== */
function Timeline({ items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const height = useTransform(smooth, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative pl-10 max-md:pl-8">
      {/* Rail : ligne grise de fond */}
      <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-gray-300 max-md:left-[5px]">
        {/* Ligne verte qui se remplit au scroll */}
        <motion.div
          className="absolute left-0 top-0 w-full origin-top bg-green-600"
          style={{ height }}
        />
        {/* Pointe lumineuse */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 z-10 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600 shadow-[0_0_0_4px_rgba(19,48,32,.15)]"
          style={{ top: height }}
        />
      </div>

      <ul className="grid gap-12">
        {items.map((c) => (
          <motion.li
            key={c.years + c.role}
            className="relative"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.8, ease }}
          >
         

            <p className="mb-3 inline--3 py-[px] custom-serif text-[.9rem] font-semibold leading-tight text-green-950">
              {c.years}
            </p>

            <div className=" bg-white px- py5 transition-shadow duration-500 hover max-md:px-">
              <h3 className={h3Cls}>{c.role}</h3>
              <p className="mb-3 text-[.95rem] font-medium text-yellow-700">{c.org}</p>
              <p className="max-w-[64ch] text-gray-500">{c.text}</p>

              {c.points?.length > 0 && (
                <ul className="mt-4 grid gap-2">
                  {c.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[.95rem]">
                      <span aria-hidden className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-yellow-600" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}

              
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* =====================================================================
   Réalisations : au survol, les autres s'effacent
   ===================================================================== */
function Projects({ items }) {
  const [hover, setHover] = useState(null);
  return (
    <ul className="grid gap-10" onPointerLeave={() => setHover(null)}>
      {items.map((p, i) => (
        <motion.li key={p.title} {...rv(i)} onPointerEnter={() => setHover(i)}>
          <motion.div
            className="grid grid-cols-[150px_1fr] gap-6 max-md:grid-cols-1 max-md:gap-[2px]"
            animate={{ opacity: hover === null || hover === i ? 1 : 0.35, x: hover === i ? 8 : 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <p className="pt-[3px] custom-serif text-[1.6rem] font-semibold leading-tight text-green">{p.year}</p>
            <div>
              <h3 className={h3Cls}>
                <span className="relative inline-block">
                  {p.title}
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gold"
                    animate={{ scaleX: hover === i ? 1 : 0 }}
                    transition={{ duration: 0.45, ease }}
                  />
                </span>
              </h3>
              <p className="text-[.9rem] text-muted">{p.place}</p>
              <p className="mt-1 max-w-[62ch] text-muted">{p.text}</p>
            </div>
          </motion.div>
        </motion.li>
      ))}
    </ul>
  );
}

/* =====================================================================
   Page
   ===================================================================== */
export default function HomeClient({ site, articles, galleryImages = [] }) {
  const defaultGallery = Array.from({ length: 15 }, (_, i) => ({
    src: ['/poules.jpg', '/track.jpg', '/agro.png'][i % 3],
    alt: 'Champ agricole',
  }));
  const gallery = galleryImages.length > 0 ? galleryImages : defaultGallery;

  return (
    <MotionConfig reducedMotion="user">
      <ScrollUI />
      <Header site={site} />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <ContourCanvas />
          </div>

          <div
            className={`${wrap} grid min-h-[calc(100svh-57px)] items-center gap-16 py-16
                        md:grid-cols-[1.25fr_.75fr] max-md:grid-cols-1 max-md:gap-9 max-md:py-10`}
          >
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <SplitTitle
                text={site.name}
                className="custom-serif text-[clamp(2rem,6vw,4rem)] font-semibold leading-tigh tacking-[-.015em]"
              />

              <motion.p className="mb-6 mt-2 custom-serif text-[1.3rem] leading-tight text-green" variants={fadeUp}>
                {site.role}
              </motion.p>
              <motion.p className="max-w-[54ch] text-[1.12rem]" variants={fadeUp}>{site.intro}</motion.p>
              <motion.p className="mt-4 text-muted" variants={fadeUp}>{site.place}</motion.p>

              <motion.p className="mt-4" variants={fadeUp}>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-green no-underline transition-colors hover:text-ink"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {site.email}
                </a>
              </motion.p>

              {/* MODIF : bouton + « Me contacter » + réseaux sociaux sur UNE seule ligne
                  (elle passe à la ligne seulement si l'écran est trop étroit) */}
              <motion.div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4" variants={fadeUp}>
                <a
                  href="#contact"
                  className="underlin decoration-god decoration-2 underline-offset-[5px] transition-[text-underline-offset] hover:underline-offset-[9px]"
                >
                  Mes projets
                </a>
                <a
                  href="#contact"
                  className="underline decoration-god decoration-2 underline-offset-[5px] transition-[text-underline-offset] hover:underline-offset-[9px]"
                >
                  Me contacter →
                </a>

                <span aria-hidden className="hidden h-6 w-px bg-line sm:block" />

                <div className="flex items-center gap-2">
                  {site.links?.map((l) => {
                    const Icon = iconFor(l);
                    return (
                      <Magnetic key={l.href} strength={0.5}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={l.label}
                          title={l.label}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-green transition-colors duration-300 hover:border-green hover:bg-green-700 hover:text-white"
                        >
                          <Icon size={18} />
                        </a>
                      </Magnetic>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            <Portrait src={site.photo} name={site.name} />
          </div>
        </section>

        
                {/* ---------- Carrousel ---------- */}
        <div className='px-'>
          <h1 className='text-green-800 text-4xl'>
            Gallerie de projets
          </h1>
        <InfiniteCarousel images={gallery} />
         <a
                  href="/projets"
                  className="underline decoration-god decoration-2 underline-offset-[5px] transition-[text-underline-offset] hover:underline-offset-[9px]"
                >
                  Voir tous les images  →
                </a>
        </div>
       

        {/* ---------- Domaines ---------- */}
        <Section
          id="domaines"
          title="Domaines d'intervention"
          intro="Je travaille de la surface de la parcelle vers le bas : ce qui pousse, ce qui nourrit, ce qui structure, ce qui irrigue."
        >
          <Horizons items={site.expertise} />
        </Section>

        {/* ---------- Parcours ---------- */}
        <Section
          id="parcours"
          title="Parcours"
          intro="Plus de dix ans entre recherche appliquée, conseil en chambre d'agriculture et accompagnement indépendant, toujours à partir du terrain."
        >
          <Timeline items={site.career} />
        </Section>

        {/* ---------- Réalisations ---------- */}
        <Section id="realisations" title="Réalisations">
          <Projects items={site.projects} />
        </Section>

        {/* ---------- Publications ---------- */}
        <Section
          id="publications"
          title="Publications"
          intro="Notes de terrain et retours d'essais, écrits pour les exploitants et les techniciens."
        >
          <ul className="grid">
            {articles.map((a, i) => (
              <motion.li
                key={a.slug}
                {...rv(i)}
                className="group relative grid grid-cols-[1fr_190px] gap-7 border-t border-line py-7 last:border-b
                           max-md:grid-cols-1 max-md:gap-4"
              >
                <div>
                  <p className="text-[.9rem] text-muted">{a.dateLabel}</p>
                  <h3 className="mb-2 mt-[2px] custom-serif text-[1.4rem] font-semibold leading-tight">
                    <Link
                      href={`/articles/${a.slug}`}
                      className="no-underline after:absolute after:inset-0 after:content-['']"
                    >
                      <span className="bg-[linear-gradient(#b8923f,#b8923f)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:bg-[length:100%_2px]">
                        {a.title}
                      </span>
                    </Link>
                  </h3>
                  <p className="max-w-[60ch] text-muted">{a.excerpt}</p>
                </div>
                {a.cover && (
                  <motion.div
                    className="overflow-hidden max-md:order-first"
                    initial={{ clipPath: 'inset(0 0 100% 0)' }}
                    whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 1, ease, delay: 0.15 }}
                  >
                    <img
                      className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                      src={a.cover}
                      alt=""
                    />
                  </motion.div>
                )}
              </motion.li>
            ))}
          </ul>
        </Section>
      </main>

      {/* ---------- Contact / Footer ---------- */}
      <section
        id="contact"
        className="relative isolate mt-32 scroll-mt-14 overflow-hidden bg-[#16241a] pb-10 pt-28 text-[#eef2ec] max-md:mt-[72px] max-md:pt-20"
      >
        <div className="absolute inset-0 -z-10">
          <ContourCanvas line={[0.56, 0.68, 0.58]} accent={[0.85, 0.68, 0.3]} strength={0.85} levels={12} edge={-1} />
        </div>

        <div className={wrap}>
          <div className="mb-20 grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
                <h2 className="mb-5 text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-tight text-[#f1f4ee]">
                  <span className="block overflow-hidden pb-[.12em]">
                    <motion.span className="block" variants={maskUp}>Parlons de votre parcelle</motion.span>
                  </span>
                </h2>
                <motion.p className="mb-8 max-w-[58ch] text-[#b9c6bb]" variants={fadeUp}>
                  Un diagnostic, un essai à monter, une formation : écrivez-moi quelques lignes sur votre situation.
                </motion.p>
                <motion.p variants={fadeUp}>
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all bg-[linear-gradient(#b8923f,#b8923f)] bg-[length:100%_2px] bg-left-bottom bg-no-repeat pb-1 custom-serif text-[clamp(1.4rem,4.4vw,2.2rem)] font-semibold leading-tight text-[#f1f4ee] no-underline transition-[background-size,color] duration-500 hover:bg-[length:0%_2px] hover:text-gold"
                  >
                    {site.email}
                  </a>
                </motion.p>
                <motion.p className="mt-3 text-[#b9c6bb]" variants={fadeUp}>{site.phone}</motion.p>
              </motion.div>
            </div>

            <motion.div className="flex flex-col justify-end" {...rv(1)}>
              <p className="mb-4 text-sm text-[#8fa093]">Retrouvez-moi</p>
              <div className="flex flex-wrap gap-6">
                {site.links?.map((l) => {
                  const Icon = iconFor(l);
                  return (
                    <Magnetic key={l.href} strength={0.35}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#dfe7dc] no-underline transition-colors hover:text-gold"
                      >
                        <Icon size={20} />
                        <span className="text-[.95rem]">{l.label}</span>
                      </a>
                    </Magnetic>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#3d5a3f] pt-6">
            <p className="text-[.85rem] text-[#8fa093]">
              © {new Date().getFullYear()} {site.name}. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[.85rem] text-[#8fa093] no-underline transition-colors hover:text-gold">
                Mentions légales
              </a>
              <a href="#" className="text-[.85rem] text-[#8fa093] no-underline transition-colors hover:text-gold">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}