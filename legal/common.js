(function(){
  var S=window.DAYLOOM_SELLER||{}, html=document.documentElement;
  document.querySelectorAll('[data-seller]').forEach(function(el){var v=S[el.getAttribute('data-seller')];if(v)el.textContent=v;else if(el.closest('.opt'))el.closest('.opt').style.display='none';});
  var saved=null;try{saved=localStorage.getItem('dayloom-lang');}catch(e){}
  var l=saved?(saved==='tr'?'tr':'en'):((navigator.language||'').toLowerCase().indexOf('tr')===0?'tr':'en');
  var b=document.getElementById('lng');
  function set(x){html.lang=x;b.textContent=x==='tr'?'English':'Türkçe';}
  set(l);b.onclick=function(){var x=html.lang==='tr'?'en':'tr';try{localStorage.setItem('dayloom-lang',x);}catch(e){}set(x);};
})();
