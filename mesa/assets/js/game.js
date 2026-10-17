(() => {
  let state = ANV.unlock(ANV.load()); ANV.save(state);
  const params = new URLSearchParams(location.search);
  const role = params.get('role') || state.role || 'gm';
  state.role = role; ANV.save(state);
  document.body.classList.toggle('is-player', role !== 'gm');
  document.querySelector('#roleButton').textContent = role === 'gm' ? 'M' : 'J';

  const chars = [
    ['Octávio','Testemunha','Ferido pelo impossível'],
    ['Baltazar','Desconhecido','Algo nele não está quieto'],
    ['Damião','Marcado','Observa mais do que diz'],
    ['Turak','Humano','O único sem pacto aparente']
  ];
  const list = document.querySelector('#characterList');
  chars.forEach(([name,tag,desc],i)=>{
    const el=document.createElement('article'); el.className='character-row';
    el.innerHTML=`<span class="char-avatar">${name[0]}</span><div><strong>${name}</strong><small>${tag}</small></div><span class="hp">${[14,16,13,18][i]}/${[14,16,13,18][i]}</span>`;
    list.appendChild(el);
  });

  function renderClues(){
    const box=document.querySelector('#clueList'); box.innerHTML='';
    const plotClues = state.plots.filter(p=>p.status==='completed' && p.reveal).map(p=>({title:p.title,text:p.reveal}));
    [...state.clues.filter(c=>c.visible), ...plotClues].forEach(c=>{
      const e=document.createElement('article');e.className='clue-card';e.innerHTML=`<strong>${esc(c.title)}</strong><p>${esc(c.text)}</p>`;box.appendChild(e);
    });
    if(!box.children.length) box.innerHTML='<p class="empty-note">Nenhuma pista registrada.</p>';
  }
  function renderLog(){
    const box=document.querySelector('#sessionLog');box.innerHTML='';
    state.logs.slice().reverse().forEach(l=>{const e=document.createElement('div');e.className='log-item';e.innerHTML=`<time>${esc(l.time)}</time><span>${esc(l.text)}</span>`;box.appendChild(e)});
  }
  function log(text){ const d=new Date();state.logs.push({time:d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),text});ANV.save(state);renderLog(); }
  function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
  renderClues();renderLog();

  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    document.querySelectorAll('[data-panel]').forEach(x=>x.classList.toggle('active',x.dataset.panel===b.dataset.tab));
  });
  document.querySelectorAll('[data-die]').forEach(b=>b.onclick=()=>{
    const die=+b.dataset.die, value=ANVDice.roll(`1d${die}`).total;document.querySelector('#rollResult').textContent=value;log(`Rolagem d${die}: ${value}`);
  });
  document.querySelectorAll('.hotspot').forEach(b=>b.onclick=()=>{document.querySelector('#secretText').textContent=b.dataset.secret;document.querySelector('#secretDialog').showModal();log('O Mestre revelou uma percepção oculta.');});
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  document.querySelector('#btnJournal').onclick=()=>{
    document.querySelector('#journalContent').innerHTML=state.plots.filter(p=>p.status==='completed').map(p=>`<article class="journal-entry"><small>ATO ${p.act}</small><h3>${esc(p.title)}</h3><p>${esc(p.reveal||p.summary)}</p></article>`).join('') || '<p class="empty-note">A história ainda não deixou marcas suficientes.</p>';
    document.querySelector('#journalDialog').showModal();
  };
  let scale=1; const world=document.querySelector('#mapWorld');
  function applyScale(){world.style.transform=`scale(${scale})`;}
  document.querySelector('#zoomIn').onclick=()=>{scale=Math.min(1.5,scale+.1);applyScale()};document.querySelector('#zoomOut').onclick=()=>{scale=Math.max(.7,scale-.1);applyScale()};
  document.querySelectorAll('.player-token').forEach(token=>{
    let dragging=false,ox=0,oy=0;
    token.addEventListener('pointerdown',e=>{dragging=true;token.setPointerCapture(e.pointerId);const r=token.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;});
    token.addEventListener('pointermove',e=>{if(!dragging)return;const r=world.getBoundingClientRect();token.style.left=`${Math.max(0,Math.min(96,(e.clientX-r.left-ox)/r.width*100))}%`;token.style.top=`${Math.max(0,Math.min(94,(e.clientY-r.top-oy)/r.height*100))}%`;});
    token.addEventListener('pointerup',()=>{if(dragging){dragging=false;log(`${token.dataset.name} se moveu pelo mapa.`)}});
  });
})();
