(function(root){
'use strict';
const story=root.STORY||(typeof require==='function'?require('./story.js'):null);
const KEY='anv_campaign_v3';
const clone=x=>JSON.parse(JSON.stringify(x));
function fresh(){return {...clone(story.initialVariables),version:3,scene:'start',stage:0,entered:[],used:[],clues:[],logs:[],plots:Object.fromEntries(story.plots.map(p=>[p.id,'pending'])),notes:'',feedback:'',createdAt:new Date().toISOString()};}
function apply(s,e={}){
 for(const [key,value] of Object.entries(e.set||{}))s[key]=key.endsWith('_truth_level')?Math.max(s[key]||0,value):value;
 for(const [key,value] of Object.entries(e.inc||{}))s[key]=(s[key]||0)+value;
 for(const key of ['A_power','vilar_influence'])s[key]=Math.max(0,Math.min(100,s[key]));
 s.injuries=Math.max(0,s.injuries);
 for(const id of e.complete||[])if(s.plots[id]!=='lost')s.plots[id]='completed';
 for(const id of e.lose||[])lose(s,id);
 for(const clue of e.clues||[])if(!s.clues.some(c=>c.id===clue.id))s.clues.push(clone(clue));
 if(e.feedback)s.feedback=e.feedback;
}
function lose(s,id){const p=story.plots.find(p=>p.id===id);if(!p||p.type!=='mobile'||s.plots[id]==='completed')return false;if(s.plots[id]!=='lost'){s.plots[id]='lost';s.logs.push({text:'Oportunidade encerrada: '+p.title,private:true});}return true;}
function enter(s,id){
 const scene=story.scenes[id];if(!scene)throw new Error('Cena desconhecida.');
 s.scene=id;s.stage=Math.max(s.stage,scene.act);
 if(!s.entered.includes(id)){s.entered.push(id);apply(s,scene.enter);}
 for(const p of story.plots)if(p.expires&&s.stage>=p.expires&&s.plots[p.id]==='pending')lose(s,p.id);
 if(id.startsWith('end_'))for(const p of story.plots)if(p.type==='mobile'&&s.plots[p.id]==='pending')lose(s,p.id);
 return s;
}
function actions(s){return story.scenes[s.scene].actions.filter(a=>(!a.when||a.when(s))&&(!s.used.includes(s.scene+':'+a.id))&&(!a.to?!(a.effect.complete||[]).some(id=>s.plots[id]==='lost'):true));}
function choose(s,id){
 const a=actions(s).find(a=>a.id===id);if(!a)throw new Error('Esta ação não está disponível.');
 const prev=s.scene;s.feedback='';apply(s,a.effect);
 s.logs.push({scene:prev,text:a.label,consequence:s.feedback});
 // Ações locais são consumidas; rotas de investigação podem voltar ao hub.
 if(!a.to)s.used.push(prev+':'+a.id);
 if(a.to)enter(s,a.to);
 return s;
}
function validate(raw){
 if(!raw||raw.version!==3||!story.scenes[raw.scene])throw new Error('Use um salvamento da campanha versão 3.');
 for(const [k,v] of Object.entries(story.initialVariables))if(typeof raw[k]!==typeof v||(typeof v==='number'&&!Number.isFinite(raw[k])))throw new Error('Salvamento inválido: '+k);
 if(!Array.isArray(raw.entered)||!raw.entered.every(x=>typeof x==='string'&&story.scenes[x])||!Array.isArray(raw.used)||!raw.used.every(x=>typeof x==='string'))throw new Error('Histórico inválido.');
 if(!Array.isArray(raw.clues)||!raw.clues.every(x=>x&&['id','title','text'].every(k=>typeof x[k]==='string')))throw new Error('Pistas inválidas.');
 if(!Array.isArray(raw.logs)||!raw.logs.every(x=>x&&typeof x.text==='string'))throw new Error('Registro inválido.');
 for(const p of story.plots){if(!['pending','completed','lost'].includes(raw.plots?.[p.id])||(p.type==='fixed'&&raw.plots[p.id]==='lost'))throw new Error('Plot point inválido.');}
 if(typeof raw.notes!=='string'||typeof raw.feedback!=='string'||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>6)throw new Error('Estado inválido.');
 return clone(raw);
}
function load(storage){try{const text=storage.getItem(KEY);return {state:text?validate(JSON.parse(text)):fresh(),error:null};}catch(e){return {state:fresh(),error:'Não foi possível ler o progresso salvo. Ele não foi sobrescrito. Exporte esta sessão ou recupere seu arquivo de salvamento.'};}}
function save(s,storage){try{storage.setItem(KEY,JSON.stringify(s));return true;}catch(e){return false;}}
root.ANV={KEY,fresh,apply,lose,enter,actions,choose,validate,load,save,clone};
if(typeof module!=='undefined')module.exports=root.ANV;
})(typeof window!=='undefined'?window:globalThis);
