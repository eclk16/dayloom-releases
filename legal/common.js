(function(){
  var S=window.DAYLOOM_SELLER||{}, html=document.documentElement;
  document.querySelectorAll('[data-seller]').forEach(function(el){el.textContent=S[el.getAttribute('data-seller')]||'';});
  document.querySelectorAll('.box > div').forEach(function(row){var f=row.querySelectorAll('[data-seller]');var any=false;f.forEach(function(x){if(x.textContent)any=true;});if(f.length&&!any)row.style.display='none';});
  document.querySelectorAll('[data-seller=email]').forEach(function(el){if(el.textContent&&!el.closest('a')){var a=document.createElement('a');a.href='mailto:'+el.textContent;a.textContent=el.textContent;el.textContent='';el.appendChild(a);}});
  var saved=null;try{saved=localStorage.getItem('dayloom-lang');}catch(e){}
  var l=saved?(saved==='tr'?'tr':'en'):((navigator.language||'').toLowerCase().indexOf('tr')===0?'tr':'en');
  var b=document.getElementById('lng');
  function set(x){html.lang=x;b.textContent=x==='tr'?'English':'Türkçe';}
  set(l);b.onclick=function(){var x=html.lang==='tr'?'en':'tr';try{localStorage.setItem('dayloom-lang',x);}catch(e){}set(x);};
})();
