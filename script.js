
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll naar secties bij klikken op een link 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.hash; // bijv #about
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault(); // voorkom standaard "springen"
                targetElement.scrollIntoView({
                    behavior: 'smooth' // smooth scroll
                });
                
                // sluit de navbar (als die open is op mobiel)
                const navbar = document.getElementById('navbar');
                const hamburgerMenu = document.querySelector('.hamburger-menu');
                if (navbar && navbar.classList.contains('nav-open')) {
                    navbar.classList.remove('nav-open');
                    if(hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('no-scroll'); // weer scrollen toestaan
                }
            }
        });
    });

    // zet automatisch het juiste jaar in de footer 
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    
    // contact formulier afhandeling (nog niet klaar)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // voorkom echte verzending
            alert('Thank you for your message!');
            contactForm.reset(); // maak velden leeg
        });
    }
    

    // Navbar: highlight juiste link afhankelijk van scrollpositie 
    const sections = document.querySelectorAll("section[id]");
    const navLiAnchors = document.querySelectorAll("#navbar ul li a");
    const mainHeader = document.getElementById('main-header'); 

    function updateActiveNavLink() {
        let current = "";
        const headerHeight = mainHeader ? mainHeader.offsetHeight : 70;

        // check welke section op dit moment zichtbaar is
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - headerHeight - 70)) {
                current = section.getAttribute("id");
            }
        });

        // zet active class op juiste link
        navLiAnchors.forEach((a) => { 
            a.classList.remove("active");
            if (a.getAttribute("href") === `#${current}`) {
                a.classList.add("active");
            }
        });
        
        // speciale check voor "home" link (bovenaan)
        const aboutSection = document.getElementById('about'); 
        const aboutSectionTop = aboutSection ? aboutSection.offsetTop : Infinity;

        if (window.pageYOffset < (aboutSectionTop - headerHeight - 70) || (!current && sections.length > 0 && window.pageYOffset < sections[0].offsetTop) ) {
             navLiAnchors.forEach((a) => a.classList.remove("active"));
             const homeLink = document.querySelector("#navbar ul li a[href='#hero']");
             if (homeLink) homeLink.classList.add("active");
        }
    }

    // Update bij scrollen en meteen 1x bij laden
    window.addEventListener("scroll", updateActiveNavLink);
    updateActiveNavLink();

    // sterren achtergrond (random sterretjes)

function createStars(containerElement, numberOfStars) {
    
    if (!containerElement) return;
    for (let i = 0; i < numberOfStars; i++) {
       
        const star = document.createElement('div');  // nieuw div element aan voor de ster
        star.classList.add('star'); // css class zodta de ster kan worden gestyled

        // willekeurige grootte voor de ster tussen 0.5 en 3.5 pixels
        const size = Math.random() * 3 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        //zet de ster op een random positie in de container
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        //geef de animatie een random startvertraging (tussen 0 en 3 seconden) anders gaan alle sterren tegelijk twinkelen
        star.style.animationDelay = `${Math.random() * 3}s`;

        // geef de animatie een willekeurige duur (tussen 1 en 3 seconden)
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;

        // voeg de ster toe aan de container
        containerElement.appendChild(star);
    }
}

// zoek de containers in de HTML waar de sterren moeten komen
const heroStarsContainer = document.getElementById('hero-stars');     // sterren in de hero-sectie
const contactStarsContainer = document.getElementById('contact-stars'); // sterren in de contact-sectie

// maka de sterren als de container bestaat
if (heroStarsContainer) createStars(heroStarsContainer, 150);  // 150 sterren voor de hero
if (contactStarsContainer) createStars(contactStarsContainer, 80); // 80 sterren voor de contactpagina


    // hamburger menu voor mobile 
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navbar = document.getElementById('navbar'); 
    
    if (hamburgerMenu && navbar) {
        hamburgerMenu.addEventListener('click', () => {
            navbar.classList.toggle('nav-open'); 
            const isExpanded = navbar.classList.contains('nav-open');
            hamburgerMenu.setAttribute('aria-expanded', isExpanded);
            
            // scroll blokkeren als menu open is
            if (isExpanded) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Project items fade-in bij scrollen
    const projectItems = document.querySelectorAll('.project-item');
    if (projectItems.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // pas zichtbaar bij 10% in beeld
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 0.15}s`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // stop met observeren (eenmalig effect)
                }
            });
        };

        const projectObserver = new IntersectionObserver(observerCallback, observerOptions);
        projectItems.forEach(item => projectObserver.observe(item));
    }

    // Typende tekst animatie in hero
    const typedTextSpan = document.getElementById('typed-text');

    if (typedTextSpan) {
        const phrasesToType = [
            "software developer student",
            "creative problem solver",
            "tech enthusiast",
            "visual thinker",
            "gamer",
            "design lover"
        ];
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let amTyping = true; 

        const TYPING_SPEED_MS = 60;
        const ERASING_SPEED_MS = 50;
        const PAUSE_AFTER_TYPING_MS = 1200; // wacht na typen
        const PAUSE_AFTER_ERASING_MS = 500; // wacht na wissen

        function typeWriterEffect() {
            const currentPhrase = phrasesToType[currentPhraseIndex];

            if (amTyping) {
                // Tekst typen
                if (currentCharIndex < currentPhrase.length) {
                    typedTextSpan.textContent += currentPhrase.charAt(currentCharIndex);
                    currentCharIndex++;
                    setTimeout(typeWriterEffect, TYPING_SPEED_MS);
                } else {
                    // klaar met typen , even wachten , dan wissen
                    amTyping = false;
                    setTimeout(typeWriterEffect, PAUSE_AFTER_TYPING_MS);
                }
            } else {
                // tekst wissen
                if (currentCharIndex > 0) {
                    typedTextSpan.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                    setTimeout(typeWriterEffect, ERASING_SPEED_MS);
                } else {
                    // klaar met wissen -> volgende zin
                    amTyping = true;
                    currentPhraseIndex = (currentPhraseIndex + 1) % phrasesToType.length;
                    setTimeout(typeWriterEffect, PAUSE_AFTER_ERASING_MS);
                }
            }
        }

        // start typing effect na ong 2 seconden
        setTimeout(typeWriterEffect, 2000);
    }

});
