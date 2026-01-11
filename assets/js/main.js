// Client JS: fetch content and wire animations, gallery lightbox
(async function(){
  AOS.init({duration:700,once:true});
  const content = await fetch('/api/content').then(r=>r.json()).catch(()=>({}));
  document.getElementById('site-title').textContent = content.title || 'Velic Dental';
  document.getElementById('site-subtitle').textContent = content.subtitle || '';
  document.getElementById('about-text').textContent = content.about || '';
  document.getElementById('contact-text').textContent = content.contact || '';
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  const servicesEl = document.getElementById('services-list');
  (content.services||[]).forEach(s=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<h3>${s.title}</h3><p>${s.desc}</p>`;
    servicesEl.appendChild(el);
  });

  const gallery = document.getElementById('gallery-grid');
  (content.gallery||[]).forEach(src=>{
    const img = document.createElement('img'); img.src = src; img.alt='Gallery image';
    img.addEventListener('click',()=>openLightbox(src));
    gallery.appendChild(img);
  });

  // lightbox
  function openLightbox(src){
    let lb = document.getElementById('lightbox');
    if(!lb){
      lb = document.createElement('div'); lb.id='lightbox'; lb.innerHTML='<img src="" alt="">';
      lb.addEventListener('click',()=>lb.remove()); document.body.appendChild(lb);
    }
    lb.querySelector('img').src = src; 
  }

  // smooth scrolling for hash links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href = a.getAttribute('href'); if(href.length>1){
        e.preventDefault(); const el=document.querySelector(href); if(el) el.scrollIntoView({behavior:'smooth'});
      }
    });
  });
})();
