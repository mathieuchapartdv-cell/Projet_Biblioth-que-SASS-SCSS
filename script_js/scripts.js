


// ─────────────────────────────────────────
// FAIT PAR CLAUDE AI à vérifier plus tard
// Voici le script JS nécessaire pour le bouton de basculement : 
// ─────────────────────────────────────────

const toggle = document.getElementById('theme-toggle');
const root   = document.documentElement;

// Charge le thème sauvegardé au démarrage
const saved = localStorage.getItem('theme');
if (saved) root.classList.add(saved);

toggle.addEventListener('click', () => {
  // Cycle : light → dark-deep → dark-soft → light
  if (root.classList.contains('dark-deep')) {
    root.classList.replace('dark-deep', 'dark-soft');
    localStorage.setItem('theme', 'dark-soft');
  } else if (root.classList.contains('dark-soft')) {
    root.classList.remove('dark-soft');
    localStorage.removeItem('theme');
  } else if (root.classList.contains('dark-medieval')) {
    root.classList.remove('dark-medieval');
    localStorage.removeItem('theme');  
  } else {
    root.classList.add('dark-deep');
    localStorage.setItem('theme', 'dark-deep');
  }
});











// ─────────────────────────────────────────
// Carousel vanilla JS --> FAIT PAR CLAUDE AI A VERIFIER PLUS TARD
// Gère : navigation, dots, compteur, autoplay
// ─────────────────────────────────────────


class Carousel {

  // ── 1. Constructeur ─────────────────────────────────────
  //    element : l'élément .carousel dans le DOM
  //    options : configuration optionnelle

  constructor(element, options = {}) {
    this.carousel = element;
    this.track    = element.querySelector('.carousel__track');
    this.slides   = [...element.querySelectorAll('.carousel__slide')];
    this.dots     = [...element.querySelectorAll('.carousel__dot')];
    this.counter  = element.querySelector('.carousel__counter');
    this.progress = element.querySelector('.carousel__progress');

    // Options avec valeurs par défaut
    this.current      = 0;
    this.total        = this.slides.length;
    this.autoplay     = options.autoplay     || false;
    this.interval     = options.interval     || 5000;  // 5 secondes
    this.romanCounter = options.romanCounter || false; // Chiffres romains
    this.timer        = null;

    this.init();
  }


  // ── 2. Initialisation ───────────────────────────────────

  init() {
    // Flèches
    const prevBtn = this.carousel.querySelector('.carousel__arrow--prev');
    const nextBtn = this.carousel.querySelector('.carousel__arrow--next');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    // Clavier — flèches gauche/droite
    this.carousel.setAttribute('tabindex', '0');
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch — swipe sur mobile
    this.initTouch();

    // Autoplay
    if (this.autoplay) this.startAutoplay();

    // Pause autoplay au survol
    this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel.addEventListener('mouseleave', () => {
      if (this.autoplay) this.startAutoplay();
    });

    // Premier affichage
    this.update();
  }


  // ── 3. Navigation ───────────────────────────────────────

  prev() {
    this.current = (this.current - 1 + this.total) % this.total;
    this.update();
    this.restartAutoplay();
  }

  next() {
    this.current = (this.current + 1) % this.total;
    this.update();
    this.restartAutoplay();
  }

  goTo(index) {
    this.current = index;
    this.update();
    this.restartAutoplay();
  }


  // ── 4. Mise à jour de l'affichage ───────────────────────
  //    Déplace le track et met à jour dots + compteur.

  update() {
    // Déplace le track
    const offset = -this.current * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    // Met à jour les dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === this.current);
    });

    // Met à jour le compteur
    if (this.counter) {
      if (this.romanCounter) {
        this.counter.textContent = `${this.toRoman(this.current + 1)} / ${this.toRoman(this.total)}`;
      } else {
        this.counter.textContent = `${this.current + 1} / ${this.total}`;
      }
    }

    // Met à jour la barre de progression
    if (this.progress) {
      this.progress.style.width = `${((this.current + 1) / this.total) * 100}%`;
    }
  }


  // ── 5. Autoplay ─────────────────────────────────────────

  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  restartAutoplay() {
    if (this.autoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }


  // ── 6. Touch / Swipe ───────────────────────────────────
  //    Gère le swipe gauche/droite sur mobile.

  initTouch() {
    let startX = 0;
    let diff   = 0;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.track.addEventListener('touchmove', (e) => {
      diff = e.touches[0].clientX - startX;
    }, { passive: true });

    this.track.addEventListener('touchend', () => {
      if (Math.abs(diff) > 50) {  // Seuil minimum de 50px
        if (diff > 0) this.prev();
        else this.next();
      }
      diff = 0;
    });
  }


  // ── 7. Chiffres romains ─────────────────────────────────
  //    Pour le compteur du carousel médiéval.

  toRoman(num) {
    const romanNumerals = [
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    let result = '';
    for (const [letter, value] of romanNumerals) {
      while (num >= value) {
        result += letter;
        num -= value;
      }
    }
    return result;
  }
}


// ── 8. Initialisation automatique ─────────────────────────
//    Cherche tous les .carousel dans la page et les active.

document.addEventListener('DOMContentLoaded', () => {

  // Carousels classiques
  document.querySelectorAll('.carousel:not(.carousel--medieval)').forEach((el) => {
    new Carousel(el, {
      autoplay: true,
      interval: 5000,
    });
  });

  // Carousels médiévaux
  document.querySelectorAll('.carousel--medieval').forEach((el) => {
    new Carousel(el, {
      autoplay    : true,
      interval    : 6000,
      romanCounter: true,  // Compteur en chiffres romains
    });
  });
});










// ─────────────────────────────────────────
// Dropdown vanilla JS --> FAIT PAR CLAUDE AI A VERIFIER PLUS TARD
// Gère : ouverture/fermeture, clavier, clic extérieur
// ─────────────────────────────────────────


class Dropdown {

  // ── 1. Constructeur ─────────────────────────────────────

  constructor(element) {
    this.dropdown = element;
    this.trigger  = element.querySelector('.dropdown__trigger');
    this.menu     = element.querySelector('.dropdown__menu');
    this.items    = [...element.querySelectorAll('.dropdown__item:not(.is-disabled)')];
    this.isOpen   = false;
    this.focusIndex = -1;

    this.init();
  }


  // ── 2. Initialisation ───────────────────────────────────

  init() {
    // Clic sur le déclencheur
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Fermer quand on clique en dehors
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.close();
      }
    });

    // Navigation au clavier
    this.dropdown.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }


  // ── 3. Ouvrir / Fermer ─────────────────────────────────

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    // Fermer tous les autres dropdowns ouverts
    document.querySelectorAll('.dropdown.is-open').forEach((el) => {
      if (el !== this.dropdown) {
        el.classList.remove('is-open');
      }
    });

    this.dropdown.classList.add('is-open');
    this.isOpen = true;
    this.focusIndex = -1;
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.dropdown.classList.remove('is-open');
    this.isOpen = false;
    this.focusIndex = -1;
    this.trigger.setAttribute('aria-expanded', 'false');
  }


  // ── 4. Navigation clavier ──────────────────────────────
  //    Escape    : ferme le menu
  //    ArrowDown : item suivant
  //    ArrowUp   : item précédent
  //    Enter     : active l'item sélectionné
  //    Tab       : ferme le menu

  handleKeyboard(e) {
    switch (e.key) {

      case 'Escape':
        this.close();
        this.trigger.focus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        }
        this.focusIndex = Math.min(
          this.focusIndex + 1,
          this.items.length - 1
        );
        this.items[this.focusIndex].focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.focusIndex = Math.max(this.focusIndex - 1, 0);
        this.items[this.focusIndex].focus();
        break;

      case 'Enter':
      case ' ':
        if (this.focusIndex >= 0) {
          e.preventDefault();
          this.items[this.focusIndex].click();
          this.close();
        }
        break;

      case 'Tab':
        this.close();
        break;
    }
  }
}


// ── 5. Initialisation automatique ─────────────────────────
//    Cherche tous les .dropdown dans la page et les active.

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown').forEach((el) => {
    new Dropdown(el);
  });
});