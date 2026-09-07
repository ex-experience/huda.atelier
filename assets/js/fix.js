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
})();
