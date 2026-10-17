(() => {
'use strict';
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storage;try{storage=window.localStorage;}catch{}
const loaded=ANV.load(storage);let state=loaded.state,saveBlocked=Boolean(loaded.error),tab='clues';
if(new URLSearchParams(location.search).get('begin')==='1'&&state.scene==='start')ANV.choose(state,'begin');
if(loaded.error){$('saveWarning').hidden=false;$('saveWarning').textContent=loaded.error;}
function persist(){const ok=!saveBlocked&&ANV.save(state,storage);$('saveStatus').textContent=ok?'Progresso salvo neste navegador':'Sem salvamento automático • exporte uma cópia';if(!ok){$('saveWarning').hidden=false;$('saveWarning').textContent=loaded.error||'O navegador não permitiu salvar. O jogo continua nesta aba; use “Baixar salvamento” antes de fechar.';}return ok;}
function card(title,text,kicker=''){return `<article class="journal-card">${kicker?`<span class="tiny">${esc(kicker)}</span>`:''}<h3>${esc(title)}</h3><p>${esc(text)}</p></article>`;}
const party=[['Octávio','Procura uma obra incompleta. Usa máscara e reconhece fragmentos que não lembra ter aprendido.'],['Damião','A Última Chama acompanha uma dívida que ele ainda tenta compreender.'],['Baltazar','Seu corpo guarda marcas diferentes. Suas decisões pertencem a ele.'],['Turak','Um viajante humano de faro extraordinário, atento ao que os outros deixam passar.']];
function journal(){
 $('clueCount').textContent=state.clues.length?`${state.clues.length} descobertas registradas`:'A noite ainda não deixou pistas.';
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));
 let html='';
 if(tab==='clues')html=state.clues.slice().reverse().map((c,i)=>card(c.title,c.text,`REGISTRO ${String(state.clues.length-i).padStart(2,'0')}`)).join('')||'<p class="empty">Nem todo silêncio é uma resposta. As descobertas aparecerão aqui.</p>';
 if(tab==='party'){
  html=party.map(([name,text],i)=>card(name,text)+`<a class="character-sheet-link" href="assets/images/${['octavio','baltazar','damiao','turak'][i]}.png" target="_blank" rel="noopener">Ver ficha visual de ${esc(name)}</a>`).join('');
  if(state.met_tiao)html+=card('Tião',state.plots.faces==='completed'?'Uma das faces de Vilar. O encontro na cela foi preparado.':'O homem que dividiu a cela e comentou sobre a fazenda.');
  if(state.case_turak)html+=card('Vilar',state.plots.faces==='completed'?'Entidade que selecionou e enquadrou os acontecimentos para dirigir as escolhas do grupo.':'O homem que salvou o motorista e ofereceu ajuda no moinho.');
 }
 if(tab==='names'){
  if(state.book_acquired)html+=card('Octávio • 1871',state.book_known_as_pact_registry?'Seu nome consta num registro de pactos. A data é incompatível com sua idade aparente.':'Seu nome aparece no livro. A data é incompatível com sua idade aparente.');
  if(state.entered.includes('names'))for(const [id,name] of [['bento','Bento Nunes'],['rosa','Rosa Alves'],['joaquim','Joaquim de Sá']])html+=card(name,state.clues.find(c=>c.id===id)?.text||'Três cortes na margem. Um nome a procurar.');
  if(state.entered.includes('body'))html+=card('Helena',state.case_helena?'Dona original da cobrança que Damião escolheu receber. Seu coração foi retirado após sua morte.':'Uma anotação fala de um coração preservado.');
  if(state.case_turak)html+=card('Inês Duarte',state.clues.find(c=>c.id==='eyes')?.text||'Morreu salvando Turak quando ele era criança.');
  html||='<p class="empty">Nenhum nome do livro foi encontrado.</p>';
 }
 if(tab==='investigation'){
  const goals=['Escolham o primeiro passo.','O que levou quatro estranhos à mesma cela?','Por que a família espera uma cobrança?','O que os nomes marcados têm em comum?','O que esses registros dizem sobre cada um?','Quem escolheu quais histórias chegariam ao grupo?','Quem ganha com a decisão de vocês?'];
  html=card('Fio atual',state.ending?'A noite terminou. Revejam o que suas escolhas preservaram e o que custaram.':goals[state.stage]||goals[0]);
  if(state.book_acquired)html+=card('O livro',state.book_known_as_pact_registry?'Sua ligação com pactos foi demonstrada. Nem todos os símbolos foram decifrados.':'Nomes, datas e símbolos. A função do livro ainda não foi demonstrada.');
  if(state.stage>=3)html+=card('Nomes conferidos',`${state.marked_names_investigated} de 3 registros examinados.`);
  if(state.stage>=3)html+=card('A fazenda',state.farm_grandfather_alive?'O avô sobreviveu. A relação com a família permanece parte da história.':'O avô morreu. A família não oferecerá seu relato.');
  html+=card('Condição do grupo',state.injuries===0?'Sem ferimentos registrados.':`${state.injuries} marcas de ferimento na jornada. A dor muda a cena, mas não encerra a investigação.`);
  html+='<details><summary>Registro de escolhas</summary>'+state.logs.filter(l=>!l.private).slice().reverse().map(l=>card(l.text,l.consequence||'')).join('')+'</details>';
 }
 $('journalContent').innerHTML=html;
}
function render(moveFocus=false){
 const scene=STORY.scenes[state.scene];document.body.dataset.act=scene.act;document.title=scene.title+' — A Noite Vermelha';
 $('chapter').textContent=scene.act?`ATO ${scene.act} / 6 · ${['','O ENCONTRO','A DÍVIDA','OS NOMES','AS VIDAS','OS ROSTOS','A ESCOLHA'][scene.act]}`:'UMA HISTÓRIA PARA UMA NOITE';
 const body=typeof scene.body==='function'?scene.body(state):scene.body;
 $('scene').innerHTML=`${state.feedback?`<div class="feedback" role="status"><span class="tiny">A SUA ESCOLHA DEIXOU ISTO</span>${esc(state.feedback)}</div>`:''}<span class="eyebrow">${esc(scene.place)}</span><h1>${esc(scene.title)}</h1>${body.map(p=>`<p>${esc(p)}</p>`).join('')}`;
 const actions=ANV.actions(state);$('actions').innerHTML='';
 for(const [i,a] of actions.entries()){
  const b=document.createElement('button');b.dataset.action=a.id;if(state.scene==='start')b.className='primary';
  b.innerHTML=`<span class="num" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${esc(a.label)}</span><span class="arrow" aria-hidden="true">↗</span>`;
  b.onclick=()=>{ANV.choose(state,a.id);persist();render(true);};$('actions').appendChild(b);
 }
 $('actionCount').textContent=actions.length?`${actions.length} ${actions.length===1?'AÇÃO':'AÇÕES'}`:'';document.querySelector('.actions-wrap').hidden=!actions.length;$('endTools').hidden=!state.ending;
 $('notes').value=state.notes;journal();if(typeof diceWidget!=='undefined')diceWidget.refresh();if(moveFocus){$('scene').focus({preventScroll:true});$('scene').scrollIntoView({behavior:'instant',block:'start'});}
}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;journal();});
$('notes').addEventListener('input',()=>{state.notes=$('notes').value;persist();});
$('menuButton').onclick=()=>{$('options').showModal();};
function confirmAction(title,text,action){$('confirmTitle').textContent=title;$('confirmText').textContent=text;$('confirmDialog').showModal();$('cancelConfirm').onclick=()=>$('confirmDialog').close();$('acceptConfirm').onclick=()=>{$('confirmDialog').close();action();};}
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='a-noite-vermelha-salvamento.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('optionMessage').textContent='Arquivo de salvamento preparado.';};
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2000000)throw new Error('O salvamento deve ter menos de 2 MB.');const next=ANV.validate(JSON.parse(await file.text()));confirmAction('Carregar esta noite?','O progresso atual será substituído. Cancele e exporte primeiro se quiser guardá-lo.',()=>{state=next;saveBlocked=false;$('saveWarning').hidden=true;loaded.error=null;persist();render(true);$('options').close();});}catch(err){$('optionMessage').textContent='Não foi possível carregar: '+err.message;}e.target.value='';};
$('reset').onclick=()=>confirmAction('Começar outra noite?','Isso reinicia somente esta campanha. Exporte o progresso atual antes se quiser guardá-lo.',()=>{state=ANV.fresh();saveBlocked=false;loaded.error=null;$('saveWarning').hidden=true;persist();render(true);$('options').close();});
$('gmButton').onclick=()=>confirmAction('Painel com spoilers','O painel do Mestre mostra estados internos e o planejamento completo. Abra apenas fora da visão dos jogadores.',()=>{location.href='gm.html';});
$('reviewEnd').onclick=()=>{tab='investigation';journal();$('journalContent').scrollIntoView();};
const diceWidget=ANVDice.mount({container:$('diceWidget'),getHistory:()=>state.logs,appendLog:entry=>{state.logs.push(entry);persist();}});
window.addEventListener('storage',e=>{if(e.key===ANV.KEY&&e.newValue){try{state=ANV.validate(JSON.parse(e.newValue));render();}catch{}}});
render();
})();
