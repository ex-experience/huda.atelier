(function(){
  var MAIL='hussambinhassan92@gmail.com';
  if(window.ATELIER_SUPABASE) window.ATELIER_SUPABASE.notifyEmail=MAIL;
  var _f=window.fetch;
  window.fetch=function(url,opts){
    var u=String(url||'');
    if(/pollinations|atelierhuda\.com/i.test(u)) return Promise.resolve(new Response('{}',{status:204}));
    if(/formsubmit\.co\/ajax\//i.test(u)) url='https://formsubmit.co/ajax/'+encodeURIComponent(MAIL);
    return _f.call(this,url,opts);
  };
  if(!document.getElementById('ah-nav-css')){
    var st=document.createElement('style'); st.id='ah-nav-css';
    st.textContent='.nav-panel{position:fixed;top:0;left:0;right:0;z-index:89;background:#fff;border-bottom:1px solid #111;padding:16px 18px 22px;display:none}.nav-panel.open{display:block}.nav-panel a{display:block;padding:10px 0;border-bottom:1px solid #eee;font-size:14px}.nav-panel .close{border:0;background:0;float:right;font-size:22px}';
    document.documentElement.appendChild(st);
  }
  function boot(){
    document.querySelectorAll('a[href*="github.com/ex-experience"]').forEach(function(a){a.remove()});
    document.body.querySelectorAll('*').forEach(function(n){
      if(n.children.length) return;
      if(n.textContent&&/atelierhuda\.com/.test(n.textContent)) n.textContent=n.textContent.replace(/concierge@atelierhuda\.com/g,'');
    });
    document.querySelectorAll('video[autoplay]').forEach(function(v){v.removeAttribute('autoplay');v.preload='none'});
    if(!document.querySelector('.nav-panel')){
      var p=document.createElement('nav'); p.className='nav-panel';
      p.innerHTML='<button type="button" class="close" data-close-nav>×</button><a href="index.html">Portfolio</a><a href="services.html">Services</a><a href="shop.html">The Edit</a><a href="academy.html">Academy</a><a href="digital.html">Digital</a><a href="concierge.html">Concierge</a>';
      document.body.appendChild(p);
      function open(){p.classList.add('open')} function close(){p.classList.remove('open')}
      document.querySelectorAll('.menu-btn').forEach(function(b){
        b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();p.classList.contains('open')?close():open()},true);
      });
      p.querySelector('[data-close-nav]').onclick=close;
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
