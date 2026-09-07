(function(){
  const _fetch=window.fetch;
  window.fetch=function(url,opts){
    const u=String(url||'');
    if(/pollinations|atelierhuda\.com/i.test(u)) return Promise.resolve(new Response('{}',{status:204}));
    return _fetch.apply(this,arguments);
  };
  if(window.ATELIER_SUPABASE) window.ATELIER_SUPABASE.notifyEmail='hussambinhassan@gmail.com';
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href*="github.com/ex-experience"],a[href*="ex-experience.github.io/dossier"]').forEach(a=>a.remove());
    document.querySelectorAll('video[autoplay]').forEach(v=>{v.removeAttribute('autoplay');v.preload='none';});
  });
})();
