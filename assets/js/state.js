(() => {
  const KEY = 'anv_state_v2';
  const initial = {
    role: 'gm',
    clues: [
      {id:'red-night', title:'A Noite Vermelha', text:'Os moradores evitam sair depois que a lua assume o tom avermelhado.', visible:true}
    ],
    logs: [{time:'23:12', text:'O grupo chegou à Fazenda Velha.'}],
    story: {act:1, fear:35, pactKnowledge:5, vilarTrust:0, collectorReputation:10},
    narrativeLog: [],
    plots: [
      {id:'arrival', act:1, type:'fixed', title:'Chegada sob a Noite Vermelha', summary:'O grupo entra na região durante a Noite Vermelha e percebe que a cidade teme alguma coisa.', status:'available', canLose:false, reveal:'A região muda depois do pôr do sol.'},
      {id:'old-man', act:1, type:'mobile', title:'O velho acredita que são Cobradores', summary:'Um pactuante entra em desespero ao ver o grupo. A reação deve parecer exagerada antes de fazer sentido.', status:'available', canLose:true, reveal:'Alguém os confundiu com os Cobradores.'},
      {id:'tiao-pressure', act:1, type:'mobile', title:'Tião incentiva o conflito', summary:'Tião conduz a situação para violência porque não quer que o grupo compreenda o livro.', status:'locked', depends:['old-man'], canLose:true, reveal:'Tião parece querer impedir uma conversa.'},
      {id:'book', act:1, type:'fixed', title:'O livro de nomes', summary:'O grupo encontra o livro. Pela via pacífica entende que registra nomes de pactos; pela violenta, inicialmente parece apenas uma lista.', status:'locked', depends:['arrival'], canLose:false, reveal:'O livro contém nomes e datas antigas.'},
      {id:'octavio-name', act:1, type:'mobile', title:'O nome de Octávio em uma data impossível', summary:'Se examinarem o livro com atenção, encontram Octávio registrado numa data incompatível com sua aparência.', status:'locked', depends:['book'], canLose:true, reveal:'O nome de Octávio aparece numa data que não faz sentido.'},
      {id:'marked-names', act:2, type:'fixed', title:'Nomes com marcações estranhas', summary:'Alguns registros possuem uma marcação recorrente. Isso aponta para a próxima investigação.', status:'locked', depends:['book'], canLose:false, reveal:'Alguns nomes no livro foram marcados de maneira diferente.'},
      {id:'dead-people', act:2, type:'fixed', title:'Os marcados deveriam estar mortos', summary:'Ao investigar os nomes marcados, o grupo descobre que essas pessoas constam como mortas.', status:'locked', depends:['marked-names'], canLose:false, reveal:'Os nomes marcados pertencem a pessoas oficialmente mortas.'},
      {id:'baltazar-thread', act:2, type:'mobile', title:'Vestígio que aponta para Baltazar', summary:'Uma evidência opcional aproxima cedo a verdade: Baltazar carrega partes de pessoas ligadas a pactos.', status:'locked', depends:['dead-people'], canLose:true, reveal:'Há algo em Baltazar que reage aos nomes marcados.'}
    ]
  };
  const clone = x => JSON.parse(JSON.stringify(x));
  function load(){
    try { const x = JSON.parse(localStorage.getItem(KEY)); return x && x.plots ? x : clone(initial); }
    catch { return clone(initial); }
  }
  function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
  function reset(){ localStorage.setItem(KEY, JSON.stringify(clone(initial))); return load(); }
  function unlock(s){
    for (const p of s.plots) {
      if (p.status !== 'locked') continue;
      const deps = p.depends || [];
      if (deps.length && deps.every(id => s.plots.find(x => x.id===id)?.status === 'completed')) p.status='available';
    }
    return s;
  }
  window.ANV = { load, save, reset, unlock, initial: clone(initial) };
})();
