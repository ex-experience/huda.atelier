(()=>{
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const drawer=q('.drawer'), overlay=q('.overlay');
  const openInfo=()=>{drawer?.classList.add('open');overlay?.classList.add('show')};
  const closeInfo=()=>{drawer?.classList.remove('open');overlay?.classList.remove('show')};
  qa('[data-info]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();openInfo()}));
  q('[data-close-info]')?.addEventListener('click',closeInfo);
  overlay?.addEventListener('click',()=>{closeInfo();closeCart()});
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
    let clone=media.cloneNode(true);
    if(clone.tagName==='VIDEO'){clone.controls=true;clone.autoplay=true;clone.muted=true;clone.loop=true}
    lbm.appendChild(clone);
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
    if(!lb?.classList.contains('open'))return;
    if(e.key==='Escape')closeLb();
    if(e.key==='ArrowLeft')show(idx-1);
    if(e.key==='ArrowRight')show(idx+1);
  });
  let cart=JSON.parse(localStorage.getItem('atelier-huda-edit-cart')||'[]'), cartEl=q('.cart');
  function save(){localStorage.setItem('atelier-huda-edit-cart',JSON.stringify(cart));renderCart()}
  function openCart(){cartEl?.classList.add('open');overlay?.classList.add('show')}
  function closeCart(){cartEl?.classList.remove('open');if(!drawer?.classList.contains('open'))overlay?.classList.remove('show')}
  window.closeCart=closeCart;
  qa('[data-cart-open]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();openCart()}));
  q('[data-cart-close]')?.addEventListener('click',closeCart);
  qa('[data-add]').forEach(b=>b.addEventListener('click',()=>{
    const p={id:b.dataset.add,name:b.dataset.name,brand:b.dataset.brand,price:+b.dataset.price};
    let f=cart.find(x=>x.id===p.id); f?f.qty++:cart.push({...p,qty:1});
    save(); openCart(); logEvent('cart_add',p);
  }));
  function renderCart(){
    const box=q('.cart-items'); if(!box)return;
    box.innerHTML=cart.length?cart.map(x=>'<div class="cart-item"><div>'+x.brand+'<br><strong>'+x.name+'</strong><br>'+x.qty+' × '+x.price+' SAR</div><button data-remove="'+x.id+'">×</button></div>').join(''):'<p class="note">سلتك فارغة بعد.</p>';
    const tot=q('.cart-total strong'); if(tot) tot.textContent=cart.reduce((s,x)=>s+x.price*x.qty,0)+' SAR';
    qa('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==b.dataset.remove);save()});
  }
  q('[data-checkout]')?.addEventListener('click',()=>{
    if(!cart.length)return;
    const lines=['أتيليه هُدى — طلب مسبق',...cart.map(x=>'• '+x.brand+' — '+x.name+' × '+x.qty+' — '+(x.price*x.qty)+' ر.س'),'المجموع المرجعي: '+cart.reduce((s,x)=>s+x.price*x.qty,0)+' ر.س','أؤكد التوفر والدرجة والسعر، وأسأل عن خصم الخدمة بعد الشراء.'];
    logEvent('preorder',{cart});
    window.open('https://wa.me/966545565606?text='+encodeURIComponent(lines.join('\n')),'_blank');
  });
  renderCart();
  q('[data-concierge-form]')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const rec=Object.fromEntries(fd.entries());
    await saveInquiry({name:rec.Name,phone:rec.Mobile,email:rec.Email||'',topic:rec.Request,message:JSON.stringify(rec)});
    const lines=['أتيليه هُدى — طلب كونسيرج',...Object.entries(rec).map(([k,v])=>k+': '+v)];
    window.open('https://wa.me/966545565606?text='+encodeURIComponent(lines.join('\n')),'_blank');
  });
  function localPush(key,row){
    const all=JSON.parse(localStorage.getItem(key)||'[]');
    all.unshift(Object.assign({},row,{at:new Date().toISOString()}));
    localStorage.setItem(key,JSON.stringify(all.slice(0,200)));
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
  async function saveInquiry(row){
    localPush('ah-inquiries',row);
    try{
      const s=await sb(); if(!s) return;
      let client_id=null;
      if(row.phone||row.email){
        const {data}=await s.from('clients').insert({name:row.name||'زائرة',phone:row.phone,email:row.email}).select('id').single();
        client_id=data&&data.id;
      }
      await s.from('inquiries').insert({client_id,name:row.name,phone:row.phone,email:row.email,topic:row.topic,message:row.message,source:row.source||'site'});
    }catch(err){console.warn('supabase',err)}
  }
  async function logEvent(kind,payload){
    localPush('ah-log',{kind,payload});
    try{const s=await sb(); if(!s) return; await s.from('client_log').insert({kind,payload});}catch(e){}
  }
  const knowledge=[
    {k:['عرس','عروس','bridal','زواج'],a:'ليلة العرس عند هدى ليست مكياجاً يُوضع في الصباح. هي بروفة، وخريطة وجه، وبشرة تُهيَّأ قبل أن تقفي أمام العدسة. اكتبي للكونسيرج تاريخكِ ومدينتكِ ودرجة الخصوصية.'},
    {k:['سعر','price','كم'],a:'الأتيليه لا يضع قائمة مفتوحة لكل وجه. العرس يُسعَّر بعد فهم الليلة. منتجات THE EDIT لها سعر مرجعي ظاهر. التدريب الخاص يبدأ تقريباً من 1,250 ر.س.'},
    {k:['خصم','privilege','شراء'],a:'إذا اكتمل طلب مسبق مؤهل من THE EDIT، يصلكِ امتياز 10٪ على Event Signature أو Skin Architecture خلال 45 يوماً. عرس الكوتور والسفر خارج هذه النافذة.'},
    {k:['فنتي','fenty'],a:'هدى تستخدم علبة فينتي السداسية على الوجه. Killawatt يعطي ضوءاً على أعلى الخد دون طبقة بلاستيك. يُطلب مسبقاً من THE EDIT.'},
    {k:['شارلوت','pillow','تيلبوري'],a:'Pillow Talk لفم يبدو لونكِ بعد حياة، لا أحمر مستعار. الدرجة تُضبط حسب دفء البشرة.'},
    {k:['دورة','تدريب','academy','ورشة'],a:'الأكاديمية للأفراد والفنانات وفرق الصالونات. ماستر خاص، عرس احترافي، كاميرا، وورش مؤسسات. المقاعد ليست مفتوحة بلا ملف.'},
    {k:['رقمي','كتاب','فيديو','digital'],a:'المكتبة: دليل البشرة، خريطة العروس، فيديو الضوء الحجازي، بروتوكول الثبات، وفيس شارت. التسليم عبر الكونسيرج.'},
    {k:['جدة','وين','location','عنوان'],a:'أتيليه هُدى في جدة. الخدمة تأتي إلى الفيلا أو الجناح، أو تسافر عند الدعوة.'},
    {k:['رقم','واتس','تواصل','contact'],a:'+966 54 556 5606 — concierge@atelierhuda.com — إنستغرام hudaoalamoudi'},
    {k:['هدى','من هي','about'],a:'هدى العمودي، خبيرة تجميل وأخصائية عرائس، مدربة معتمدة من المؤسسة العامة. تعمل بالرداء الأسود، وتبني الوجه كما يُبنى الثوب.'}
  ];
  function reply(text){
    const t=text.toLowerCase();
    const hit=knowledge.find(x=>x.k.some(k=>t.includes(k)));
    return hit?hit.a:'قولي إن كنتِ تسألين عن عرس، منتج، دورة، أو موعد خاص. أوجّهكِ، ونحفظ السؤال للكونسيرج.';
  }
  if(!q('.agent')){
    const el=document.createElement('div');
    el.className='agent';
    el.innerHTML='<div class="agent-box"><div class="agent-log"><p class="bot">أنا مساعدة الأتيليه. اسألي عن هدى، العرس، المنتجات، الخصم بعد الشراء، أو التدريب.</p></div><form><input name="q" placeholder="اكتبي سؤالكِ…" autocomplete="off"><button type="submit">إرسال</button></form></div><button class="agent-toggle" type="button">مساعدة الدار</button>';
    document.body.appendChild(el);
    const log=el.querySelector('.agent-log');
    el.querySelector('.agent-toggle').onclick=()=>el.classList.toggle('open');
    el.querySelector('form').addEventListener('submit',async ev=>{
      ev.preventDefault();
      const input=ev.currentTarget.q;
      const val=input.value.trim(); if(!val) return;
      log.insertAdjacentHTML('beforeend','<p class="me">'+val+'</p>');
      log.insertAdjacentHTML('beforeend','<p class="bot">'+reply(val)+'</p>');
      input.value=''; log.scrollTop=log.scrollHeight;
      await saveInquiry({name:'زائرة الموقع',phone:'',email:'',topic:'agent',message:val,source:'agent'});
    });
  }
})();
