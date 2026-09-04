(()=>{
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const drawer=q('.drawer'), overlay=q('.overlay');
  const openInfo=()=>{drawer?.classList.add('open');overlay?.classList.add('show')};
  const closeInfo=()=>{drawer?.classList.remove('open');overlay?.classList.remove('show')};
  qa('[data-info]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();openInfo()}));
  q('[data-close-info]')?.addEventListener('click',closeInfo); overlay?.addEventListener('click',()=>{closeInfo();closeCart()});
  q('.menu-btn')?.addEventListener('click',openInfo);
  qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;qa('.work').forEach(w=>w.classList.toggle('filtered',f!=='all'&&w.dataset.cat!==f));}));
  const works=qa('.work'); let idx=0; const lb=q('.lightbox'), lbm=q('.lb-media'), lbt=q('.lb-title'), lbc=q('.lb-count');
  function show(i){if(!lb||!works.length)return;idx=(i+works.length)%works.length;const w=works[idx], media=w.querySelector('img,video');lbm.innerHTML='';let clone=media.cloneNode(true);if(clone.tagName==='VIDEO'){clone.controls=true;clone.autoplay=true;clone.muted=true;clone.loop=true}lbm.appendChild(clone);lbt.textContent=w.dataset.title||'';lbc.textContent=String(idx+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0');lb.classList.add('open');document.body.style.overflow='hidden'}
  works.forEach((w,i)=>w.querySelector('.open-work')?.addEventListener('click',()=>show(i)));
  const closeLb=()=>{lb?.classList.remove('open');document.body.style.overflow='';lbm&&(lbm.innerHTML='')};q('[data-lb-close]')?.addEventListener('click',closeLb);q('[data-lb-prev]')?.addEventListener('click',()=>show(idx-1));q('[data-lb-next]')?.addEventListener('click',()=>show(idx+1));
  document.addEventListener('keydown',e=>{if(!lb?.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
  // cart
  let cart=JSON.parse(localStorage.getItem('atelier-huda-edit-cart')||'[]'), cartEl=q('.cart');
  function save(){localStorage.setItem('atelier-huda-edit-cart',JSON.stringify(cart));renderCart()}
  function openCart(){cartEl?.classList.add('open');overlay?.classList.add('show')}
  function closeCart(){cartEl?.classList.remove('open');if(!drawer?.classList.contains('open'))overlay?.classList.remove('show')}
  window.closeCart=closeCart;
  qa('[data-cart-open]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();openCart()}));q('[data-cart-close]')?.addEventListener('click',closeCart);
  qa('[data-add]').forEach(b=>b.addEventListener('click',()=>{const p={id:b.dataset.add,name:b.dataset.name,brand:b.dataset.brand,price:+b.dataset.price};let f=cart.find(x=>x.id===p.id);f?f.qty++:cart.push({...p,qty:1});save();openCart()}));
  function renderCart(){const box=q('.cart-items');if(!box)return;box.innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><div>${x.brand}<br><strong>${x.name}</strong><br>${x.qty} × ${x.price} SAR</div><button data-remove="${x.id}">×</button></div>`).join(''):'<p class="note">No items yet / لا توجد منتجات.</p>';q('.cart-total strong').textContent=cart.reduce((s,x)=>s+x.price*x.qty,0)+' SAR';qa('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==b.dataset.remove);save()})}
  q('[data-checkout]')?.addEventListener('click',()=>{if(!cart.length)return;let lines=['ATELIER HUDA — THE EDIT PRE-ORDER',...cart.map(x=>`• ${x.brand} — ${x.name} × ${x.qty} — ${x.price*x.qty} SAR`),`Reference total: ${cart.reduce((s,x)=>s+x.price*x.qty,0)} SAR`,'Please confirm availability, shade, final price and Atelier service privilege.'];window.open('https://wa.me/966545565606?text='+encodeURIComponent(lines.join('\n')),'_blank')});renderCart();
  // concierge form -> WhatsApp draft
  q('[data-concierge-form]')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const lines=['ATELIER HUDA — CONCIERGE REQUEST',...([...fd.entries()].map(([k,v])=>`${k}: ${v}`))];window.open('https://wa.me/966545565606?text='+encodeURIComponent(lines.join('\n')),'_blank')});
})();
