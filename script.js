/* =====================
   Portfolio — GSAP Animations
   ===================== */

gsap.registerPlugin(ScrollTrigger);

/* =====================
   Loader
   ===================== */
(function initLoader() {
    const loader = document.getElementById('loader');
    const numEl  = document.getElementById('loader-num');
    const barEl  = document.getElementById('loader-bar');

    let count = 0;
    const duration = 1600;
    const interval = 30;
    const steps = duration / interval;

    const tick = setInterval(() => {
        count = Math.min(100, count + Math.ceil(100 / steps) + Math.floor(Math.random() * 3));
        if (count >= 100) {
            count = 100;
            clearInterval(tick);
            endLoader();
        }
        numEl.textContent = count;
        barEl.style.width = count + '%';
    }, interval);

    function endLoader() {
        gsap.to(loader, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
            delay: 0.2,
            onComplete: () => {
                loader.style.display = 'none';
                startHeroAnim();
            }
        });
    }
})();

/* =====================
   Custom Cursor
   ===================== */
(function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    let mx = 0, my = 0;
    let fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        gsap.to(cursor, { x: mx, y: my, duration: 0.08, ease: 'none' });
    });

    (function loop() {
        fx += (mx - fx) * 0.1;
        fy += (my - fy) * 0.1;
        gsap.set(follower, { x: fx, y: fy });
        requestAnimationFrame(loop);
    })();

    const hoverEls = document.querySelectorAll('a, button, .project-card');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, { scale: 2.2, opacity: 0.6, duration: 0.35, ease: 'power2.out' });
            gsap.to(cursor,   { scale: 0.4, duration: 0.25 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' });
            gsap.to(cursor,   { scale: 1, duration: 0.25 });
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
    });
})();

/* =====================
   Text Scramble
   ===================== */
function scrambleText(el, finalText, delay = 0) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    let frame = 0;
    const totalFrames = finalText.length * 4;

    setTimeout(() => {
        const tick = setInterval(() => {
            el.textContent = finalText
                .split('')
                .map((ch, i) => {
                    if (i < frame / 4) return ch;
                    if (ch === ' ' || ch === '.') return ch;
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            frame++;
            if (frame >= totalFrames) {
                el.textContent = finalText;
                clearInterval(tick);
            }
        }, 28);
    }, delay);
}

/* =====================
   Hero entrance animation
   ===================== */
function startHeroAnim() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl
        .from('#nav', {
            y: -20,
            opacity: 0,
            duration: 0.9
        })
        .from('.hero__label', {
            y: 24,
            opacity: 0,
            duration: 0.8
        }, '-=0.5')
        .from('.hero__title-inner', {
            y: '110%',
            duration: 1.1,
            stagger: 0.1,
            ease: 'power4.out',
            onComplete: () => {
                // scramble each title word after slide-in
                document.querySelectorAll('.hero__title-inner').forEach((el, i) => {
                    const raw = el.dataset.text;
                    if (raw) scrambleText(el, raw, i * 180);
                });
            }
        }, '-=0.5')
        .from('.hero__desc', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.7')
        .from('.hero__cta .btn', {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1
        }, '-=0.6')
        .from('.hero__scroll', {
            opacity: 0,
            duration: 0.6
        }, '-=0.4')
        .from('.hero__bg-text', {
            opacity: 0,
            x: 60,
            duration: 1.2,
            ease: 'power3.out'
        }, '-=0.8');
}

/* =====================
   Mobile Menu
   ===================== */
(function initMobileMenu() {
    const burger     = document.getElementById('nav-burger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!burger || !mobileMenu) return;

    function openMenu() {
        burger.classList.add('open');
        burger.setAttribute('aria-label', 'Fechar menu');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        // stagger links in
        gsap.from('.mobile-menu__link', {
            x: 40, opacity: 0, duration: 0.5,
            ease: 'power3.out', stagger: 0.07, delay: 0.1
        });
    }

    function closeMenu() {
        burger.classList.remove('open');
        burger.setAttribute('aria-label', 'Abrir menu');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
})();

/* =====================
   Marquee — pause on hover
   ===================== */
(function initMarquee() {
    const track = document.querySelector('.marquee__track');
    if (!track) return;
    track.addEventListener('mouseenter', () => {
        gsap.to(track, { animationPlayState: 'paused', duration: 0 });
        track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
})();

/* =====================
   Scroll Animations — Section Headers
   ===================== */
document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
    });
});

/* =====================
   Scroll Animations — Project Cards
   ===================== */
document.querySelectorAll('.project-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 88%',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.07
    });
});

/* =====================
   Scroll Animations — About
   ===================== */
gsap.from('.about__lead', {
    scrollTrigger: { trigger: '.about__lead', start: 'top 80%' },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.about__body', {
    scrollTrigger: { trigger: '.about__body', start: 'top 85%' },
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.15
});

gsap.from('.about__cv-link', {
    scrollTrigger: { trigger: '.about__cv-link', start: 'top 90%' },
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.25
});

gsap.from('.skills-col', {
    scrollTrigger: { trigger: '.about__skills', start: 'top 80%' },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15
});

gsap.from('.about__stat', {
    scrollTrigger: { trigger: '.about__stats', start: 'top 85%' },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12
});

/* =====================
   Counter animation — stats
   ===================== */
document.querySelectorAll('.about__stat-num').forEach(el => {
    const target = parseInt(el.textContent);
    const suffix = el.textContent.replace(/[0-9]/g, '');

    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    el.textContent = Math.ceil(obj.val) + suffix;
                }
            });
        }
    });
});

/* =====================
   Scroll Animations — Contact
   ===================== */
gsap.from('.contact__lead', {
    scrollTrigger: { trigger: '.contact__lead', start: 'top 80%' },
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
});

gsap.from('.contact__email', {
    scrollTrigger: { trigger: '.contact__email', start: 'top 85%' },
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power4.out',
    delay: 0.1
});

gsap.from('.contact__social-link', {
    scrollTrigger: { trigger: '.contact__socials', start: 'top 90%' },
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1
});

gsap.from('.contact__location', {
    scrollTrigger: { trigger: '.contact__footer', start: 'top 90%' },
    y: 15,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.3
});

/* =====================
   Parallax — hero title
   ===================== */
gsap.to('.hero__title', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 80,
    ease: 'none'
});

gsap.to('.hero__bg-text', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 60,
    x: 20,
    ease: 'none'
});

/* =====================
   Navbar — hide/show on scroll
   ===================== */
(function initNavScroll() {
    let lastY = 0;
    const nav = document.getElementById('nav');

    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
            const currentY = self.scroller.scrollY || window.scrollY;
            const scrollingDown = currentY > lastY && currentY > 100;

            gsap.to(nav, {
                y: scrollingDown ? -100 : 0,
                duration: 0.4,
                ease: 'power2.inOut'
            });

            lastY = currentY;
        }
    });
})();
