(function(){
  var MAIL='hussambinhassan92@gmail.com';
  if(window.ATELIER_SUPABASE) window.ATELIER_SUPABASE.notifyEmail=MAIL;
  var _f=window.fetch;
  window.fetch=function(url,opts){
    var u=String(url||'');
    if(/pollinations|atelierhuda\.com/i.test(u)) return Promise.resolve(new Response('{}',{status:204}));
    if(/formsubmit\.co\/ajax\//i.test(u)){
      url='https://formsubmit.co/ajax/'+encodeURIComponent(MAIL);
    }
    return _f.call(this,url,opts);
  };
  function boot(){
    document.querySelectorAll('a[href*="github.com/ex-experience"],a[href*="ex-experience.github.io/dossier"]').forEach(function(a){a.remove()});
    document.body.querySelectorAll('*').forEach(function(n){
      if(n.children.length) return;
      if(n.textContent&&/concierge@atelierhuda\.com/.test(n.textContent)) n.textContent=n.textContent.replace(/concierge@atelierhuda\.com/g,'');
    });
    document.querySelectorAll('video').forEach(function(v){
      v.removeAttribute('autoplay'); v.preload='none';
    });
    if(!document.querySelector('.nav-panel')){
      var p=document.createElement('nav');
      p.className='nav-panel';
      p.innerHTML='<button type="button" class="close" data-close-nav>×</button><a href="index.html">Portfolio</a><a href="services.html">Services</a><a href="shop.html">The Edit</a><a href="academy.html">Academy</a><a href="digital.html">Digital</a><a href="concierge.html">Concierge</a>';
      document.body.appendChild(p);
      var ov=document.querySelector('.overlay');
      function open(){p.classList.add('open'); if(ov) ov.classList.add('show')}
      function close(){p.classList.remove('open')}
      document.querySelectorAll('.menu-btn,[data-nav]').forEach(function(b){
        b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation(); p.classList.contains('open')?close():open()});
      });
      var c=p.querySelector('[data-close-nav]'); if(c) c.addEventListener('click',close);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
