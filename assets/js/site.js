(()=>{
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const SITE='https://ex-experience.github.io/huda.atelier/';
  const WA='https://wa.me/966545565606';
  const drawer=q('.drawer'), overlay=q('.overlay');
  const openInfo=()=>{drawer?.classList.add('open');overlay?.classList.add('show')};
  const closeInfo=()=>{drawer?.classList.remove('open');overlay?.classList.remove('show')};
  qa('[data-info]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();openInfo()}));
  q('[data-close-info]')?.addEventListener('click',closeInfo);
  overlay?.addEventListener('click',()=>{closeInfo();closeCart();closeItem()});
  q('.menu-btn')?.addEventListener('click',openInfo);

  qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    qa('[data-filter]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const f=b.dataset.filter;
    qa('.work').forEach(w=>w.classList.toggle('filtered',f!=='all'&&w.dataset.cat!==f));
  }));

  const works=qa('.work'); let idx=0;
  const lb=q('.lightbox'), lbm=q('.lb-media'), lbt=q('.lb-title'), lbc=q('.lb-count'), lbs=q('.lb-story');
  function show(i){
    if(!lb||!works.length)return;
    idx=(i+works.length)%works.length;
    const w=works[idx], media=w.querySelector('img,video');
    lbm.innerHTML='';
    if(media){
      let clone=media.cloneNode(true);
      if(clone.tagName==='VIDEO'){clone.controls=true;clone.autoplay=true;clone.muted=true;clone.loop=true}
      lbm.appendChild(clone);
    }
    if(lbt) lbt.textContent=w.dataset.title||'';
    if(lbc) lbc.textContent=String(idx+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0');
    if(lbs){
      lbs.innerHTML='<div class="lb-k">Makeup</div><div>'+(w.dataset.style||'')+'</div><div class="lb-k">Climate / light</div><div>'+(w.dataset.climate||'')+'</div><div class="lb-k">Note</div><div>'+(w.dataset.notes||'')+'</div><div class="ar">'+(w.dataset.ar||'')+'</div>';
    }
    lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  works.forEach((w,i)=>w.querySelector('.open-work')?.addEventListener('click',()=>show(i)));
  const closeLb=()=>{lb?.classList.remove('open');document.body.style.overflow='';if(lbm)lbm.innerHTML=''};
  q('[data-lb-close]')?.addEventListener('click',closeLb);
  q('[data-lb-prev]')?.addEventListener('click',()=>show(idx-1));
  q('[data-lb-next]')?.addEventListener('click',()=>show(idx+1));
  document.addEventListener('keydown',e=>{
    if(q('.item-modal')?.classList.contains('open') && e.key==='Escape') closeItem();
    if(!lb?.classList.contains('open'))return;
    if(e.key==='Escape')closeLb();
    if(e.key==='ArrowLeft')show(idx-1);
    if(e.key==='ArrowRight')show(idx+1);
  });

  let cart=JSON.parse(localStorage.getItem('atelier-huda-edit-cart')||'[]'), cartEl=q('.cart');
  function save(){localStorage.setItem('atelier-huda-edit-cart',JSON.stringify(cart));renderCart()}
  function openCart(){cartEl?.classList.add('open');overlay?.classList.add('show')}
  function closeCart(){cartEl?.classList.remove('open');if(!drawer?.classList.contains('open')&&!q('.item-modal')?.classList.contains('open'))overlay?.classList.remove('show')}
  window.closeCart=closeCart;
  qa('[data-cart-open]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();openCart()}));
  q('[data-cart-close]')?.addEventListener('click',closeCart);
  qa('[data-add]').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    addToCart(b.dataset.add,b.dataset.name,b.dataset.brand,+b.dataset.price);
  }));
  function addToCart(id,name,brand,price){
    const p={id,name,brand,price};
    let f=cart.find(x=>x.id===p.id); f?f.qty++:cart.push({...p,qty:1});
    save(); openCart(); logEvent('cart_add',p);
  }
  function privilegePct(list){
    const total=list.reduce((s,x)=>s+x.price*x.qty,0);
    const hasKit=list.some(x=>x.id==='atelier-kit');
    if(hasKit) return 20;
    if(total>=3000) return 20;
    if(total>=1500) return 15;
    if(total>0) return 10;
    return 0;
  }
  function renderCart(){
    const box=q('.cart-items'); if(!box)return;
    const pct=privilegePct(cart);
    box.innerHTML=cart.length?cart.map(x=>'<div class="cart-item"><div>'+esc(x.brand)+'<br><strong>'+esc(x.name)+'</strong><br><button data-qty="'+x.id+'" data-d="-1">−</button> '+x.qty+' <button data-qty="'+x.id+'" data-d="1">+</button> × '+x.price+' SAR</div><button data-remove="'+x.id+'">×</button></div>').join(''):'<p class="note">سلتك فارغة بعد.</p>';
    const tot=q('.cart-total strong'); if(tot) tot.textContent=cart.reduce((s,x)=>s+x.price*x.qty,0)+' SAR';
    const priv=q('.cart-priv'); if(priv) priv.textContent=pct?('امتياز '+pct+'٪ على Event Signature أو Skin Architecture خلال ٤٥ يوماً. العرس والسفر مستثنيان.'):'';
    qa('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==b.dataset.remove);save()});
    qa('[data-qty]').forEach(b=>b.onclick=()=>{const it=cart.find(x=>x.id===b.dataset.qty); if(!it)return; it.qty+=+b.dataset.d; if(it.qty<=0) cart=cart.filter(x=>x.id!==it.id); save();});
  }
  q('[data-checkout]')?.addEventListener('click',async ()=>{
    if(!cart.length)return;
    const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
    const ref='AH-'+Date.now().toString(36).toUpperCase();
    const pct=privilegePct(cart);
    const guidance='امتياز '+pct+'٪ على Event Signature أو Skin Architecture خلال 45 يوماً بعد اكتمال الطلب. العرس والسفر مستثنيان. الدرجة تُؤكد قبل الشحن.';
    const rec={ref,items:cart,total,page:location.pathname,guidance,source:'preorder'};
    await savePreorder(rec);
    const lines=['أتيليه هُدى — طلب مسبق '+ref,...cart.map(x=>'• '+x.brand+' — '+x.name+' × '+x.qty+' — '+(x.price*x.qty)+' ر.س'),'المجموع المرجعي: '+total+' ر.س',guidance,'الموقع: '+SITE];
    window.open(WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank');
  });
  renderCart();

  q('[data-concierge-form]')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const rec=Object.fromEntries(fd.entries());
    const ref='AH-C-'+Date.now().toString(36).toUpperCase();
    await saveInquiry({name:rec.Name,phone:rec.Mobile,email:rec.Email||'',topic:rec.Request,message:JSON.stringify(rec),ref,source:'concierge'});
    const lines=['أتيليه هُدى — كونسيرج '+ref,...Object.entries(rec).map(([k,v])=>k+': '+v),'الموقع: '+SITE];
    window.open(WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank');
  });

  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function sid(){
    let id=localStorage.getItem('ah-sid');
    if(!id){id='s-'+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('ah-sid',id)}
    return id;
  }
  function localPush(key,row){
    const all=JSON.parse(localStorage.getItem(key)||'[]');
    all.unshift(Object.assign({},row,{at:new Date().toISOString()}));
    localStorage.setItem(key,JSON.stringify(all.slice(0,250)));
  }
  async function sb(){
    const cfg=window.ATELIER_SUPABASE||{};
    if(!cfg.url||!cfg.anonKey) return null;
    if(!window._sb){
      const mod=await import('https://esm.sh/@supabase/supabase-js@2');
      window._sb=mod.createClient(cfg.url,cfg.anonKey);
    }
    return window._sb;
  }
  async function mailAlert(subject,body){
    const to=(window.ATELIER_SUPABASE&&window.ATELIER_SUPABASE.notifyEmail)||'concierge@atelierhuda.com';
    try{
      await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(to),{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({_subject:subject,message:body,source:SITE})
      });
    }catch(e){}
  }
  async function saveInquiry(row){
    row.session=sid(); row.page=location.pathname; row.ref=row.ref||('AH-Q-'+Date.now().toString(36).toUpperCase());
    localPush('ah-inquiries',row);
    try{
      const s=await sb();
      if(s){
        let client_id=null;
        if(row.phone||row.email){
          const {data}=await s.from('clients').insert({name:row.name||'زائرة',phone:row.phone||'',email:row.email||'',city:row.city||''}).select('id').single();
          client_id=data&&data.id;
        }
        await s.from('inquiries').insert({client_id,name:row.name,phone:row.phone,email:row.email,topic:row.topic,message:row.message,source:row.source||'site',ref:row.ref,session_id:row.session,page:row.page});
      }
    }catch(err){console.warn('supabase',err)}
    if(row.source!=='agent' && row.source!=='visit'){
      mailAlert('أتيليه هُدى — '+row.topic+' '+row.ref, JSON.stringify(row,null,2));
    }
    return row.ref;
  }
  async function savePreorder(rec){
    rec.session=sid();
    localPush('ah-preorders',rec);
    try{
      const s=await sb();
      if(s){
        await s.from('preorders').insert({
          ref:rec.ref, items:rec.items, total:rec.total, page:rec.page,
          guidance:rec.guidance, session_id:rec.session, source:'preorder',
          privilege_percent:privilegePct(rec.items||[]),
          privilege_expires:new Date(Date.now()+45*24*60*60*1000).toISOString()
        });
        await s.from('client_log').insert({kind:'preorder',payload:rec});
      }
    }catch(e){console.warn(e)}
    mailAlert('طلب مسبق '+rec.ref, JSON.stringify(rec,null,2));
  }
  async function logEvent(kind,payload){
    const row={kind,payload,session:sid(),page:location.pathname};
    localPush('ah-log',row);
    try{const s=await sb(); if(!s) return; await s.from('client_log').insert({kind,payload:row});}catch(e){}
  }
  async function trackVisit(){
    const row={path:location.pathname+location.search,ref:document.referrer||'',ua:navigator.userAgent.slice(0,180),session:sid()};
    localPush('ah-visits',row);
    try{const s=await sb(); if(!s) return; await s.from('visits').insert({path:row.path,referrer:row.ref,ua:row.ua,session_id:row.session});}catch(e){}
  }
  trackVisit();

  /* clickable item ritual modal */
  if(!q('.item-modal')){
    document.body.insertAdjacentHTML('beforeend','<div class="item-modal"><div class="item-sheet"><div class="item-media"></div><div class="item-copy"></div></div></div>');
  }
  const modal=q('.item-modal');
  function closeItem(){modal?.classList.remove('open');if(!drawer?.classList.contains('open')&&!cartEl?.classList.contains('open'))overlay?.classList.remove('show')}
  modal?.addEventListener('click',e=>{if(e.target===modal)closeItem()});
  function openItem(el){
    const img=el.querySelector('img,video');
    const title=(el.querySelector('h2,h3')||{}).textContent||el.dataset.title||'';
    const ritual=el.dataset.ritual||el.getAttribute('data-ritual')||'';
    const extra=[...el.querySelectorAll('p')].map(p=>p.textContent).join('\n');
    const media=q('.item-media'); const copy=q('.item-copy');
    media.innerHTML='';
    if(img){const c=img.cloneNode(true); if(c.tagName==='VIDEO'){c.controls=true;c.autoplay=true;c.muted=true} media.appendChild(c)}
    else media.innerHTML='<div style="min-height:280px;background:#111"></div>';
    copy.innerHTML='<div class="k">طقس الدار</div><h2>'+esc(title)+'</h2><p>'+esc(ritual||extra)+'</p><p>'+esc(extra)+'</p><div class="item-actions"><button type="button" class="ghost" data-close-item>إغلاق</button><a href="concierge.html">كونسيرج</a></div>';
    copy.querySelector('[data-close-item]').onclick=closeItem;
    const add=el.querySelector('[data-add]');
    if(add){
      const b=document.createElement('button');
      b.textContent='طلب مسبق';
      b.onclick=()=>{addToCart(add.dataset.add,add.dataset.name,add.dataset.brand,+add.dataset.price);closeItem()};
      copy.querySelector('.item-actions').appendChild(b);
    }
    modal.classList.add('open'); overlay?.classList.add('show');
    logEvent('item_open',{title,page:location.pathname});
  }
  qa('.product,.soft-card,[data-ritual]').forEach(el=>{
    el.addEventListener('click',e=>{
      if(e.target.closest('a,button')) return;
      openItem(el);
    });
  });

  /* knowledge + scoped live reply */
  const KB=[
    {k:['عرس','عروس','زواج','bridal','wedding','زفاف'],a:'ليلة العرس عند هدى تُبنى من البروفة لا من صباح مستعجل. نحتاج التاريخ والمدينة ودرجة الخصوصية. اكتبي للكونسيرج أو اضغطي Services ثم Couture Bridal.'},
    {k:['سعر','اسعار','كم','price','تكلفة'],a:'لا قائمة مفتوحة لكل وجه. العرس يُسعَّر بعد فهم الليلة. منتجات THE EDIT بأسعار مرجعية ظاهرة. جلسة مكياج النفس من 1,250 ر.س. التدريب المهني من 3,900 ر.س.'},
    {k:['خصم','امتياز','privilege'],a:'بعد طلب مكياج مؤهل مكتمل: ١٠٪، ١٥٪ من ١٬٥٠٠ ر.س، ٢٠٪ من ٣٬٠٠٠ ر.س أو مع حقيبة الضوء الحجازي. على Event Signature أو Skin Architecture خلال ٤٥ يوماً. العرس الكامل والسفر مستثنيان.'},
    {k:['فنتي','fenty','كلوات','killawatt','هايلايتر'],a:'علبة فينتي السداسية تظهر في يد هدى. Killawatt ضوء على أعلى الخد لا طبقة لامعة. اطلبيه من صفحة The Edit.'},
    {k:['شارلوت','تيلبوري','pillow','فم','روج'],a:'Pillow Talk لفم يبدو لونكِ. الدرجة تُضبط حسب دفء بشرتكِ من الكونسيرج قبل الشحن.'},
    {k:['ديور','dior','فاونديشن','اساس'],a:'Forever Skin Glow أساس تبقى فيه البشرة مرئية. الدرجة تُقاس على الفك. متوفر للطلب المسبق في The Edit.'},
    {k:['دورة','تدريب','اكاديم','academy','ورشة'],a:'مسارات للأفراد والفنانات وفرق الصالونات وأونلاين موجَّه. المقاعد بعد ملف. افتحي Academy واضغطي على المسار لتقرأي الطقس.'},
    {k:['رقمي','كتاب','فيديو','digital','شارت'],a:'المكتبة الرقمية: دليل البشرة، خريطة العروس، فيديو الضوء الحجازي، ثبات الليلة، مخطط الحقيبة، فيس شارت. التسليم عبر الكونسيرج.'},
    {k:['جدة','وين','موقع','location','عنوان'],a:'الدار في جدة. الخدمة تأتي إلى الفيلا أو الجناح. الموقع الإلكتروني: '+SITE},
    {k:['رقم','واتس','تواصل','contact','حجز'],a:'الكونسيرج: +966 54 556 5606. إنستغرام hudaoalamoudi. الموقع: '+SITE},
    {k:['هدى','من هي','about','العلام'],a:'هدى العمودي، خبيرة تجميل وأخصائية عرائس، مدربة معتمدة من المؤسسة العامة. تعمل بالرداء الأسود وتبني الوجه كعمل تحريري.'},
    {k:['خصوص','تصوير','صامت'],a:'أتيليه صامت: لا تصوير لوجهكِ بلا إذنكِ. يمكن اختيار خصوصية مشددة من نموذج الكونسيرج.'}
  ];
  function localReply(text){
    const t=text.toLowerCase();
    let best=null,score=0;
    KB.forEach(row=>{
      const s=row.k.reduce((n,k)=>n+(t.includes(k)?k.length:0),0);
      if(s>score){score=s;best=row}
    });
    if(score>=3) return best.a;
    return '';
  }
  const SYSTEM='أنتِ مساعدة أتيليه هُدى في جدة فقط. تجيبين بالعربية الفصيحة القصيرة، للمكياج والعرس والتدريب ومنتجات THE EDIT والحجز. لا تتحدثين عن مواضيع خارج الدار. لا أسعار نهائية للعرس. هاتف +966545565606. الموقع '+SITE+' إنستغرام hudaoalamoudi. إذا طُلب منك شيء خارج النطاق اعتذري بلطف وأعيدي الزائرة إلى الكونسيرج.';
  async function liveReply(text){
    const prompt=SYSTEM+'\nسؤال الزائرة: '+text+'\nالجواب:';
    const ctrl=new AbortController();
    const t=setTimeout(()=>ctrl.abort(),7000);
    try{
      const r=await fetch('https://text.pollinations.ai/'+encodeURIComponent(prompt),{signal:ctrl.signal});
      clearTimeout(t);
      if(!r.ok) return '';
      const a=(await r.text()).trim();
      if(a.length<8||a.length>700) return '';
      return a;
    }catch(e){clearTimeout(t);return ''}
  }
  async function answer(text){
    const clean=text.trim();
    if(clean.length<3) return 'اكتبي سؤالكِ بجملة قصيرة: عرس، منتج، دورة، أو حجز.';
    const loc=localReply(clean);
    if(loc) return loc;
    const live=await liveReply(clean);
    if(live) return live;
    return 'أقدر أساعدكِ داخل الدار فقط: عرس، منتجات The Edit، أكاديمية، خدمات، أو حجز. اكتبي الموضوع بوضوح أو اتركي اسمكِ وجوالكِ في الكونسيرج.';
  }

  if(!q('.agent')){
    const el=document.createElement('div');
    el.className='agent';
    const pos=JSON.parse(localStorage.getItem('ah-agent-pos')||'null')||{right:18,bottom:18};
    el.style.right=pos.right+'px'; el.style.bottom=pos.bottom+'px';
    el.innerHTML='<div class="agent-box"><div class="agent-log"><p class="bot">مساعدة الدار. اسألي عن العرس، المنتج، التدريب أو الحجز.</p></div><p class="agent-hint">اسحبي الدائرة الذهبية لأي زاوية.</p><form><input name="q" placeholder="اكتبي سؤالكِ" autocomplete="off" dir="rtl"><button type="submit">إرسال</button></form></div><button class="agent-fab" type="button" aria-label="مساعدة الدار"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#f4e7c8" stroke-width="1.4"/><path d="M16 30c2-6 14-6 16 0" stroke="#f4e7c8" stroke-width="1.4"/><path d="M18 20h2M28 20h2" stroke="#f4e7c8" stroke-width="2" stroke-linecap="round"/><path d="M24 10v4M24 34v4" stroke="#f4e7c8" stroke-width="1"/></svg></button>';
    document.body.appendChild(el);
    const log=el.querySelector('.agent-log');
    const fab=el.querySelector('.agent-fab');
    let drag=false,sx=0,sy=0,sr=0,sb=0,moved=0;
    fab.addEventListener('pointerdown',e=>{
      drag=true; moved=0; fab.setPointerCapture(e.pointerId);
      sx=e.clientX; sy=e.clientY; sr=parseInt(el.style.right)||18; sb=parseInt(el.style.bottom)||18;
    });
    fab.addEventListener('pointermove',e=>{
      if(!drag) return;
      const dx=e.clientX-sx, dy=e.clientY-sy;
      if(Math.abs(dx)+Math.abs(dy)>4) moved=1;
      el.style.right=Math.max(8,sr-dx)+'px';
      el.style.bottom=Math.max(8,sb-dy)+'px';
    });
    fab.addEventListener('pointerup',()=>{
      drag=false;
      localStorage.setItem('ah-agent-pos',JSON.stringify({right:parseInt(el.style.right)||18,bottom:parseInt(el.style.bottom)||18}));
      if(!moved) el.classList.toggle('open');
    });
    el.querySelector('form').addEventListener('submit',async ev=>{
      ev.preventDefault();
      const input=ev.currentTarget.q;
      const val=input.value.trim(); if(!val) return;
      log.insertAdjacentHTML('beforeend','<p class="me">'+esc(val)+'</p>');
      input.value='';
      const wait=document.createElement('p'); wait.className='bot'; wait.textContent='...';
      log.appendChild(wait); log.scrollTop=log.scrollHeight;
      const ans=await answer(val);
      wait.textContent=ans;
      log.scrollTop=log.scrollHeight;
      if(val.length>=3) await saveInquiry({name:'زائرة',phone:'',email:'',topic:'agent',message:val,source:'agent',answer:ans});
    });
  }
})();
