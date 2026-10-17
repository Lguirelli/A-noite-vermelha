(() => {
 const $=s=>document.querySelector(s);
 const isLanding=!!$('.hero'),isGame=!!$('.play-area');
 function pager(host,items){
  const nav=document.createElement('nav');nav.className='screen-nav';nav.setAttribute('aria-label','Páginas');nav.innerHTML='<button type="button" aria-label="Página anterior">←</button><span aria-live="polite"></span><button type="button" aria-label="Próxima página">→</button>';host.append(nav);
  let page=0,pages=[],queued=false;
  const body=document.createElement('div');body.className='page-body';for(const n of [...host.children])if(n!==nav)body.append(n);host.prepend(body);
  function paint(){items().forEach(n=>n.classList.add('page-hidden'));(pages[page]||[]).forEach(n=>n.classList.remove('page-hidden'));nav.children[1].textContent=`${page+1} / ${Math.max(1,pages.length)}`;nav.children[0].disabled=page===0;nav.children[2].disabled=page>=pages.length-1;}
  function measure(){queued=false;if(host.hidden||!host.clientHeight)return;const nodes=items();nodes.forEach(n=>{n.classList.add('page-hidden');n.style.zoom='';});pages=[];let group=[];
   for(const n of nodes){n.classList.remove('page-hidden');if(body.scrollHeight>body.clientHeight+1&&group.length){group.forEach(x=>x.classList.add('page-hidden'));pages.push(group);group=[];}if(body.scrollHeight>body.clientHeight+1){n.style.zoom=Math.min(1,body.clientHeight/n.getBoundingClientRect().height)*.97;}group.push(n);}
   if(group.length)pages.push(group);page=Math.min(page,Math.max(0,pages.length-1));paint();
  }
  function schedule(reset=false){if(reset)page=0;if(!queued){queued=true;requestAnimationFrame(measure);}}
  nav.children[0].onclick=()=>{page--;paint()};nav.children[2].onclick=()=>{page++;paint()};
  new MutationObserver(()=>schedule(true)).observe(body,{childList:true,subtree:true,characterData:true});host.addEventListener('toggle',()=>schedule(),true);new ResizeObserver(()=>schedule()).observe(host);schedule();return ()=>schedule();
 }
 if(isLanding){pager($('.about'),()=>[...document.querySelectorAll('.about-heading,.steps>article,.practical>p,.practical>a')]);document.body.classList.add('viewport-landing');function show(id){const sections=[...document.querySelectorAll('main>section')];if(!sections.some(s=>s.id===id))id='inicio';sections.forEach(s=>{s.classList.toggle('active-screen',s.id===id);s.inert=s.id!==id;});}document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(document.getElementById(id)?.tagName==='SECTION'){e.preventDefault();show(id);history.replaceState(null,'','#'+id);}}));show(location.hash.slice(1));window.addEventListener('hashchange',()=>show(location.hash.slice(1)));}
 if($('.gm-shell')){document.body.classList.add('viewport-gm');pager($('.gm-shell'),()=>[...document.querySelectorAll('#gmGate:not([hidden]),#gmContent:not([hidden])>h1,#gmContent:not([hidden])>p,#gmContent:not([hidden]) .gm-box>h2,#gmContent:not([hidden]) .gm-box>p,#gmContent:not([hidden]) .gm-box>details,#gmContent:not([hidden]) .plot,#gmContent:not([hidden]) .variables')]);}
 if($('.game-shell')){document.body.classList.add('viewport-map');const shell=$('.game-shell'),panel=$('.right-panel');const nav=document.createElement('nav');nav.className='screen-tabs';nav.innerHTML='<button>Mapa</button><button>Caderno</button>';$('.topbar').after(nav);const update=pager(panel,()=>[...panel.querySelectorAll('.panel-content.active .panel-label,.panel-content.active #characterList>*,.panel-content.active #clueList>*,.panel-content.active #sessionLog>*,.panel-content.active .presence-card')]);function view(show){shell.classList.toggle('show-panel',show);nav.children[0].setAttribute('aria-pressed',String(!show));nav.children[1].setAttribute('aria-pressed',String(show));update();}nav.children[0].onclick=()=>view(false);nav.children[1].onclick=()=>view(true);panel.addEventListener('click',()=>requestAnimationFrame(update));view(false);}
 if(isGame){document.body.classList.add('viewport-game');const main=$('.layout'),play=$('.play-area'),journal=$('.journal');const tabs=document.createElement('nav');tabs.className='screen-tabs';tabs.setAttribute('aria-label','Telas do jogo');$('.topbar').after(tabs);
  const notes=$('.notes'),dice=$('.dice');notes.open=dice.open=true;const panes=[play,journal];for(const detail of [notes,dice]){const pane=document.createElement('section');pane.className='screen-pane';pane.style.cssText='height:100%;padding:12px 0;display:flex;flex-direction:column';main.append(pane);pane.append(detail);detail.querySelector('summary').hidden=true;panes.push(pane);}
  const refresh=[];function show(i){panes.forEach((p,j)=>p.hidden=i!==j);[...tabs.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));refresh[i]?.();}
  ['Cena','Caderno','Anotações','Dados'].forEach((label,i)=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>show(i);tabs.append(b);});
  refresh[0]=pager(play,()=>[...play.querySelectorAll('#saveWarning:not([hidden]),#scene>* ,.section-label,#actions>button,#endTools:not([hidden])')]);
  refresh[1]=pager(journal,()=>[...journal.querySelectorAll('#journalContent>*')]);
  refresh[2]=pager(panes[2],()=>[notes]);refresh[3]=pager(panes[3],()=>[dice]);
  $('#reviewEnd').addEventListener('click',()=>show(1));show(0);
 }
})();
(() => {
 function fit(d){if(!d.open)return;d.style.zoom='1';d.style.setProperty('max-height','none','important');if(d.classList.contains('character-dialog'))return;const rect=d.getBoundingClientRect();d.style.zoom=String(Math.min(1,(innerHeight-24)/Math.max(rect.height,d.scrollHeight),(innerWidth-24)/Math.max(rect.width,d.scrollWidth)));}
 document.querySelectorAll('dialog').forEach(d=>{new MutationObserver(()=>requestAnimationFrame(()=>fit(d))).observe(d,{attributes:true,attributeFilter:['open'],childList:true,subtree:true,characterData:true});window.addEventListener('resize',()=>fit(d));});
})();
