document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger Plugin
    gsap.registerPlugin(ScrollTrigger);

    /* --- Robust Image Lazy-Loading Handler --- */
    const lazyImages = document.querySelectorAll('img.lazy-image');
    lazyImages.forEach(img => {
        const placeholder = img.nextElementSibling;
        
        function setLoaded() {
            img.classList.add('loaded');
            img.classList.remove('error');
            if (placeholder && placeholder.classList.contains('image-placeholder')) {
                placeholder.style.display = 'none';
            }
        }

        function setError() {
            img.classList.add('error');
            img.classList.remove('loaded');
            if (placeholder && placeholder.classList.contains('image-placeholder')) {
                placeholder.style.display = '';
            }
        }

        // Check if image is already loaded (cached)
        if (img.complete && img.naturalWidth > 0) {
            setLoaded();
        } else {
            img.addEventListener('load', setLoaded);
            img.addEventListener('error', setError);
        }
    });

    /* --- GSAP Initial Entrance Animations --- */
    const tlEntrance = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Header fade down
    tlEntrance.from('#main-header', {
        y: -100,
        opacity: 0,
        duration: 1.5
    });

    // 2. Background massive text zoom-in and fade-in
    tlEntrance.from('.hero-bg-text', {
        scale: 1.15,
        opacity: 0,
        duration: 2.2,
        ease: 'power3.out'
    }, '-=1.0');

    // 3. Central statue bust and pedestal plate animation
    tlEntrance.from('.pedestal-plate', {
        scale: 0,
        opacity: 0,
        duration: 1.6
    }, '-=1.5');

    tlEntrance.from('.main-bust-img, .main-bust-placeholder', {
        y: 100,
        scale: 0.92,
        opacity: 0,
        duration: 2.0
    }, '-=1.5');

    tlEntrance.from('.statue-glow', {
        scale: 0.5,
        opacity: 0,
        duration: 2.2
    }, '-=1.8');

    // 4. Left content layout staggered fade-in
    tlEntrance.from('.hero-left .subtitle-gold, .hero-left .hero-title, .hero-left .hero-columns, .hero-left .read-more-btn', {
        y: 40,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12
    }, '-=1.8');

    // 5. Right thumbnail cards staggered slide-in
    tlEntrance.from('.hero-right .lesson-carousel-title, .hero-right .thumb-card', {
        x: 60,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12
    }, '-=1.8');

    // 6. Hero footer fade-in
    tlEntrance.from('.hero-footer', {
        y: 50,
        opacity: 0,
        duration: 1.2
    }, '-=1.2');


    /* --- Interactive Mouse Parallax Effect --- */
    const heroSection = document.getElementById('hero');
    const parallaxBust = document.querySelector('.main-bust-container');
    const parallaxGlow = document.querySelector('.statue-glow');
    const parallaxBgText = document.querySelector('.hero-bg-text');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Calculate offsets
            const moveX = (clientX - width / 2) / (width / 2); // Value between -1 and 1
            const moveY = (clientY - height / 2) / (height / 2);

            gsap.to(parallaxBust, {
                x: moveX * 15,
                y: moveY * 10,
                duration: 1,
                ease: 'power2.out'
            });

            gsap.to(parallaxGlow, {
                x: moveX * 25,
                y: moveY * 20,
                duration: 1.2,
                ease: 'power2.out'
            });

            gsap.to(parallaxBgText, {
                x: moveX * -30,
                y: (moveY * -15) + (height * 0.02), // offset by height slightly
                duration: 1.5,
                ease: 'power2.out'
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to([parallaxBust, parallaxGlow, parallaxBgText], {
                x: 0,
                y: 0,
                duration: 1.5,
                ease: 'power3.out'
            });
        });
    }


    /* --- GSAP ScrollTrigger Scroll Animations --- */
    
    // Draw background lines on scroll
    gsap.utils.toArray('.grid-line').forEach((line, index) => {
        gsap.fromTo(line, 
            { height: '0%' },
            { 
                height: '100%', 
                duration: 2, 
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5
                }
            }
        );
    });

    // Reveal rotated indicators on scroll
    gsap.utils.toArray('.rotated-indicator').forEach(indicator => {
        gsap.from(indicator, {
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: indicator.parentElement,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate section divider arcs on scroll
    gsap.from('.arc-line-svg path', {
        strokeDasharray: '10 1000',
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#popular',
            start: 'top 85%'
        }
    });

    // Stagger reveal popular philosopher cards
    gsap.from('.philosopher-card', {
        y: 80,
        opacity: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.philosophers-carousel',
            start: 'top 80%'
        }
    });

    // Practices section animations
    gsap.from('.practices-header', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#practices',
            start: 'top 80%'
        }
    });

    gsap.from('.practices-left', {
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.practices-content-container',
            start: 'top 75%'
        }
    });

    gsap.from('.practices-center', {
        y: 60,
        opacity: 0,
        duration: 1.8,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.practices-content-container',
            start: 'top 75%'
        }
    });

    gsap.from('.practices-right', {
        x: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.practices-content-container',
            start: 'top 75%'
        }
    });

    // Why Philosophy section reveal animations
    gsap.from('.why-left', {
        scale: 0.95,
        x: -100,
        opacity: 0,
        duration: 2.0,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '#why-philosophy',
            start: 'top 70%'
        }
    });

    gsap.from('.why-right', {
        x: 100,
        opacity: 0,
        duration: 1.8,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '#why-philosophy',
            start: 'top 70%'
        }
    });


    /* --- Smooth Scrolling for Navigation --- */
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* --- Active Navigation Link on Scroll --- */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });


    /* --- Interactive Hero Carousel (Thumbnail Clicks) --- */
    const heroThumbcards = document.querySelectorAll('.thumb-card');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescMain = document.querySelector('.hero-description.main-desc');
    const heroDescSub = document.querySelector('.hero-description.sub-desc');
    const heroBustImg = document.querySelector('.main-bust-img');

    const philosopherData = {
        marcus: {
            title: 'Eudaimonia',
            mainDesc: "Stoicism is a school of Hellenistic philosophy, founded by Zeno of Citium in Athens in the early 3rd century BC. It is a philosophy of personal virtue ethics informed by its system of logic and its views on the natural world.",
            subDesc: "Virtue is the only good for human beings, and those external things, such as health, wealth, and pleasure, are not good or bad in themselves (adiaphora), but have value as material for virtue to act upon.",
            src: 'assets/images/hero_marcus_bust_clean.png'
        },
        epictetus: {
            title: 'Epictetus',
            mainDesc: "Born a slave, Epictetus taught that philosophy is a way of life, not just an academic discipline. He focused heavily on the 'dichotomy of control'—understanding what is within our power and accepting what is not.",
            subDesc: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command.",
            src: 'assets/images/philosopher_epictetus_clean_v2.png'
        },
        chrysippus: {
            title: 'Chrysippus',
            mainDesc: "Chrysippus of Soli was a massive force in systematizing early Stoicism. He was a pioneer in propositional logic, physics, and ethics, writing over 700 treatises to structure the school's core philosophies.",
            subDesc: "He believed that the universe is a rational, unified web of cause and effect governed by deterministic Logos, and that human happiness is achieved by aligning individual reason with cosmic nature.",
            src: 'assets/images/philosopher_chrysippus_clean_v2.png'
        },
        zeno: {
            title: 'Zeno of Citium',
            mainDesc: "Zeno was the founder of Stoicism, establishing the school around 300 BC in Athens. Surviving a catastrophic shipwreck, he arrived in the city and began teaching on the painted colonnade known as the Stoa Poikile.",
            subDesc: "He taught that the highest good is to live in agreement with Nature, which translates to living in accordance with active human reason. Virtue is the sole true good, and passions are diseases of the soul.",
            src: 'assets/images/philosopher_zeno_clean_v2.png'
        }
    };

    heroThumbcards.forEach(card => {
        card.addEventListener('click', () => {
            const phil = card.getAttribute('data-philosopher');
            if (card.classList.contains('active')) return;
            
            // Toggle active card
            heroThumbcards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Animate transition of content using GSAP
            const data = philosopherData[phil];
            
            gsap.timeline()
                .to([heroTitle, heroDescMain, heroDescSub], { opacity: 0, y: 15, duration: 0.3, stagger: 0.05 })
                .to([heroBustImg, '.main-bust-placeholder'], { opacity: 0, y: 30, scale: 0.95, duration: 0.4 }, '-=0.25')
                .add(() => {
                    heroTitle.textContent = data.title;
                    heroDescMain.textContent = data.mainDesc;
                    heroDescSub.textContent = data.subDesc;
                    heroBustImg.classList.remove('loaded', 'error');
                    
                    const placeholder = heroBustImg.nextElementSibling;
                    if (placeholder && placeholder.classList.contains('image-placeholder')) {
                        placeholder.style.display = '';
                    }
                    
                    heroBustImg.src = data.src;
                    
                    // Immediate check if it's already in browser cache
                    if (heroBustImg.complete && heroBustImg.naturalWidth > 0) {
                        heroBustImg.classList.add('loaded');
                        if (placeholder && placeholder.classList.contains('image-placeholder')) {
                            placeholder.style.display = 'none';
                        }
                    }
                })
                .to([heroBustImg, '.main-bust-placeholder'], { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power4.out' })
                .to([heroTitle, heroDescMain, heroDescSub], { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, '-=0.5');
        });
    });


    /* --- Popular Philosophers Carousel Section --- */
    const philCards = document.querySelectorAll('.philosopher-card');
    const philPrevBtn = document.querySelector('.philosophers-carousel .prev-btn');
    const philNextBtn = document.querySelector('.philosophers-carousel .next-btn');
    let currentPhilIndex = 1; // Start with Chrysippus active (index 1)

    function updatePhilCarousel(index) {
        philCards.forEach((card, idx) => {
            if (idx === index) {
                card.classList.add('active');
                gsap.to(card, { scale: 1.05, opacity: 1, duration: 0.5, ease: 'power2.out' });
            } else {
                card.classList.remove('active');
                gsap.to(card, { scale: 0.88, opacity: 0.35, duration: 0.5, ease: 'power2.out' });
            }
        });
    }

    // Initialize layout scales on page load
    updatePhilCarousel(currentPhilIndex);

    philPrevBtn.addEventListener('click', () => {
        currentPhilIndex = (currentPhilIndex - 1 + philCards.length) % philCards.length;
        updatePhilCarousel(currentPhilIndex);
    });

    philNextBtn.addEventListener('click', () => {
        currentPhilIndex = (currentPhilIndex + 1) % philCards.length;
        updatePhilCarousel(currentPhilIndex);
    });

    philCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentPhilIndex = index;
            updatePhilCarousel(currentPhilIndex);
        });

        // Add smooth GSAP hover interactions to avoid transition conflicts
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active')) {
                gsap.to(card, { scale: 0.95, opacity: 0.75, duration: 0.3, ease: 'power2.out' });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                gsap.to(card, { scale: 0.88, opacity: 0.35, duration: 0.3, ease: 'power2.out' });
            }
        });
    });


    /* --- General Practices Section Tab System & Slider --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const theoryDescription = document.getElementById('theory-description');
    const theoryHeading = document.querySelector('.practices-left .panel-heading');
    const goldBustImg = document.querySelector('.gold-bust-img');
    
    const practiceHeading = document.getElementById('practice-heading');
    const practiceText = document.getElementById('practice-text');
    const practiceNumberTitle = document.getElementById('practice-number-title');
    const practiceDotsContainer = document.getElementById('practice-dots');
    
    const practicesArrowPrev = document.querySelector('.practices-right .slider-arrow.prev');
    const practicesArrowNext = document.querySelector('.practices-right .slider-arrow.next');

    // Practices Tab and Slider Content Data
    const practicesData = {
        logic: {
            title: 'Logic Theory',
            desc: 'Stoic logic is a system of proposition logic developed by Chrysippus and other Stoics. It focuses on the study of syllogisms, statements, and semantic relations to achieve clear, objective reasoning about the cosmos. It is a philosophy of personal virtue ethics informed by its system of logic.',
            glowColor: 'rgba(212, 175, 55, 0.18)',
            slides: [
                {
                    title: 'Logic #1',
                    heading: 'Cognitive Impression',
                    text: 'Stoics teach that we must analyze our impressions (phantasiai) before giving assent (synkatathesis). A cognitive impression is one that represents reality so clearly and distinctly that its truth is undeniable. By mastering this, we avoid false judgments.'
                },
                {
                    title: 'Logic #2',
                    heading: 'Dichotomy of Control',
                    text: 'Recognize what is up to us (opinions, impulses, desires) and what is not (body, property, reputation). Focus your mental energy only on what you can control, and accept the rest with serenity.'
                },
                {
                    title: 'Logic #3',
                    heading: 'Assent and Impulse',
                    text: 'Do not react impulsively to external impressions. Give yourself a moment, evaluate the situation objectively with reason, and only then choose a virtuous action.'
                }
            ]
        },
        epistemology: {
            title: 'Epistemology',
            desc: 'Epistemology in Stoicism deals with the nature of knowledge, perception, and truth. Stoics believe that the mind starts as a blank slate and accumulates knowledge through sensory impressions validated by rational testing.',
            glowColor: 'rgba(55, 175, 212, 0.18)',
            slides: [
                {
                    title: 'Epist #1',
                    heading: 'Sensation & Impression',
                    text: 'Sensory organs receive impressions from external objects. These impressions form a physical trace on the soul, which we must evaluate before accepting it as truth.'
                },
                {
                    title: 'Epist #2',
                    heading: 'Comprehension (Katalepsis)',
                    text: 'Knowledge begins with comprehension—a firm, unshakeable grasp of a truth that has been thoroughly tested and found solid by reason.'
                },
                {
                    title: 'Epist #3',
                    heading: 'Systematized Wisdom',
                    text: 'True wisdom (episteme) is a system of secure comprehensions that is completely rational, coherent, and immune to doubt or contradiction.'
                }
            ]
        },
        physics: {
            title: 'Physics & Nature',
            desc: 'Stoic physics is a pantheistic system that views the universe as a single rational, living organism (Logos). Everything is material, interconnected, and governed by deterministic cause and effect.',
            glowColor: 'rgba(55, 212, 110, 0.15)',
            slides: [
                {
                    title: 'Physics #1',
                    heading: 'The Logos',
                    text: 'The universe is ordered by Logos—an active, rational force that permeates all matter and directs the unfolding of the cosmos.'
                },
                {
                    title: 'Physics #2',
                    heading: 'Amor Fati',
                    text: 'Accept all events as necessary and pre-determined by the cosmos. Embrace your fate with joy, knowing it is part of a larger rational order.'
                },
                {
                    title: 'Physics #3',
                    heading: 'Universal Sympathy',
                    text: 'All parts of the universe are interconnected (sympatheia). What affects the whole affects the individual, and vice-versa.'
                }
            ]
        },
        ethics: {
            title: 'Stoic Ethics',
            desc: 'Stoic ethics is centered on the pursuit of virtue (arete) as the sole true good. Living virtuously means living in agreement with nature and reason, which leads to Eudaimonia.',
            glowColor: 'rgba(212, 100, 55, 0.18)',
            slides: [
                {
                    title: 'Ethics #1',
                    heading: 'Virtue is the Only Good',
                    text: 'Wisdom, Courage, Justice, and Temperance are the only true goods. External things like wealth, health, and status are indifferent (adiaphora).'
                },
                {
                    title: 'Ethics #2',
                    heading: 'Preferred Indifferents',
                    text: 'While health and wealth are not moral goods, they are naturally preferred over sickness and poverty, provided they do not compromise virtue.'
                },
                {
                    title: 'Ethics #3',
                    heading: 'The Sage (Sophos)',
                    text: 'The Sage is the hypothetical ideal Stoic who is perfectly rational, completely virtuous, and immune to passions and misfortune.'
                }
            ]
        },
        passion: {
            title: 'Passion Control',
            desc: 'Stoics define passions (pathe) as irrational, unhealthy movements of the soul that arise from false judgments. Freedom from destructive passions (Apatheia) is essential for peace.',
            glowColor: 'rgba(180, 55, 212, 0.15)',
            slides: [
                {
                    title: 'Passion #1',
                    heading: 'The Four Passions',
                    text: 'The primary destructive passions are Distress, Fear, Lust, and Pleasure. They all stem from valuing external things incorrectly.'
                },
                {
                    title: 'Passion #2',
                    heading: 'Apatheia',
                    text: 'Apatheia is not cold apathy, but rather freedom from destructive, irrational emotions. It allows the mind to remain calm, rational, and clear.'
                },
                {
                    title: 'Passion #3',
                    heading: 'Premeditation of Evils',
                    text: 'Visualize potential setbacks (premeditatio malorum) to remove the shock and emotional bite when they actually occur.'
                }
            ]
        },
        love: {
            title: 'Love & Life',
            desc: 'Stoics practice a unique form of love based on cosmopolitanism and mutual flourishing. We are all citizens of the same global city, connected by reason and a duty to support one another.',
            glowColor: 'rgba(212, 55, 120, 0.18)',
            slides: [
                {
                    title: 'Love #1',
                    heading: 'Oikeiosis (Appropriation)',
                    text: 'Expand your circle of concern outward, treating your family, friends, neighbors, and eventually all of humanity as part of yourself.'
                },
                {
                    title: 'Love #2',
                    heading: 'Cosmopolitanism',
                    text: 'View yourself not as a citizen of a single nation, but as a citizen of the world (cosmopolis), bound to help all other rational beings.'
                },
                {
                    title: 'Love #3',
                    heading: 'Unconditional Goodwill',
                    text: 'Love others without demanding anything in return, seeking only their moral improvement and well-being as rational creatures.'
                }
            ]
        }
    };

    let activeTabKey = 'logic';
    let activeSlideIndex = 0;

    function renderSlide(tabKey, slideIdx) {
        const tabData = practicesData[tabKey];
        const slide = tabData.slides[slideIdx];
        
        practiceNumberTitle.textContent = slide.title;
        practiceHeading.textContent = slide.heading;
        practiceText.textContent = slide.text;

        // Render dot indicators
        practiceDotsContainer.innerHTML = '';
        tabData.slides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `dot ${idx === slideIdx ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                if (activeSlideIndex === idx) return;
                activeSlideIndex = idx;
                renderSlide(activeTabKey, activeSlideIndex);
            });
            practiceDotsContainer.appendChild(dot);
        });
    }

    function switchTab(tabKey) {
        if (activeTabKey === tabKey) return;
        activeTabKey = tabKey;
        activeSlideIndex = 0;
        const tabData = practicesData[tabKey];

        // Animate panel transitions with GSAP
        gsap.timeline()
            .to([theoryHeading, theoryDescription, practiceNumberTitle, practiceHeading, practiceText, practiceDotsContainer], {
                opacity: 0,
                y: 10,
                duration: 0.25,
                stagger: 0.04
            })
            .to([goldBustImg, '.gold-bust-placeholder'], { scale: 0.95, opacity: 0.5, duration: 0.3 }, '-=0.25')
            .add(() => {
                // Update text content
                theoryHeading.textContent = tabData.title;
                theoryDescription.textContent = tabData.desc;
                
                // Update glow spotlight color
                const glow = document.querySelector('.gold-bust-glow');
                if (glow) {
                    glow.style.background = `radial-gradient(circle, ${tabData.glowColor} 0%, rgba(212, 175, 55, 0) 70%)`;
                }

                // Render slider content
                renderSlide(tabKey, activeSlideIndex);
            })
            .to([goldBustImg, '.gold-bust-placeholder'], { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' })
            .to([theoryHeading, theoryDescription, practiceNumberTitle, practiceHeading, practiceText, practiceDotsContainer], {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power3.out'
            }, '-=0.4');
    }

    // Tab Button Click Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabKey = btn.getAttribute('data-tab');
            switchTab(tabKey);
        });
    });

    // Slider Arrows Listeners
    practicesArrowPrev.addEventListener('click', () => {
        const slides = practicesData[activeTabKey].slides;
        const prevIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
        
        gsap.timeline()
            .to([practiceHeading, practiceText], { opacity: 0, x: 20, duration: 0.25 })
            .add(() => {
                activeSlideIndex = prevIndex;
                renderSlide(activeTabKey, activeSlideIndex);
                gsap.set([practiceHeading, practiceText], { x: -20 });
            })
            .to([practiceHeading, practiceText], { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    });

    practicesArrowNext.addEventListener('click', () => {
        const slides = practicesData[activeTabKey].slides;
        const nextIndex = (activeSlideIndex + 1) % slides.length;

        gsap.timeline()
            .to([practiceHeading, practiceText], { opacity: 0, x: -20, duration: 0.25 })
            .add(() => {
                activeSlideIndex = nextIndex;
                renderSlide(activeTabKey, activeSlideIndex);
                gsap.set([practiceHeading, practiceText], { x: 20 });
            })
            .to([practiceHeading, practiceText], { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    });

    // Initialize slide on page load
    renderSlide('logic', 0);


    /* --- Video Modal Triggers --- */
    const openVideoBtn = document.getElementById('open-video-btn');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const videoModal = document.getElementById('video-modal');
    const modalOverlay = videoModal.querySelector('.modal-overlay');

    function openModal() {
        videoModal.classList.add('open');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        
        // Modal entrance animation
        gsap.fromTo(videoModal.querySelector('.modal-content'), 
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'power4.out' }
        );
    }

    function closeModal() {
        // Modal exit animation
        gsap.to(videoModal.querySelector('.modal-content'), {
            scale: 0.92,
            opacity: 0,
            duration: 0.4,
            ease: 'power3.out',
            onComplete: () => {
                videoModal.classList.remove('open');
                videoModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = ''; // Unlock background scrolling
            }
        });
    }

    openVideoBtn.addEventListener('click', openModal);
    closeVideoBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) {
            closeModal();
        }
    });

    /* --- Day/Night Mode Theme Toggle Logic --- */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Check local storage for preference, default to dark theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Save theme in local storage
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
        
        // Trigger soft gold spotlight glow update for the practices center bust
        if (typeof activeTabKey !== 'undefined' && typeof practicesData !== 'undefined') {
            const tabData = practicesData[activeTabKey];
            const glow = document.querySelector('.gold-bust-glow');
            if (glow) {
                if (document.body.classList.contains('light-theme')) {
                    glow.style.background = `radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0) 70%)`;
                } else {
                    glow.style.background = `radial-gradient(circle, ${tabData.glowColor} 0%, rgba(212, 175, 55, 0) 70%)`;
                }
            }
        }
    });
});
