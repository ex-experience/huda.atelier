(function(){
  const _fetch=window.fetch;
  window.fetch=function(url,opts){
    const u=String(url||'');
    if(/pollinations|atelierhuda\.com/i.test(u)) return Promise.resolve(new Response('{}',{status:204}));
    return _fetch.apply(this,arguments);
  };
  if(window.ATELIER_SUPABASE) window.ATELIER_SUPABASE.notifyEmail='hussambinhassan@gmail.com';
})();
