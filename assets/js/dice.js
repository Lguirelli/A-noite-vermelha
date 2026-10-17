(() => {
'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rollNotation(notation){
 const value=String(notation).trim();
 if(!value||value.length>120)throw Error('Escreva uma expressão de até 120 caracteres.');
 let count=0;
 for(const match of value.matchAll(/(\d*)d(\d+|%|F(?:\.[12])?)/gi)){
  const qty=Number(match[1]||1),sides=match[2];count+=qty;
  if(qty<1||qty>50||(/^\d+$/.test(sides)&&(Number(sides)<2||Number(sides)>1000)))throw Error('Use de 1 a 50 dados por grupo, com 2 a 1000 faces.');
 }
 if(count>100)throw Error('Role até 100 dados por vez.');
 if(!count)throw Error('Inclua um dado na expressão, como 1d20 ou 2d6+3.');
 const lib=window.rpgDiceRoller;if(!lib)throw Error('Os dados não carregaram. Reabra o jogo.');
 if(window.crypto?.getRandomValues)lib.NumberGenerator.generator.engine=lib.NumberGenerator.engines.browserCrypto;
 let roll;try{roll=new lib.DiceRoll(value);}catch{throw Error('Confira a expressão dos dados.');}
 if(!Number.isFinite(roll.total))throw Error('A expressão não produziu um resultado finito.');
 const faces=[];
 function walk(item,used=true){
  if(!item||typeof item!=='object')return;
  if(Array.isArray(item)){item.forEach(v=>walk(v,used));return;}
  const active=used&&item.useInTotal!==false;
  if(item instanceof lib.Results.RollResult){faces.push({value:item.value,used:active,flags:item.modifierFlags||''});return;}
  if(item.rolls)walk(item.rolls,active);if(item.results)walk(item.results,active);
 }
 walk(roll.rolls);
 return {notation:roll.notation,total:roll.total,output:roll.output.slice(0,4000),faces:faces.slice(0,150),when:new Date().toISOString()};
}
function mount({container,appendLog,getHistory}){
 container.innerHTML=`<form class="roll-form"><label for="diceNotation">Expressão</label><div class="roll-input"><input id="diceNotation" name="notation" value="1d20" maxlength="120" autocomplete="off" spellcheck="false" aria-describedby="diceError"><button type="submit">Rolar</button></div></form><div class="die-types" aria-label="Dados">${[4,6,8,10,12,20,100].map(d=>`<button type="button" data-roll="1d${d}">d${d}</button>`).join('')}</div><div class="roll-presets"><button data-roll="2d20kh1">Vantagem</button><button data-roll="2d20kl1">Desvantagem</button><button data-roll="4d6dl1">4d6, descartar menor</button><button data-roll="1d6!">d6 explosivo</button></div><p id="diceError" role="alert" hidden></p><output id="diceResult" aria-live="polite">—</output><div class="roll-history" id="diceHistory"></div>`;
 const dialog=document.createElement('dialog');dialog.id='diceDialog';dialog.className='dice-dialog';dialog.innerHTML='<button type="button" class="dice-close" aria-label="Fechar rolagem">Fechar</button><p class="roll-kicker">O DESTINO RESPONDE</p><h2 id="rollNotationTitle"></h2><div id="rollFaces" class="roll-faces"></div><output id="rollTotal" class="roll-total" aria-live="polite"></output><p id="rollCalculation" class="roll-calculation"></p><button type="button" id="rollAgain">Rolar novamente</button>';document.body.appendChild(dialog);
 const input=container.querySelector('input'),error=container.querySelector('#diceError'),output=container.querySelector('#diceResult');
 let busy=false,last='1d20',timer;
 function history(){container.querySelector('#diceHistory').innerHTML=getHistory().filter(x=>x.dice).slice(-5).reverse().map(x=>`<p><span>${esc(x.dice.notation)}</span><strong>${esc(x.dice.total)}</strong></p>`).join('');}
 function doRoll(notation){
  if(busy)return;
  let result;try{result=rollNotation(notation);}catch(e){error.hidden=false;error.textContent=e.message;return;}
  error.hidden=true;last=result.notation;input.value=last;busy=true;
  appendLog({text:result.output,dice:result});history();
  dialog.querySelector('#rollNotationTitle').textContent=result.notation;
  dialog.querySelector('#rollFaces').innerHTML=result.faces.map(f=>`<span class="roll-face${f.used?'':' discarded'}" title="${f.used?'Conta no total':'Descartado'}">${esc(f.value)}<small>${esc(f.flags)}</small></span>`).join('');
  dialog.querySelector('#rollTotal').textContent='';dialog.querySelector('#rollCalculation').textContent='Os dados estão lançados.';dialog.querySelector('#rollAgain').disabled=true;
  if(!dialog.open)dialog.showModal();dialog.classList.add('is-rolling');
  const settle=()=>{busy=false;dialog.classList.remove('is-rolling');dialog.querySelector('#rollTotal').textContent=String(result.total);dialog.querySelector('#rollCalculation').textContent=result.output;dialog.querySelector('#rollAgain').disabled=false;output.textContent=result.output;};
  timer=setTimeout(settle,matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);
 }
 container.querySelector('form').onsubmit=e=>{e.preventDefault();doRoll(input.value);};
 container.querySelectorAll('[data-roll]').forEach(b=>b.onclick=()=>doRoll(b.dataset.roll));
 dialog.querySelector('.dice-close').onclick=()=>dialog.close();dialog.querySelector('#rollAgain').onclick=()=>doRoll(last);
 history();return {roll:doRoll,refresh:history};
}
window.ANVDice={roll:rollNotation,mount};
})();
