/* ================================================
   Bergalids Kennel — Main Script
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Random Hero Image ---- */
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    const heroImages = [
      { src: 'bilder/hundar/Madde-1.jpg', alt: 'Madde — Bergalids Kennel' },
      { src: 'bilder/hundar/stina-1.jpg', alt: 'Stina — Bergalids Kennel' }
      // Du kan lägga till fler bilder här senare
    ];
    // Slumpa fram ett index
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    heroImg.src = heroImages[randomIndex].src;
    heroImg.alt = heroImages[randomIndex].alt;
  }

  /* ---- Navigation scroll effect ---- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu toggle ---- */
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    nav.querySelectorAll('.nav__mobile a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  /* ---- Lightbox ---- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    const images = [];

    galleryItems.forEach((item, i) => {
      const img = item.querySelector('img');
      if (img) images.push(img.src);

      item.addEventListener('click', () => {
        currentIndex = i;
        openLightbox(img.src);
      });
    });

    function openLightbox(src) {
      lightboxImg.style.opacity = '0';
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
      };
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightbox.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);

    lightbox.querySelector('.lightbox__prev')?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    });

    lightbox.querySelector('.lightbox__next')?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    });

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
      }
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
      }
    });
  }

  /* ---- Gallery tabs ---- */
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const tabContents = document.querySelectorAll('.gallery-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');

      // Re-trigger reveal for newly visible items
      document.querySelectorAll(`#tab-${target} .reveal`).forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 40);
      });
    });
  });

  /* ---- Gallery sub-tabs (Tidigare kullar) ---- */
  const subtabBtns = document.querySelectorAll('.gallery-subtab-btn');
  const subtabContents = document.querySelectorAll('.gallery-subtab-content');

  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.subtab;

      subtabBtns.forEach(b => b.classList.remove('active'));
      subtabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`subtab-${target}`)?.classList.add('active');

      document.querySelectorAll(`#subtab-${target} .reveal`).forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 40);
      });
    });
  });

  /* ---- Contact form ---- */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const success = form.querySelector('.form__success');
      btn.textContent = 'Skickar...';
      btn.disabled = true;

      // Simulate send (no backend)
      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      }, 1000);
    });
  }

});
