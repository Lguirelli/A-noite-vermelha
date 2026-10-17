(() => {
  let state = ANV.unlock(ANV.load()); ANV.save(state); let filter='all';
  const statusLabel={locked:'Bloqueado',available:'Disponível',active:'Ativo',completed:'Concluído',lost:'Perdido'};
  const board=document.querySelector('#plotBoard');
  function render(){
    state=ANV.unlock(state);ANV.save(state);board.innerHTML='';
    const acts=[...new Set(state.plots.map(p=>p.act))];
    for(const act of acts){
      const pts=state.plots.filter(p=>p.act===act && (filter==='all'||p.type===filter)); if(!pts.length)continue;
      const section=document.createElement('section');section.className='act-section';section.innerHTML=`<div class="act-heading"><span>ATO ${act}</span><small>${pts.filter(p=>p.status==='completed').length}/${pts.length} concluídos</small></div><div class="plot-grid-static"></div>`;
      const grid=section.querySelector('.plot-grid-static');
      pts.forEach(p=>{
        const card=document.createElement('article');card.className=`plot-card-static ${p.type} status-${p.status}`;
        const lose=p.canLose?`<button class="plot-action danger" data-action="lost">Perder</button>`:'';
        card.innerHTML=`<div class="plot-top"><span class="plot-type">${p.type==='fixed'?'FIXO':'MÓVEL'}</span><span class="status-chip">${statusLabel[p.status]}</span></div><h3>${p.title}</h3><p>${p.summary}</p><div class="plot-deps">${p.depends?.length?`Depende de: ${p.depends.map(id=>state.plots.find(x=>x.id===id)?.title||id).join(', ')}`:'Sem pré-requisito'}</div><div class="plot-buttons"><button class="plot-action" data-action="active">Ativar</button><button class="plot-action success" data-action="completed">Concluir</button>${lose}<button class="plot-action subtle" data-action="available">Reabrir</button></div>`;
        card.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>setStatus(p.id,b.dataset.action));grid.appendChild(card);
      });board.appendChild(section);
    }
    const done=state.plots.filter(p=>p.status==='completed').length,total=state.plots.length;document.querySelector('#progressText').textContent=`${done} / ${total}`;document.querySelector('#progressBar').style.width=`${total?done/total*100:0}%`;
    document.querySelector('#storyState').innerHTML=`<div><small>ATO</small><strong>${state.story.act}</strong></div><div><small>MEDO DA CIDADE</small><strong>${state.story.fear}%</strong></div><div><small>PACTOS</small><strong>${state.story.pactKnowledge}%</strong></div><div><small>CONFIANÇA EM VILAR</small><strong>${state.story.vilarTrust}%</strong></div>`;
    const log=document.querySelector('#narrativeLog');log.innerHTML=state.narrativeLog.slice().reverse().slice(0,12).map(x=>`<div class="narrative-log-row"><time>${x.time}</time><span>${x.text}</span></div>`).join('')||'<p class="empty-note">Nenhuma alteração ainda.</p>';
  }
  function setStatus(id,status){
    const p=state.plots.find(x=>x.id===id);if(!p)return;if(status==='lost'&&!p.canLose)return;
    if(p.status==='locked'&&status==='active'){alert('Este ponto ainda está bloqueado pelos pré-requisitos.');return;}
    p.status=status;
    const time=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});state.narrativeLog.push({time,text:`${p.title} → ${statusLabel[status]}`});
    if(status==='completed'){
      if(p.id==='arrival') state.story.fear=Math.max(state.story.fear,45);
      if(p.id==='old-man') state.story.pactKnowledge+=10;
      if(p.id==='book') state.story.pactKnowledge+=20;
      if(p.id==='marked-names') state.story.act=2;
    }
    ANV.save(state);render();
  }
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();});
  document.querySelector('#resetNarrative').onclick=()=>{if(confirm('Resetar todo o estado local do protótipo?')){state=ANV.reset();render();}};
  render();
})();
