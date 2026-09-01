(() => {
  const files = {
    home: 'content/home.json', about: 'content/about.json', apartments: 'content/apartments.json',
    services: 'content/services.json', amenities: 'content/amenities.json', gallery: 'content/gallery.json',
    videos: 'content/video-tours.json', testimonials: 'content/testimonials.json', faqs: 'content/faqs.json',
    contact: 'content/contact.json', settings: 'content/site-settings.json'
  };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const active = (items = []) => items.filter((item) => item.active !== false);
  const text = (selector, value) => { if (value !== undefined && value !== null && $(selector)) $(selector).textContent = value; };
  const iconClass = (value, fallback) => `fa-solid ${String(value || fallback).replace(/[^a-z0-9 -]/gi, '')}`;
  const normalise = (value) => String(value || 'other').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const makeApartment = (item) => {
    const card = document.createElement('article'); card.className = 'apt-card';
    const media = document.createElement('div'); media.className = 'apt-img-wrapper';
    if (item.featured_image) { const image = new Image(); image.src = item.featured_image; image.alt = item.name || 'Apartment'; image.className = 'apt-img'; media.append(image); }
    const badge = document.createElement('span'); badge.className = 'apt-badge'; badge.textContent = item.type || 'Apartment'; media.append(badge); card.append(media);
    const details = document.createElement('div'); details.className = 'apt-details';
    const name = document.createElement('h3'); name.className = 'apt-name'; name.textContent = item.name || 'Apartment'; details.append(name);
    const description = document.createElement('p'); description.className = 'apt-desc'; description.textContent = item.description || ''; details.append(description);
    const facts = document.createElement('p'); facts.className = 'apt-desc'; facts.textContent = `${item.bedrooms || '—'} bedroom(s) · ${item.bathrooms || '—'} bathroom(s) · ${item.guest_capacity || '—'}`; details.append(facts);
    if (item.price) { const price = document.createElement('p'); price.className = 'apt-desc'; price.style.color = 'var(--primary-gold)'; price.style.fontWeight = '700'; price.textContent = item.price; details.append(price); }
    const features = document.createElement('ul'); features.className = 'apt-features-list'; (item.amenities || []).forEach((value) => { const li = document.createElement('li'); li.innerHTML = '<i class="fa-solid fa-check"></i>'; li.append(` ${value}`); features.append(li); }); details.append(features);
    if ((item.gallery_images || []).length) { const thumbs = document.createElement('div'); thumbs.style.cssText = 'display:flex;gap:.35rem;flex-wrap:wrap;margin:0 0 1rem'; item.gallery_images.forEach((src) => { const image = new Image(); image.src = src; image.alt = `${item.name || 'Apartment'} gallery image`; image.style.cssText = 'height:42px;width:58px;object-fit:cover;border-radius:5px;cursor:pointer'; image.addEventListener('click', () => window.openLightbox?.(src)); thumbs.append(image); }); details.append(thumbs); }
    const cta = document.createElement('a'); cta.href = '#booking'; cta.className = 'btn-primary'; cta.style.cssText = 'text-align:center;justify-content:center'; cta.textContent = 'Enquire Now'; cta.addEventListener('click', () => window.showPage?.('booking')); details.append(cta);
    card.append(details); return card;
  };

  const renderApartments = (data) => {
    const items = active(data.items); const homeItems = items.filter((item) => item.featured !== false);
    $$('.apartments-grid').forEach((grid, index) => { grid.replaceChildren(...(index === 0 ? homeItems : items).map(makeApartment)); });
    text('#homeApartmentsTitle', data.title); text('#homeApartmentsIntro', data.intro); text('#servicesApartmentsTitle', data.title); text('#servicesApartmentsIntro', data.intro);
  };

  const makeService = (service) => {
    const card = document.createElement('article'); card.className = 'service-card';
    if (service.image) { const image = new Image(); image.src = service.image; image.alt = service.name || 'Service'; image.className = 'service-card-image'; card.append(image); }
    else { const banner = document.createElement('div'); banner.className = 'service-icon-banner'; banner.innerHTML = '<i class="fa-solid fa-concierge-bell" aria-hidden="true"></i>'; card.append(banner); }
    const details = document.createElement('div'); details.className = 'service-details';
    const name = document.createElement('h3'); name.textContent = service.name || 'Service'; details.append(name);
    if (service.description) { const description = document.createElement('p'); description.textContent = service.description; details.append(description); }
    const list = document.createElement('ul'); list.className = 'service-list'; (service.features || []).forEach((feature) => { const li = document.createElement('li'); li.textContent = feature; list.append(li); }); details.append(list);
    if (service.price) { const price = document.createElement('p'); price.style.color = 'var(--primary-gold)'; price.style.fontWeight = '700'; price.textContent = service.price; details.append(price); }
    const cta = document.createElement('a'); cta.href = '#contact'; cta.className = 'btn-primary'; cta.textContent = service.cta_text || 'Enquire Now'; cta.addEventListener('click', () => window.showPage?.('contact')); details.append(cta); card.append(details); return card;
  };

  const renderServices = (data) => {
    text('#servicesTitle', data.title); text('#servicesSubtitle', data.subtitle);
    const section = $('#additionalServices'); if (!section) return; section.replaceChildren();
    active(data.categories).forEach((category, index) => {
      if (index) { const divider = document.createElement('div'); divider.className = 'services-divider'; section.append(divider); }
      const title = document.createElement('h3'); title.className = 'services-subheading'; title.textContent = category.name || 'Services'; section.append(title);
      const grid = document.createElement('div'); grid.className = 'services-grid'; grid.append(...active(category.services).map(makeService)); section.append(grid);
    });
  };

  const makeGalleryItem = (entry) => {
    const item = document.createElement('div'); item.className = `gallery-item cat-${normalise(entry.category)}`;
    const image = new Image(); image.src = entry.image; image.alt = entry.title || 'MKAY Apartments gallery image';
    const overlay = document.createElement('div'); overlay.className = 'gallery-overlay'; const title = document.createElement('h4'); title.className = 'gallery-title'; title.textContent = entry.title || 'Gallery image'; overlay.append(title); item.append(image, overlay);
    item.addEventListener('click', () => window.openLightbox?.(entry.image)); return item;
  };

  const renderGallery = (data) => {
    const items = active(data.images); text('#galleryTitle', data.title); text('#gallerySubtitle', data.subtitle);
    const home = $('#homeGalleryPreview'); if (home) home.replaceChildren(...items.slice(0, 6).map(makeGalleryItem));
    const gallery = $('#galleryGrid'); if (gallery) gallery.replaceChildren(...items.map(makeGalleryItem));
    const experience = $('#experienceGallery'); if (experience) experience.replaceChildren(...items.filter((item) => item.category === 'experiences' || item.category === 'culture').map(makeGalleryItem));
  };

  const renderAmenities = (data) => {
    text('#amenitiesTitle', data.title); text('#amenitiesSubtitle', data.subtitle);
    const grid = $('.amenities-grid'); if (!grid) return; grid.replaceChildren(...active(data.items).map((item) => { const box = document.createElement('div'); box.className = 'amenity-item'; const icon = document.createElement('div'); icon.className = 'amenity-icon'; icon.innerHTML = `<i class="${iconClass(item.icon, 'fa-star')}"></i>`; const title = document.createElement('h4'); title.className = 'amenity-title'; title.textContent = item.title || 'Amenity'; box.append(icon, title); return box; }));
  };

  const renderHome = (data) => {
    text('#heroTitle', data.hero_title); text('#heroTagline', data.hero_tagline); text('#heroSubtitle', data.hero_subtitle); text('#welcomeTitle', data.welcome_title); text('#welcomeText', data.welcome_text); text('#whyChooseTitle', data.why_choose_title); text('#whyChooseSubtitle', data.why_choose_subtitle); text('#homeServicesTitle', data.services_title); text('#homeServicesSubtitle', data.services_subtitle); text('#galleryPreviewTitle', data.gallery_preview_title); text('#galleryPreviewSubtitle', data.gallery_preview_subtitle); text('#locationTitle', data.location_title); text('#locationSubtitle', data.location_subtitle);
    const grid = $('#whyChooseGrid'); if (!grid) return; grid.replaceChildren(...(data.why_choose || []).map((item) => { const box = document.createElement('div'); box.className = 'why-card'; const icon = document.createElement('div'); icon.className = 'why-icon'; icon.innerHTML = `<i class="${iconClass(item.icon, 'fa-star')}"></i>`; const title = document.createElement('h3'); title.className = 'why-title'; title.textContent = item.title || ''; const description = document.createElement('p'); description.textContent = item.description || ''; box.append(icon, title, description); return box; }));
  };

  const renderAbout = (data) => { text('#aboutTitle', data.title); text('#aboutSubtitle', data.subtitle); text('#aboutDescription', data.description); text('#visionTitle', data.vision_title); text('#visionText', data.vision_text); text('#missionTitle', data.mission_title); text('#missionText', data.mission_text); };
  const renderContact = (data) => {
    text('#contactTitle', data.title); text('#contactSubtitle', data.subtitle); text('#businessHours', data.business_hours);
    $$('[data-contact-phone]').forEach((element) => { element.textContent = data.phone; element.href = `tel:${String(data.phone || '').replace(/\s/g, '')}`; });
    $$('[data-contact-email]').forEach((element) => { element.textContent = data.email; element.href = `mailto:${data.email}`; });
    $$('[data-contact-address]').forEach((element) => { element.textContent = data.address; });
    $$('.whatsapp-cta-box').forEach((element) => { const message = new URL(element.href).searchParams.get('text') || ''; element.href = `https://wa.me/${String(data.whatsapp_number || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`; });
  };
  const renderSettings = (data) => {
    document.title = data.browser_title || document.title; $$('[data-site-name]').forEach((el) => { el.textContent = data.site_name; }); text('#copyrightYear', data.copyright_year); text('#footerDescription', data.footer_description); text('#headerCtaText', data.header_cta_text); text('#footerLinksTitle', data.footer_links_title); text('#footerContactTitle', data.footer_contact_title); text('#bookingTitle', data.booking_title); text('#bookingSubtitle', data.booking_subtitle);
    const links = active(data.navigation); const nav = $('#navLinks'); const footerLinks = $('.footer-links ul');
    const makeLink = (entry, header) => { const link = document.createElement('a'); link.href = `#${entry.target}`; link.textContent = entry.label; if (header) link.className = `nav-link${entry.target === 'home' ? ' active' : ''}`; link.addEventListener('click', () => window.showPage?.(entry.target)); return link; };
    if (nav && links.length) nav.replaceChildren(...links.map((entry) => { const li = document.createElement('li'); li.append(makeLink(entry, true)); return li; }));
    if (footerLinks && links.length) footerLinks.replaceChildren(...links.map((entry) => { const li = document.createElement('li'); li.append(makeLink(entry, false)); return li; }));
  };

  const renderSupplementary = (id, data, type) => {
    const section = $(id); if (!section) return; const items = active(data.items); section.hidden = !items.length; if (!items.length) return;
    text(`${id}Title`, data.title); text(`${id}Subtitle`, data.subtitle); const grid = $(`${id}Grid`); if (!grid) return; grid.replaceChildren(...items.map((item) => { const card = document.createElement(type === 'faq' ? 'details' : 'article'); card.className = 'service-card'; const body = document.createElement('div'); body.className = 'service-details'; if (type === 'faq') { const question = document.createElement('summary'); question.textContent = item.question; const answer = document.createElement('p'); answer.textContent = item.answer; body.append(question, answer); } else if (type === 'video') { const frame = document.createElement('iframe'); frame.src = item.url; frame.title = item.title; frame.loading = 'lazy'; frame.allowFullscreen = true; frame.style.cssText = 'border:0;width:100%;aspect-ratio:16/9'; const title = document.createElement('h3'); title.textContent = item.title; const description = document.createElement('p'); description.textContent = item.description || ''; body.append(frame, title, description); } else { const quote = document.createElement('p'); quote.textContent = `“${item.quote}”`; const name = document.createElement('h3'); name.textContent = item.name; const location = document.createElement('p'); location.textContent = `${'★'.repeat(Math.max(0, Math.min(5, item.rating || 0)))}${item.location ? ` · ${item.location}` : ''}`; body.append(quote, name, location); } card.append(body); return card; }));
  };

  Promise.all(Object.entries(files).map(async ([key, path]) => { const response = await fetch(path); if (!response.ok) throw new Error(`Unable to load ${path}`); return [key, await response.json()]; }))
    .then((records) => Object.fromEntries(records))
    .then((content) => { window.mkayContent = content; window.siteContent = { whatsapp_number: content.contact.whatsapp_number }; renderHome(content.home); renderAbout(content.about); renderApartments(content.apartments); renderServices(content.services); renderAmenities(content.amenities); renderGallery(content.gallery); renderContact(content.contact); renderSettings(content.settings); renderSupplementary('#videoToursSection', content.videos, 'video'); renderSupplementary('#testimonialsSection', content.testimonials, 'testimonial'); renderSupplementary('#faqsSection', content.faqs, 'faq'); })
    .catch((error) => console.warn('CMS content was not loaded:', error));
})();
