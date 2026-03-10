import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';

// ─── Interfaces ──────────────────────────────────────────────
interface Counter {
  label: string;
  target: number;
  current: number;
  suffix: string;
}

interface Project {
  num: string;
  tags: string[];
  title: string;
  desc: string;
  color: string;
  type: string;
  palette: string[];
}

interface Experience {
  date: string;
  role: string;
  company: string;
  desc: string;
  stack: string[];
}

@Component({
  selector: 'app-home',
  imports: [NgForOf],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home implements OnInit, AfterViewInit, OnDestroy {

  // ── Template refs ──────────────────────────────────────────
  @ViewChild('cursor')       cursorEl!:       ElementRef<HTMLElement>;
  @ViewChild('cursorTrail')  cursorTrailEl!:  ElementRef<HTMLElement>;
  @ViewChild('scrollProgress') scrollProgressEl!: ElementRef<HTMLElement>;

  // ── State ──────────────────────────────────────────────────
  isScrolled = false;

  // ── Data ───────────────────────────────────────────────────
  skills: { icon: string; name: string }[] = [
    { icon: '⚡', name: 'Angular' },
    { icon: '⚛️', name: 'React' },
    { icon: '🎨', name: 'SCSS / CSS' },
    { icon: '🔷', name: 'TypeScript' },
    { icon: '🖌️', name: 'Figma' },
    { icon: '✨', name: 'Animations' },
    { icon: '📐', name: 'UI / UX' },
    { icon: '♿', name: 'A11y' },
    { icon: '🚀', name: 'Performance' },
  ];

  // counters: Counter[] = [
  //   { label: 'Años exp.',   target: 5,  current: 0, suffix: '+' },
  //   { label: 'Proyectos',   target: 30, current: 0, suffix: '+' },
  //   { label: 'Lighthouse',  target: 98, current: 0, suffix: ''  },
  // ];

  projects: Project[] = [
    {
      num: '01',
      tags: ['Angular', 'SCSS', 'Figma'],
      title: 'Orion Design System',
      desc: 'Sistema de diseño con +60 componentes accesibles, tematización dinámica y documentación interactiva.',
      color: 'linear-gradient(90deg, #ff6b6b, #ffd166)',
      type: 'Design System',
      palette: ['#ff6b6b', '#ffd166', '#fff5e6', '#1a1a2e'],
    },
    {
      num: '02',
      tags: ['React', 'Framer Motion', 'Tailwind'],
      title: 'Nova Landing Page',
      desc: 'Landing de producto SaaS con animaciones 3D, scroll storytelling y conversión optimizada.',
      color: 'linear-gradient(90deg, #9b5de5, #118ab2)',
      type: 'Landing Page',
      palette: ['#9b5de5', '#118ab2', '#c0a0ff', '#0f0f1a'],
    },
    {
      num: '03',
      tags: ['Next.js', 'GSAP', 'Three.js'],
      title: 'Lumina Portfolio',
      desc: 'Portfolio creativo con canvas WebGL, transiciones de página fluidas y modo oscuro/claro.',
      color: 'linear-gradient(90deg, #06d6a0, #118ab2)',
      type: 'Portfolio',
      palette: ['#06d6a0', '#118ab2', '#e0fff8', '#0a1628'],
    },
    {
      num: '04',
      tags: ['Angular', 'D3.js', 'SCSS'],
      title: 'Pulse Dashboard',
      desc: 'Dashboard de analytics con gráficos interactivos, filtros en tiempo real y responsive design.',
      color: 'linear-gradient(90deg, #ffd166, #ff6b6b)',
      type: 'Dashboard',
      palette: ['#ffd166', '#ff6b6b', '#fff3cd', '#1c1c28'],
    },
    {
      num: '05',
      tags: ['React', 'CSS Modules', 'Storybook'],
      title: 'Echo UI Kit',
      desc: 'Librería de componentes React con +40 elementos, Storybook y soporte de temas CSS variables.',
      color: 'linear-gradient(90deg, #c77dff, #9b5de5)',
      type: 'UI Library',
      palette: ['#c77dff', '#9b5de5', '#f5e6ff', '#16101e'],
    },
    {
      num: '06',
      tags: ['Vue.js', 'CSS Animations', 'Vite'],
      title: 'Bloom E-commerce',
      desc: 'Tienda online con micro-interacciones, carrito animado, filtros fluidos y UX mobile-first.',
      color: 'linear-gradient(90deg, #06d6a0, #9b5de5)',
      type: 'E-commerce',
      palette: ['#06d6a0', '#9b5de5', '#d4f5ed', '#0d1117'],
    },
  ];

  experience: Experience[] = [
    {
      date: '2024 — Presente',
      role: 'Junior Fullstack Developer',
      company: '— (Layner) Hospital Barros luco trudeu',
      desc: 'Formo parte del equipo de Desarrollo del Departamento de Gestión en Tecnologías de la Información del Hospital Barros Luco Trudeau, donde participo en la creación de nuevos proyectos y en el mantenimiento de las aplicaciones web institucionales. Mi trabajo abarca tanto el desarrollo de interfaces de usuario modernas y responsivas como la lógica del lado del servidor, contribuyendo a soluciones digitales que apoyan la gestión y operación del hospital.',
      stack: ['Angular', 'SCSS', 'CSS', 'React', 'TypeScript', 'JavaScript', 'HTML'],
    },
    {
      date: '2022 — 2024',
      role: 'Analista QA',
      company: '— (Layner) Hospital Barros luco trudeu',
      desc: 'Formé parte del equipo de Control de Calidad (QA) en el Departamento de Gestión en Tecnologías de la Información del Hospital Barros Luco Trudeau. En este rol, participé activamente en la implementación de pruebas orientadas a garantizar la calidad, estabilidad y fiabilidad de los sistemas de información hospitalaria, contribuyendo a que las aplicaciones cumplieran con los estándares requeridos antes de su despliegue en producción.',
      stack: ['Junit', 'Selenium', 'Squash'],
    }
  ];

  // ── Private ────────────────────────────────────────────────
  private mouseX = 0;
  private mouseY = 0;
  private trailTimer: ReturnType<typeof setTimeout> | null = null;
  private counterIntervals: ReturnType<typeof setInterval>[] = [];
  private intersectionObservers: IntersectionObserver[] = [];
  private domListeners: (() => void)[] = [];

  constructor(private renderer: Renderer2) {}

  // ══════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCursor();
    this.initReveal();
    // this.initCounters();
  }

  ngOnDestroy(): void {
    this.domListeners.forEach(fn => fn());
    this.counterIntervals.forEach(id => clearInterval(id));
    this.intersectionObservers.forEach(obs => obs.disconnect());
    if (this.trailTimer) clearTimeout(this.trailTimer);
  }

  // ══════════════════════════════════════════════════════════
  // HOST LISTENERS
  // ══════════════════════════════════════════════════════════
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Nav style
    this.isScrolled = window.scrollY > 50;

    // Scroll progress bar
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (this.scrollProgressEl) {
      this.renderer.setStyle(this.scrollProgressEl.nativeElement, 'width', `${pct}%`);
    }
  }

  // ══════════════════════════════════════════════════════════
  // CURSOR
  // ══════════════════════════════════════════════════════════
  private initCursor(): void {
    // Mouse move → update cursor & trail
    const onMove = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.renderer.setStyle(this.cursorEl.nativeElement, 'left', `${this.mouseX - 6}px`);
      this.renderer.setStyle(this.cursorEl.nativeElement, 'top',  `${this.mouseY - 6}px`);

      if (this.trailTimer) clearTimeout(this.trailTimer);
      this.trailTimer = setTimeout(() => {
        this.renderer.setStyle(this.cursorTrailEl.nativeElement, 'left', `${this.mouseX - 15}px`);
        this.renderer.setStyle(this.cursorTrailEl.nativeElement, 'top',  `${this.mouseY - 15}px`);
      }, 80);
    });

    // Hover enlargement on interactive elements
    const interactiveSelector = 'a, button, .project-card, .skill-chip';

    const onOver = this.renderer.listen('document', 'mouseover', (e: Event) => {
      const target = e.target as Element;
      if (target.closest(interactiveSelector)) {
        this.renderer.setStyle(this.cursorEl.nativeElement, 'transform', 'scale(2.5)');
        this.renderer.setStyle(this.cursorEl.nativeElement, 'borderColor', '#00ff88');
      }
    });

    const onOut = this.renderer.listen('document', 'mouseout', (e: Event) => {
      const target = e.target as Element;
      if (target.closest(interactiveSelector)) {
        this.renderer.setStyle(this.cursorEl.nativeElement, 'transform', 'scale(1)');
        this.renderer.setStyle(this.cursorEl.nativeElement, 'borderColor', '#00d4ff');
      }
    });

    this.domListeners.push(onMove, onOver, onOut);
  }

  // ══════════════════════════════════════════════════════════
  // REVEAL ON SCROLL (IntersectionObserver)
  // ══════════════════════════════════════════════════════════
  private initReveal(): void {
    // Add .reveal class to target elements
    const targets = document.querySelectorAll<HTMLElement>(
      '.project-card, .exp-item, .skill-chip, .code-block, .about-text'
    );

    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // Stagger via transition-delay
            el.style.transitionDelay = `${i * 0.06}s`;
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach(el => observer.observe(el));
    this.intersectionObservers.push(observer);
  }

  // ══════════════════════════════════════════════════════════
  // COUNTERS (IntersectionObserver + setInterval)
  // ══════════════════════════════════════════════════════════
  // private initCounters(): void {
  //   const counterEls = document.querySelectorAll<HTMLElement>('.counter__num');

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry, idx) => {
  //         if (!entry.isIntersecting) return;

  //         const counter = this.counters[idx];
  //         if (!counter) return;

  //         const inc = Math.ceil(counter.target / 40);

  //         const interval = setInterval(() => {
  //           counter.current = Math.min(counter.current + inc, counter.target);
  //           if (counter.current >= counter.target) clearInterval(interval);
  //         }, 40);

  //         this.counterIntervals.push(interval);
  //         observer.unobserve(entry.target);
  //       });
  //     },
  //     { threshold: 0.5 }
  //   );

  //   counterEls.forEach(el => observer.observe(el));
  //   this.intersectionObservers.push(observer);
  // }

  // ══════════════════════════════════════════════════════════
  // SMOOTH SCROLL HELPER
  // ══════════════════════════════════════════════════════════
  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

}

