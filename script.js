
(() => {
  const form=document.getElementById('requestForm'),annual=document.getElementById('annual'),promoCount=document.getElementById('promoCount');
  const launchLabel=document.getElementById('launchLabel'),launchCost=document.getElementById('launchCost'),promoLabel=document.getElementById('promoLabel'),promoCost=document.getElementById('promoCost'),annualCost=document.getElementById('annualCost'),totalCost=document.getElementById('totalCost'),result=document.getElementById('result'),smsLink=document.getElementById('smsLink');
  let requestText='';
  const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  const selectedSite=()=>document.querySelector('input[name="siteType"]:checked');
  function calculate(){
    const site=selectedSite(),launch=Number(site.dataset.price),count=Math.max(0,Math.min(20,Number(promoCount.value)||0));
    promoCount.value=count;
    const promotions=count*10,annualAmount=annual.checked?240:0;
    launchLabel.textContent='Lancement du '+site.value.toLowerCase();
    launchCost.textContent=euro(launch);
    promoLabel.textContent=count>1?'Mise en avant de '+count+' produits':'Mise en avant de produits';
    promoCost.textContent=euro(promotions);annualCost.textContent=euro(annualAmount);totalCost.textContent=euro(launch+promotions+annualAmount);
    return{site:site.value,launch:launch,count:count,promotions:promotions,annualAmount:annualAmount,total:launch+promotions+annualAmount};
  }
  document.querySelectorAll('input[name="siteType"]').forEach(el=>el.addEventListener('change',calculate));
  annual.addEventListener('change',calculate);promoCount.addEventListener('input',calculate);
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const estimate=calculate(),name=document.getElementById('clientName').value.trim(),phone=document.getElementById('clientPhone').value.trim(),activity=document.getElementById('activity').value.trim(),needs=document.getElementById('needs').value.trim();
    const lines=['Bonjour, je souhaite des renseignements pour mon site web.','Nom : '+name,phone?'Téléphone : '+phone:'',activity?'Activité : '+activity:'','Type de site : '+estimate.site+' ('+euro(estimate.launch)+' au lancement)',estimate.count?'Mise en avant : '+estimate.count+' annonce(s), '+euro(estimate.promotions):'',estimate.annualAmount?'Sécurisation et modifications : abonnement annuel à 20 €/mois (240 €/an)':'','Budget estimé la première année : '+euro(estimate.total),'Mon besoin : '+needs].filter(Boolean);
    requestText=lines.join('\n');const separator=/iPhone|iPad|iPod/i.test(navigator.userAgent)?'&':'?';smsLink.href='sms:+33787458776'+separator+'body='+encodeURIComponent(requestText);result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  document.getElementById('copyRequest').addEventListener('click',async()=>{
    const button=document.getElementById('copyRequest');
    try{await navigator.clipboard.writeText(requestText);button.textContent='Texte copié';setTimeout(()=>button.textContent='Copier le texte',2200)}
    catch(_){const helper=document.createElement('textarea');helper.value=requestText;helper.style.position='fixed';helper.style.opacity='0';document.body.appendChild(helper);helper.select();document.execCommand('copy');helper.remove();button.textContent='Texte copié';setTimeout(()=>button.textContent='Copier le texte',2200)}
  });
  const menuToggle=document.getElementById('menuToggle'),navLinks=document.getElementById('navLinks');
  menuToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')});
  navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navLinks.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
  document.getElementById('year').textContent=new Date().getFullYear();calculate();
  if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
})();

