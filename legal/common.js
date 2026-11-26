// Fills the seller details on the legal pages from seller.js (rows with no value are hidden).
(function(){
  var S=window.DAYLOOM_SELLER||{};
  document.querySelectorAll('[data-seller]').forEach(function(el){el.textContent=S[el.getAttribute('data-seller')]||'';});
  document.querySelectorAll('.box > div').forEach(function(row){var f=row.querySelectorAll('[data-seller]');var any=false;f.forEach(function(x){if(x.textContent)any=true;});if(f.length)row.hidden=!any;});
  document.querySelectorAll('[data-seller=email]').forEach(function(el){if(el.textContent&&!el.closest('a')){var a=document.createElement('a');a.href='mailto:'+el.textContent;a.textContent=el.textContent;el.textContent='';el.appendChild(a);}});
})();
