/* Conteúdo narrativo local. Nenhuma dependência ou chamada de rede. */
(function(root){
const plots = [
 ['prison','fixed',1,'Os quatro são presos'],['tiao','fixed',1,'Tião e a estrada da fazenda'],['morning','fixed',1,'Ausência e fiança'],
 ['farm','fixed',2,'A família na varanda'],['book','fixed',2,'Livro dos Nomes'],['octavio','fixed',2,'Uma data impossível'],
 ['dead','fixed',3,'Os marcados estão mortos'],['body','fixed',3,'Um corpo, várias histórias'],
 ['plural','fixed',5,'Mais de uma entidade'],['fabrication','fixed',5,'Acidentes fabricados'],['faces','fixed',5,'O rosto de Tião'],
 ['forest','fixed',6,'O domínio da floresta'],['plan','fixed',6,'O destino escolhido por outro'],['ending','fixed',6,'Uma decisão própria'],
 ['mask','mobile',1,'A máscara diante de Tião',2],['flame','mobile',1,'A chama na cela',2],['heart','mobile',1,'Uma batida fora de hora',2],['scent','mobile',1,'O cheiro da cela',2],
 ['rumor','mobile',1,'A voz atrás do balcão',2],['saveOld','mobile',2,'Preservar o avô',3],['earlyRegistry','mobile',2,'Entender o livro com o avô',3],['tracks','mobile',2,'Rastros atrás do curral',3],
 ['scar','mobile',3,'A fratura de Baltazar',4],['eyes','mobile',4,'Os olhos da infância',5],['helena','mobile',4,'Uma carta guardada',5],['hunter','mobile',4,'Algo procura a máscara',5],['twoScents','mobile',4,'Dois rastros diferentes',5],['oldFace','mobile',4,'O socorro na ponte',5]
].map(([id,type,act,title,expires])=>({id,type,act,title,expires}));
const clue = (id,title,text)=>({id,title,text});
const c = (id,label,to,effect={},extra={})=>({id,label,to,effect,...extra});
const scenes = {};
function scene(id,act,place,title,body,actions,enter={}){scenes[id]={id,act,place,title,body,actions,enter};}
scene('start',0,'UMA NOITE • QUATRO DESCONHECIDOS','A Noite Vermelha',[
 'As janelas se fecham antes do sol. Alguém cobre um espelho. No bar da estrada, quatro pessoas ainda não sabem que vão dividir a mesma cela.',
 'Uma história de horror rural para jogar em grupo ou sozinho. Leia em voz alta, discuta as ações e escolha quem se aproxima do perigo.'
],[c('begin','Iniciar A Noite Vermelha','bar')]);
scene('bar',1,'BAR DA ESTRADA • FIM DE TARDE','Quatro lugares à mesa',[
 'Octávio procura o final de uma melodia. Damião encosta as mãos frias na xícara. Baltazar ocupa o banco mais distante. Turak veio pela estrada, seguindo um cheiro que a chuva não levou.',
 'Um copo bate no chão. Um homem se levanta: “Repete o que você disse da minha irmã.” Ninguém à mesa se lembra de ter dito aquilo.'
],[
 c('listen','Octávio: escutar de onde veio a provocação',null,{clues:[clue('voice','Uma voz deslocada','A provocação parece ter vindo de trás do balcão. O homem olhava para a mesa dos quatro.')],complete:['rumor'],feedback:'A voz acaba antes do movimento dos lábios. Uma cadeira raspa o chão.'}),
 c('shield','Baltazar: afastar o banco e proteger quem caiu','brawl',{inc:{conversation_successes:1},set:{bar_choice:'proteção'},feedback:'Você segura a cadeira antes que atinja a mulher. Alguém interpreta o gesto como ameaça.'}),
 c('cup','Damião: colocar a xícara entre os dois homens','brawl',{set:{bar_choice:'mediação'},feedback:'“Não foi ele.” O dono do copo derrubado empurra seu braço. A mesa vira.'}),
 c('door','Turak: puxar o grupo para a saída','brawl',{set:{bar_choice:'saída'},feedback:'A porta abre para dentro. Dois guardas a ocupam antes de vocês chegarem.'}),
 c('push','Empurrar o homem que ergueu a garrafa','brawl',{inc:{violence_level:1,injuries:1},set:{bar_choice:'agressão'},feedback:'A garrafa se quebra no chão. Um estilhaço abre sua mão.'})
]);
scene('brawl',1,'BAR DA ESTRADA • A GUARDA','A porta se fecha',s=>[
 s.bar_choice==='mediação'?'A tentativa de separar a briga desaparece no tumulto. O guarda vê quatro estranhos ao lado da mesa quebrada.':'O bar inteiro fala ao mesmo tempo. A mulher que caiu aponta para o grupo, mas o guarda não escuta a explicação.',
 '“Os quatro. Na parede.” A briga continua atrás de vocês. Na rua, alguém recolhe uma vela vermelha da janela.'
],[
 c('submit','Deixar as mãos visíveis e acompanhar a guarda','cell',{feedback:'Os guardas anotam nomes incompletos. Vocês passarão a noite na cadeia.'}),
 c('witness','Pedir que a mulher registre o que viu','cell',{inc:{conversation_successes:1},set:{witness:true},feedback:'Ela promete falar de manhã. O guarda prende vocês mesmo assim, mas anota o depoimento.'}),
 c('resist','Segurar a porta antes que separem o grupo','cell',{inc:{injuries:1,violence_level:1,players_seen_as_collectors:1},feedback:'Um golpe no ombro encerra a discussão. A guarda mantém os quatro juntos, sob vigilância.'})
]);
scene('cell',1,'CADEIA • NOITE','O quinto homem',[
 'O homem deitado no banco recolhe os pés. Dois amuletos de madeira batem um no outro. “Se roncarem, eu peço outra cela.” Ele se apresenta como Tião e reclama da goteira.',
 'A luz do corredor alcança uma caneca, um cobertor curto e o barro seco nas botas dele. Nenhum espetáculo. Só uma noite ruim.'
],[
 c('mask','Octávio: ajustar a máscara enquanto observa Tião',null,{complete:['mask'],inc:{tiao_suspicion:1},clues:[clue('cell-mask','Pressão na máscara','Diante de Tião, a borda aperta o rosto de Octávio. Há familiaridade, mas nenhuma lembrança.')],feedback:'A madeira parece pequena demais por um instante. Tião pergunta se está machucando.'}),
 c('flame','Damião: acender uma chama para secar o cobertor',null,{complete:['flame'],inc:{tiao_suspicion:1},clues:[clue('cell-flame','A chama inclinada','A Última Chama inclina para Tião mesmo sem vento.')],feedback:'A chama se curva. Tião afasta o cobertor: “Vai queimar isso aí.”'}),
 c('heart','Baltazar: sentar perto dele e contar as batidas',null,{complete:['heart'],clues:[clue('cell-heart','Uma pausa no peito','Perto do banco de Tião, o coração de Baltazar perde uma batida.')],feedback:'Uma pausa. Depois duas batidas rápidas. Tião empurra a caneca na sua direção.'}),
 c('scent','Turak: farejar o barro das botas',null,{complete:['scent'],set:{turak_vilar_scent_known:true},clues:[clue('cell-scent','Ferro molhado e cinza','Turak guardou o cheiro incomum em torno das botas de Tião: ferro molhado e cinza.')],feedback:'Por baixo do barro há ferro molhado e cinza. Você guarda o rastro sem saber de quem é.'}),
 c('road','Perguntar a Tião onde a estrada termina','tiao')
],{complete:['prison'],set:{met_tiao:true}});
scene('tiao',1,'CADEIA • CONVERSA BAIXA','Tudo passa pelo velho',[
 '“A fazenda depois da ponte? Tem dinheiro até em ano de seca. Agora tem bicho morto, gente sumindo... ou foi na estrada de baixo? Não lembro.” Tião coça o queixo.',
 '“Lá guardam um livro velho. Tem versos, nomes de defunto, risco de médico. Quem sabe não é dessas coisas que vocês procuram.” Ele olha a goteira. “Último que foi perguntar não voltou. Se forem, não esperem recepção.”'
],[
 c('oct','Octávio: cantar o trecho sem final',null,{clues:[clue('hook-o','Um verso na fazenda','Tião diz ter ouvido a mesma cadência quando alguém leu um caderno da fazenda.')],feedback:'“Essa volta aí... ouvi um sujeito lendo. Na fazenda, acho. Ou na venda deles.”'}),
 c('dam','Damião: perguntar sobre marcas de queimadura',null,{clues:[clue('hook-d','Um desenho de chama','Tião lembra de uma chama desenhada perto de um nome no livro. Não sabe dizer qual.')],feedback:'“Tinha um risco assim num papel do velho. Nome de mulher, talvez. Minha memória não presta.”'}),
 c('bal','Baltazar: perguntar pelos riscos de médico',null,{clues:[clue('hook-b','Medidas de gente','Tião fala de medidas e desenhos de ossos entre registros da propriedade.')],feedback:'“Comprimento de braço, essas coisas. Não entendo. O velho guarda papel demais.”'}),
 c('tur','Turak: perguntar por que há animais mortos',null,{clues:[clue('hook-t','O curral','Os animais apareceram mortos atrás do curral, apesar das cercas intactas.')],feedback:'“As cercas estavam inteiras. Se você conhece rastro, talvez enxergue o que ninguém viu.”'}),
 c('doubt','Perguntar se Tião viu algum desaparecimento',null,{inc:{tiao_suspicion:1},feedback:'“Ver, eu não vi. Só digo que tudo naquela fazenda passa pelo velho. Gente acuada mente.”'}),
 c('sleep','Dividir o cobertor e esperar o amanhecer','morning')
],{complete:['tiao']});
scene('morning',1,'CADEIA • MANHÃ','Uma cama vazia',s=>[
 'Tião já saiu. “Troca de turno”, diz o carcereiro. “Pode ter sido liberado antes de mim.” Na folha, uma assinatura ilegível cobre a linha da fiança dos quatro.',
 s.witness?'A mulher do bar deixou um depoimento. O carcereiro admite que vocês tentaram ajudar, mas não sabe quem pagou.':'“A fiança entrou. Vocês estão livres.” O carcereiro entrega os pertences e não faz perguntas.',
 'Pela janela, a estrada da ponte corta campos verdes demais para esta seca.'
],[
 c('receipt','Pedir uma cópia do recibo da fiança',null,{clues:[clue('bail','Fiança paga','O recibo tem uma rubrica ilegível. Ninguém confirmou que Tião pagou.')],feedback:'O papel registra o valor e o horário da troca de turno. Nenhum nome legível.'}),
 c('rest','Lavar os ferimentos na bica do pátio',null,{inc:{injuries:-1},feedback:'A água arde, mas permite firmar a mão. O grupo divide um pedaço de pão.'}),
 c('farm','Seguir pela ponte até a propriedade','gate')
],{complete:['morning']});
scene('gate',2,'FAZENDA • PORTEIRA','A terra não passou fome',[
 'O pasto é espesso. Os cães latem de dentro do alpendre. Uma menina é puxada para longe da janela; um homem com a mesma testa dela segura uma espingarda.',
 'Na varanda, o avô empalidece. “Entrem. Trancam tudo.” Não há uniforme ou vigia contratado. São parentes protegendo a própria casa.'
],[
 c('track','Turak: contornar a cerca e examinar o curral',null,{complete:['tracks'],inc:{vilar_suspicion:1},clues:[clue('farm-tracks','A cerca intacta','Um cabo foi serrado por ferramenta. Perto dele há cinza e ferro molhado; o barro que vem da mata cheira a resina amarga.')],feedback:'O cabo cedeu num corte limpo. Isso não explica todos os animais mortos, mas alguém preparou uma queda.'}),
 c('missing','Perguntar pelo último visitante desaparecido','standoff',{feedback:'O avô recua. “Vocês chegaram cedo demais!” Um parente avança até a porteira.'}),
 c('porch','Avançar até a varanda antes que tranquem a porta','standoff',{inc:{farm_family_trust:-1,players_seen_as_collectors:1},feedback:'Um disparo abre a madeira a seus pés. “Ele ainda tem tempo!”'}),
 c('hands','Deixar as armas na estrada e chamar pelo avô','standoff',{inc:{farm_family_trust:1},feedback:'As armas continuam apontadas. “Não vão levar ele.” A mulher na janela parece prestes a chorar.'})
],{complete:['farm']});
scene('standoff',2,'FAZENDA • LINHA DE TIRO','“Ainda tem tempo”',[
 'O neto engatilha a espingarda. “O próximo ainda não está pronto.” O velho tenta empurrá-lo de volta para casa.',
 'As palavras não combinam com uma família escondendo um desaparecido. Mas o cano está firme, e o corredor até a varanda é estreito.'
],[
 c('time','Repetir “tempo para quê?” sem cruzar a porteira','parley',{inc:{conversation_successes:1,farm_family_trust:1},feedback:'O dedo do neto relaxa. “Para o acordo. Vocês sabem disso.”'}),
 c('return','Recuar atrás do poço e dizer os próprios nomes','parley',{inc:{conversation_successes:1},feedback:'“Não viemos levar ninguém.” A mulher pede ao filho que abaixe o cano por um instante.'}),
 c('disarm','Agarrar o cano quando o neto se aproxima','struggle',{inc:{injuries:1,violence_level:1,farm_family_trust:-2},feedback:'A arma dispara para o alto. O avô cai de joelhos junto ao batente riscado.'}),
 c('fire','Damião: lançar a chama contra a barricada','struggle',{inc:{violence_level:2,players_seen_as_collectors:2,farm_family_trust:-2},feedback:'A madeira pega fogo. A família corre para tirar as crianças. O velho fica entre o grupo e o batente.'})
]);
scene('struggle',2,'FAZENDA • VARANDA','O risco no batente',[
 'Na madeira, um sinal antigo ganha cor. O sangue do avô pinga dentro do risco. Ele ainda respira. “Não aqui”, pede a filha. “Tirem ele da marca.”',
 'A porta do escritório está aberta atrás dele. O neto tenta alcançá-lo com uma faca de cozinha.'
],[
 c('pull','Arrastar o avô para longe da marca e estancar o sangue','parley',{inc:{injuries:1,conversation_successes:1},feedback:'A faca corta seu braço antes que a filha segure o neto. O velho respira fora do risco. Ela exige que todos parem.'}),
 c('finish','Atingir o avô sobre o sinal e tomar o escritório','ruin',{set:{farm_grandfather_alive:false,farm_pact_closed:true},inc:{violence_level:2,players_seen_as_collectors:3,A_power:-25,vilar_influence:20,farm_family_trust:-4},lose:['saveOld','earlyRegistry'],feedback:'O sinal apaga quando ele morre. A folhagem atrás da casa perde a cor de uma só vez. A família foge com as crianças.'}),
 c('leave','Forçar passagem para o escritório, deixando-o no batente','ruin',{set:{farm_grandfather_alive:false,farm_pact_closed:true},inc:{violence_level:1,A_power:-25,vilar_influence:20,farm_family_trust:-4},lose:['saveOld','earlyRegistry'],feedback:'Um estalo vem do risco. Quando vocês olham, o velho já não respira. A filha grita que a cobrança terminou.'})
]);
scene('parley',2,'FAZENDA • MESA DA COZINHA','Uma dívida de família',[
 'O avô segura uma toalha entre as mãos. “A terra prospera. Quando um de nós cai sem a cobrança, o vínculo pode seguir no próximo. Se vierem cobrar, acaba nele.” A filha não o deixa terminar.',
 'Eles esperavam Cobradores. Os acidentes os fizeram pensar que a hora chegara. Mas o corte na cerca, os bichos, os desaparecimentos: “Não é assim que o acordo cobra.”'
],[
 c('registry','Pedir que mostre onde a família está registrada','book',{set:{book_known_as_pact_registry:true,farm_grandfather_alive:true},complete:['saveOld','earlyRegistry'],inc:{farm_family_trust:2,conversation_successes:1},clues:[clue('registry','Um registro de pactos','O avô reconhece sua linhagem no livro e outros pactuantes. Não sabe ler todos os sinais.')],feedback:'Ele abre um armário e aponta uma linhagem. “São pessoas ligadas a acordos. O resto não sei ler.”'}),
 c('aid','Ajudar a filha a recolher as crianças antes de partir',null,{inc:{farm_family_trust:1,injuries:-1},feedback:'Ela oferece curativos. “Quem espalhou que escondíamos gente não veio perguntar a nós.”'})
]);
scene('ruin',2,'FAZENDA • ESCRITÓRIO','Papel e fuligem',[
 'O escritório guarda recibos de gado e um volume envolto em tecido. Na capa não há título. Dentro, nomes, datas e símbolos escritos por mãos de épocas diferentes.',
 'A família levou as chaves e seus relatos. O livro ficou. Do lado de fora, a filha fecha a porteira sem olhar para vocês.'
],[c('take','Envolver o volume no tecido e abrir uma página seca','book',{feedback:'O grupo leva o livro. O que aquelas colunas registram continua desconhecido.'})]);
scene('book',2,'LIVRO DOS NOMES • À LUZ DO DIA','A página que já conhece',s=>[
 s.book_known_as_pact_registry?'Entre os registros de pactuantes, uma linha faz Octávio parar.':'Entre nomes de desconhecidos, uma linha faz Octávio parar.',
 'OCTÁVIO — 17 de agosto de 1871. Mais de um século separa a tinta do rosto por trás da máscara. A borda aperta sua pele; antes de virar a folha, ele sabe onde o próximo símbolo termina.',
 'Outro Octávio? Outra idade? Uma vida que a memória não alcança? O papel não responde.'
],[
 c('copy','Copiar a data e completar o símbolo sem olhar',null,{inc:{octavio_memory_truth_level:1},clues:[clue('symbol','Um gesto conhecido','Octávio completou o símbolo antes de ver seu final. Não lembra de tê-lo aprendido.')],feedback:'Sua mão continua sozinha. O traço coincide; a lembrança não vem.'}),
 c('marks','Separar as páginas com a marca de três cortes','names')
],{set:{book_acquired:true,octavio_name_found:true,octavio_impossible_date_seen:true},complete:['book','octavio'],clues:[clue('octavio-date','Octávio • 1871','O nome aparece em uma data incompatível com a idade aparente. A máscara aperta diante da página.')]});
scene('names',3,'VILA • ARQUIVO E CEMITÉRIO','Três cortes na margem',[
 'Bento Nunes. Rosa Alves. Joaquim de Sá. Três nomes sob o mesmo sinal, com endereços antigos ainda reconhecíveis.',
 'Mais abaixo, Helena e uma linha desbotada. A princípio, parecem pessoas a procurar. Talvez saibam por que estão nesse livro.'
],[
 c('bento','Procurar Bento Nunes no registro do cemitério','bento',{}, {when:s=>!s.visited_bento}),
 c('rosa','Levar o nome de Rosa Alves ao antigo posto de saúde','rosa',{}, {when:s=>!s.visited_rosa}),
 c('joaquim','Pedir a ficha de Joaquim de Sá no arquivo paroquial','joaquim',{}, {when:s=>!s.visited_joaquim}),
 c('compare','Sobrepor as três fichas às páginas marcadas','compare',{}, {when:s=>s.marked_names_investigated===3})
]);
scene('bento',3,'CEMITÉRIO • LIVRO DE SEPULTAMENTOS','Uma cova aberta duas vezes',s=>[
 `Bento Nunes morreu há oito anos. ${s.marked_names_investigated>1?'Mais um nome que não poderá responder.':'A primeira visita já termina antes de começar.'}`,
 'No livro do coveiro, o enterro foi reaberto sem autorização. Um desenho identifica uma antiga fratura no antebraço esquerdo. A página seguinte registra a falta desse braço.'
],[
 c('arm','Baltazar: encostar o antebraço sobre o desenho',null,{complete:['scar'],clues:[clue('bento-arm','A fratura de Bento','O ângulo do osso de Baltazar coincide com o desenho da fratura de Bento.')],feedback:'O relevo sob sua pele acompanha o desvio do desenho. Não é uma lembrança de Bento: é seu próprio braço, aqui, agora.'}),
 c('back','Copiar a ocorrência e voltar aos outros nomes','names')
],{set:{visited_bento:true},inc:{marked_names_investigated:1},clues:[clue('bento','Bento Nunes','Morto há oito anos. Sepultura violada; antebraço esquerdo desaparecido.')]});
scene('rosa',3,'POSTO DESATIVADO • PRONTUÁRIOS','O que não foi enterrado',[
 'Rosa Alves morreu há onze anos. A família recebeu um caixão fechado. Duas folhas do prontuário discordam sobre quais partes do corpo foram liberadas.',
 'Uma fotografia clínica mostra uma cicatriz bifurcada acima do joelho. A mesma curva sobe pela perna de Baltazar, à vista quando ele se agacha para pegar a folha.'
],[c('copy','Guardar a fotografia e as duas versões do prontuário','names')],{set:{visited_rosa:true},inc:{marked_names_investigated:1},clues:[clue('rosa','Rosa Alves','Morta há onze anos. Prontuários contraditórios; a cicatriz fotografada corresponde à perna de Baltazar.')]});
scene('joaquim',3,'ARQUIVO PAROQUIAL • GAVETA INFERIOR','Décadas de silêncio',[
 'Joaquim de Sá morreu há quarenta e três anos. Uma nota da família denuncia o caixão violado e parte do tórax retirada.',
 'A medida de uma deformidade nas costelas coincide com a roupa remendada de Baltazar. Na mesma gaveta, recibos das três famílias repetem o símbolo da floresta.'
],[c('copy','Guardar as medidas e os recibos junto do livro','names')],{set:{visited_joaquim:true},inc:{marked_names_investigated:1},clues:[clue('joaquim','Joaquim de Sá','Morto há quarenta e três anos. Parte do tórax retirada. Medidas correspondem ao corpo de Baltazar.')]});
scene('compare',3,'VILA • MESA DO ARQUIVO','A marca não significa morto',[
 'Outros mortos constam no livro sem os três cortes. Nos marcados, faltam partes específicas. As fotografias e medidas apontam para o mesmo corpo vivo sentado à mesa.',
 'Os recibos descrevem benefícios recebidos e uma cobrança futura. Todos repetem o símbolo ligado à floresta. As peças não foram escolhidas ao acaso.'
],[
 c('connect','Unir as partes ausentes ao corpo de Baltazar','body',{set:{baltazar_body_truth_level:2,book_known_as_pact_registry:true},clues:[clue('body','Partes, não uma vida anterior','Partes dos mortos marcados compõem Baltazar. Todos tinham pactos ligados ao mesmo símbolo da floresta. Baltazar é uma pessoa nova.')]}),
 c('check','Conferir um morto sem marca para testar a hipótese',null,{inc:{conversation_successes:1},feedback:'O corpo foi enterrado completo. Não basta estar morto: o sinal acompanha a retirada de partes.'})
],{complete:['dead']});
scene('body',3,'VILA • FIM DE TARDE','Quem está sentado aqui',[
 'Baltazar apoia a mão nas fichas. Nenhuma voz antiga responde por ele. Seu corpo tem histórias anteriores; a pessoa que escolhe o que fazer com elas nasceu depois.',
 'Helena continua na lista. Uma anotação ao lado fala de “coração preservado”. Em outra linha, um par de olhos foi retirado de alguém que morreu protegendo uma criança na estrada.'
],[c('routes','Separar os endereços da casa, do teatro e da ponte','cases')],{complete:['body'],clues:[clue('project','Um critério comum','Os corpos usados estavam ligados a pactos da floresta. A função completa do projeto ainda é desconhecida.')]});
scene('cases',4,'VILA • JANELAS SE FECHANDO','O que o livro ainda guarda',[
 'Uma mulher cobre o espelho da venda. Um menino recolhe cartas antigas. Ninguém explica os gestos; todos olham o céu antes de terminar.',
 'Três lugares ainda guardam pedaços das histórias do grupo. Uma batida de martelo vem do moinho, onde um homem ajuda a reparar a ponte de acesso.'
],[
 c('helena','Levar o nome de Helena à casa indicada','helena',{}, {when:s=>!s.case_helena}),
 c('theater','Octávio: seguir a melodia até o teatro fechado','theater',{}, {when:s=>!s.case_octavio}),
 c('bridge','Turak: voltar à curva da estrada da infância','bridge',{}, {when:s=>!s.case_turak}),
 c('mill','Levar os documentos ao homem junto do moinho','mill',{}, {when:s=>s.case_helena&&s.case_octavio&&s.case_turak})
]);
scene('helena',4,'CASA DE HELENA • CAIXA DE CARTAS','“Passe para mim”',[
 'Uma declaração tem a assinatura de Damião: “Eu peço. Passe para mim.” Outra folha registra a transferência da cobrança de Helena e, como preço aceito, o esquecimento dela.',
 'Uma certidão posterior registra a morte de Helena por um desabamento, anos depois. Um recibo médico descreve a retirada do coração. Ao lado de Baltazar, a Última Chama se inclina para o peito dele.'
],[
 c('letter','Abrir a carta dobrada dentro da declaração',null,{complete:['helena'],set:{damiao_helena_truth_level:6},clues:[clue('love','O preço de salvar Helena','Damião amava Helena. Escolheu receber sua cobrança e aceitou esquecê-la. Ela sobreviveu à cobrança e morreu depois, em outro acontecimento.')],feedback:'“Mesmo que eu esqueça o caminho de casa, que você tenha tempo.” A letra é sua. A escolha também foi.'}),
 c('heart','Damião: encostar a chama perto do peito de Baltazar',null,{set:{damiao_helena_truth_level:6},clues:[clue('heart','O coração preservado','O recibo identifica Helena; o pulso de Baltazar acompanha a Última Chama. A cobrança parece interromper seu avanço quando o coração bate.')],feedback:'A dor que caminha pelo braço de Damião para a cada batida. Morta no papel; viva no coração que sustenta outra pessoa.'}),
 c('back','Guardar a declaração assinada e voltar à vila','cases',{set:{case_helena:true,damiao_helena_truth_level:5},clues:[clue('transfer','Uma escolha voluntária','Damião procurou e aceitou a transferência. Não foi enganado para receber a cobrança de Helena. Seu esquecimento foi parte do preço.')]})
]);
scene('theater',4,'TEATRO FECHADO • CAIXA DO PONTO','A obra interrompida',[
 'A partitura mistura instruções de palco e nomes de ruas. A letra de Octávio manda produzir vozes onde ninguém está, alongar corredores e explorar o medo dos presentes.',
 'Uma anotação de punição vem do mesmo símbolo da floresta: “Falhou. Que carregue a aparência do erro.” Num espelho comum, ao afastar a máscara, seu rosto continua normal. A deformação aparece apenas num visor marcado do cenário.'
],[
 c('echo','Ler a fala atribuída ao “outro” Octávio',null,{inc:{octavio_memory_truth_level:1},clues:[clue('no-other','A outra voz','A suposta segunda personalidade repete marcações de encenação de Octávio. Não há prova de uma segunda pessoa dentro dele.')],feedback:'Os intervalos, respirações e erros são instruções suas. O “outro” pode ter sido um papel e uma memória partida.'}),
 c('hunter','Seguir as três batidas atrás da porta do palco',null,{complete:['hunter'],clues:[clue('hunter','Algo ainda o procura','Uma silhueta alcança a fresta. Quando Octávio recoloca a máscara, ela perde seu rastro.')],feedback:'As unhas atravessam a madeira. A máscara volta ao rosto, e a coisa começa a procurar em outra direção.'}),
 c('back','Guardar a partitura e sair antes que escureça','cases',{set:{case_octavio:true},inc:{octavio_memory_truth_level:2},clues:[clue('octavio-past','A obra e a punição','Octávio produziu acontecimentos para o poder da floresta. Seu rosto físico não está deformado; a presença percebida pelo visor está. A máscara e sua memória ainda guardam outra história.')]})
]);
scene('bridge',4,'ESTRADA • PONTE ANTIGA','O cheiro da madeira partida',[
 'Na curva onde Turak quase morreu, uma placa guarda o nome de Inês Duarte. Ela morreu salvando uma criança durante uma cobrança destinada a outra pessoa. A criança era Turak.',
 'Um caminhão desliza. Um homem de casaco segura o motorista antes que a cabine ceda. “Vilar”, apresenta-se. “Venham ao moinho. Tenho documentos sobre esses acordos.” Ele volta ao trabalho, sem esperar gratidão.'
],[
 c('eyes','Comparar os olhos de Baltazar à fotografia da placa',null,{complete:['eyes'],clues:[clue('eyes','Os olhos de Inês','A fotografia e a ficha de retirada dos olhos apontam para Inês, a pessoa que salvou Turak. Seus olhos estão em Baltazar.')],feedback:'A pequena diferença entre as íris é a mesma. Turak reconhece o olhar que viu antes de perder os sentidos.'}),
 c('smell','Turak: farejar o eixo e a mão que segurou o motorista',null,{complete:['twoScents'],inc:{vilar_suspicion:1},clues:[clue('two-scents','Rastros que não combinam','No eixo partido há ferro molhado e cinza. Nos registros da floresta, resina amarga. Os acontecimentos atribuídos a uma única força deixam rastros diferentes.')],feedback:'O eixo tem um corte anterior à queda. O resgate foi real; isso não explica quem preparou o acidente.'}),
 c('face','Perguntar ao motorista se já conhecia seu salvador',null,{complete:['oldFace'],clues:[clue('savior','O socorro chegou cedo','O motorista diz que Vilar já o esperava antes da carga deslizar. Lembra de um ajudante com outra aparência, mas o mesmo anel.')],feedback:'“Tinha alguém avisando onde eu devia passar. Outro rosto. Aquele anel, sim, era igual.”'}),
 c('back','Guardar a cópia do memorial e voltar à vila','cases',{set:{case_turak:true},clues:[clue('turak','Uma criança no lugar errado','Turak não era o alvo. Inês o salvou. Seu faro é uma sensibilidade humana a rastros, não um pacto ou transferência.')]})
]);
scene('mill',4,'MOINHO • O HOMEM QUE AJUDA','Um caminho oferecido',s=>[
 'Vilar abre espaço na mesa. “Os acordos dão força àquilo que vive na mata. Vocês viram o que custam.” Os documentos são verdadeiros. Ele aponta as conexões que chegam ao centro da floresta.',
 s.farm_pact_closed?'“A ligação da fazenda acabou. Agora há uma passagem.” Ele parece satisfeito por um instante curto demais.':'“A ligação da fazenda permanece. Será mais difícil entrar, mas há uma trilha pela água.” Ele não pede que voltem para matar o velho.',
 'Oferece um mapa e um prego antigo. “Cravem isto na raiz central. A fonte da Noite Vermelha estará ao alcance.” Uma gaveta fica presa quando ele tenta fechá-la.'
],[
 c('accept','Aceitar o mapa e memorizar a trilha indicada','drawer',{inc:{vilar_influence:10},set:{accepted_map:true},feedback:'Vilar sai para buscar uma lanterna. Entre os mapas, uma folha da cadeia fica sobre a mesa.'}),
 c('question','Perguntar por que os acidentes começaram antes da cobrança','drawer',{inc:{vilar_suspicion:2},feedback:'“O perigo é real.” Ele responde sem responder e sai para buscar uma lanterna. A gaveta permanece entreaberta.'}),
 c('refuse','Deixar o prego na mesa e conferir as datas dos mapas','drawer',{inc:{vilar_suspicion:1},set:{refused_nail:true},feedback:'Vilar diz que vocês podem decidir no caminho. Sob o mapa há um recibo da cadeia.'})
]);
scene('drawer',5,'MOINHO • DOCUMENTOS CRUZADOS','O acidente tinha horário',[
 'A cópia da fiança está presa a uma lista: horário da briga, chegada da guarda, liberação de Tião. Ao lado, pagamentos pelo corte do cabo do curral e uma ordem para deslocar a carga da ponte.',
 'Um caderno registra duas procedências distintas. Os acordos da floresta pertencem a uma força; as transferências e os acidentes são assinados por outra. Transferir a cobrança não muda o dono do pacto.'
],[
 c('assemble','Alinhar os recibos com os relatos do bar e da fazenda','faces',{inc:{vilar_suspicion:4},clues:[clue('staged','A ordem dos acontecimentos','A briga foi provocada, a guarda avisada e os acidentes preparados. Pessoas reais reagiram a situações fabricadas.'),clue('plural','Mais de uma entidade','Os registros distinguem o poder da floresta e quem interfere em suas cobranças. A lenda local juntou fenômenos de origens diferentes.')]}),
 c('copy','Copiar as instruções antes que Vilar retorne',null,{set:{evidence_copied:true},feedback:'Turak guarda as cópias dentro da roupa. Mesmo se os originais forem destruídos, a sequência está registrada.'})
],{complete:['plural','fabrication']});
scene('faces',5,'MOINHO • A PORTA','O homem do banco',[
 'Vilar retorna. Ao ver os papéis, solta o ar como quem desiste de um teatro cansativo. O rosto muda. Por um instante, é o homem que reclamava da goteira.',
 '“Eu não ergui a garrafa. Não puxei o gatilho de vocês.” A voz de Tião sai do mesmo corpo. “Só garanti que estivessem onde havia uma escolha.”'
],[
 c('mask','Octávio: exigir a página sobre a máscara','records',{set:{demand:'mask'},feedback:'Ele desliza uma folha pela mesa. “Foi minha primeira transferência. Funcionou. Nunca disse que seria estável.”'}),
 c('heart','Damião: apontar a assinatura na transferência de Helena','records',{set:{demand:'heart'},feedback:'“Você pediu. E eu cobrei o que combinamos.” Ele aponta depois para o peito de Baltazar.'}),
 c('exit','Recolher as páginas enquanto Baltazar bloqueia a porta','records',{inc:{vilar_suspicion:1},feedback:'Vilar não tenta recuperar os papéis. “Leiam. O que a floresta fez continua sendo real.”'})
],{complete:['faces'],clues:[clue('faces','Tião e Vilar','O rosto mudou diante do grupo. Tião era uma das aparências de Vilar. Ele organizou o encontro, a prisão e a direção até a fazenda.')]});
scene('records',5,'MOINHO • ÚLTIMAS PÁGINAS','As pontas soltas',[
 'A máscara recebeu a primeira transferência de Vilar, instável. Ele apagou as lembranças de Octávio; a âncora falha e os dias se repetem. A floresta o usara para fabricar acontecimentos que parecessem interferência do rival.',
 'Outra página registra a inserção clandestina do coração de Helena no corpo montado pela floresta. Livre da cobrança transferida voluntariamente, o coração fez Baltazar viver. Surgiram transferências sem recipiente, invisíveis para o dono original dos pactos.',
 'O coração ainda vivo interrompe a cobrança dirigida a Damião. A floresta vê Baltazar como seus próprios vínculos reunidos. Vilar vê influência que o rival não consegue contar.'
],[
 c('choose','Guardar a máscara com Octávio e seguir pela trilha da água','forest',{set:{mask_kept:true},inc:{octavio_memory_truth_level:3},feedback:'“Ainda vão precisar chegar ao centro”, diz Vilar. O grupo parte sabendo quem escolheu os casos.'}),
 c('confront','Quebrar o prego oferecido antes de sair para a floresta','forest',{set:{nail_broken:true},inc:{vilar_influence:-10},feedback:'O metal parte. Vilar perde o sorriso. O caminho continua no mapa, mas o instrumento dele ficou para trás.'})
],{set:{damiao_helena_truth_level:6},clues:[clue('origins','As quatro pontas soltas','Vilar acompanhou anomalias úteis, não heróis predestinados. Baltazar existe porque Damião salvou Helena; Turak continua humano.'),clue('mask-truth','A máscara como âncora','Vilar transferiu a cobrança de Octávio usando a máscara e apagou suas memórias. A transferência instável causa falhas; a máscara o protege do que o caça.')]});
scene('forest',6,'FLORESTA • ÚLTIMA LUZ','As árvores contam dívidas',s=>[
 s.farm_pact_closed?'A trilha cruza árvores sem folhas. Onde a ligação da fazenda acabou, o chão cede com facilidade.':'As raízes fecham a trilha. A ligação da fazenda continua forte; a passagem pela água é funda e fria.',
 'Uma criatura sai da resina. Diante de Baltazar, recolhe as garras do peito e tenta prendê-lo pelos braços. Não há afeto no gesto. Ela protege algo que considera propriedade.',
 s.farm_family_trust>1?'Na margem, uma lanterna deixada pela família marca a parte rasa. A ajuda do grupo não foi esquecida.':'Nenhuma lanterna marca a margem. O grupo terá de medir a água sozinho.'
],[
 c('baltazar','Baltazar: passar primeiro e manter a criatura à distância','root',{set:{creature_spared:true},feedback:'Ela recua das costuras, sem deixar de tentar cercá-lo. Os outros passam pelas raízes atrás dele.'}),
 c('water','Turak: guiar todos pelo cheiro da correnteza','root',{inc:{injuries:1},feedback:'O grupo evita as garras, mas a água esconde pedras cortantes. A corrente leva ao centro.'}),
 c('burn','Damião: queimar as raízes que sustentam a criatura','root',{inc:{violence_level:1,A_power:-15,vilar_influence:10,injuries:1},feedback:'A passagem abre. Ao longe, outra árvore perde as folhas. Cada vínculo rompido favorece alguém.'})
],{complete:['forest']});
scene('root',6,'FLORESTA • CENTRO','A mentira não era a crueldade',[
 'No centro, nomes atravessam a casca. A presença da floresta não pede perdão: admite seus acordos predatórios, o projeto de corpos e o uso de Octávio. Nada disso foi inventado por Vilar.',
 'No mapa, os casos escolhidos cercam esta raiz. Encerrar as conexões abre o caminho para destruí-la. O desenho no prego aponta o que acontece depois: a influência liberada converge para Vilar.',
 'Ele surge entre as árvores. “Agora a máscara.” Se ela ficar com ele, Octávio perderá sua proteção e restará com o pacto original. Destruir a floresta não encerrará a disputa.'
],[c('stand','Reunir os quatro diante da raiz, sem entregar a máscara','decision')],{complete:['plan'],clues:[clue('plan','O objetivo de Vilar','Destruir a entidade da floresta aumenta enormemente a influência de Vilar. Ele quer também a máscara. A crueldade da floresta é real; eliminá-la não resolve tudo.')]});
scene('decision',6,'FLORESTA • A ESCOLHA','Ninguém decide pelos quatro',s=>[
 s.injuries>2?'O grupo mal se mantém em pé. Um confronto prolongado custará caro. Ainda há tempo para escolher juntos.':'Os quatro ainda conseguem se mover entre as raízes. Pela primeira vez, conhecem quem ganha com cada caminho.',
 s.evidence_copied?'As cópias estão com Turak. A verdade pode sair daqui mesmo que ninguém preserve os originais.':'Os documentos originais estão com o grupo. Levá-los à vila é uma forma de impedir que uma única versão sobreviva.',
 'A floresta exige que seus vínculos permaneçam. Vilar espera que vocês acabem o trabalho. Nenhum deles oferece uma saída sem preço.'
],[
 c('destroy','Destruir a raiz, mantendo a máscara com Octávio','end_destroy',{set:{ending:'destroy',A_power:0},inc:{vilar_influence:60,injuries:1},feedback:'A raiz cede. O vento muda de dono.'}),
 c('bind','Usar o desenho da máscara para prender Vilar e negociar uma trégua','end_bind',{set:{ending:'bind'},inc:{vilar_influence:-35,injuries:2},feedback:'Octávio repete o símbolo. Os quatro sustentam a âncora enquanto a floresta fecha a passagem.'}),
 c('leave','Recusar as duas entidades e levar os registros à cidade','end_leave',{set:{ending:'leave'},inc:{vilar_influence:-10},feedback:'O grupo recua junto. Nenhum pacto é apagado por esse gesto, mas a história já não pertence só às entidades.'}),
 c('give','Entregar a máscara a Vilar em troca de passagem para o grupo','end_give',{set:{ending:'give',mask_kept:false},inc:{vilar_influence:45},feedback:'A mão de Vilar fecha sobre a madeira. Algo volta a procurar Octávio entre as árvores.'})
]);
const ends={
 destroy:['Uma floresta em silêncio','A presença da floresta se desfaz. Vilar não celebra; apenas muda de rosto. A região perde seu antigo predador e ganha um poder que agora encontra menos resistência. A máscara ficou com Octávio, mas isso não apaga a vitória política de Vilar.'],
 bind:['Uma trégua tem preço','Vilar fica preso na passagem pela âncora imperfeita. A floresta aceita suspender a perseguição ao grupo por uma noite, não cancelar seus pactos. Sustentar o desenho deixa os quatro feridos. A prisão não é eterna; vocês conquistaram tempo e uma posição para negociar.'],
 leave:['A história sai da mata','Os quatro levam nomes, recibos e contradições para a cidade. As cobranças continuam sendo um perigo. Vilar e a floresta permanecem, mas perdem a segurança de uma população que acreditava numa única lenda. A próxima escolha já não será feita na mesma ignorância.'],
 give:['O rosto descoberto','Vilar permite a saída e leva a máscara. Octávio sente o rosto normal sob a chuva, sem a proteção da âncora. Seu pacto original continua; o caçador retoma o rastro. Os quatro saem vivos, sabendo o preço de uma passagem que não foi salvação.']
};
for(const [id,[title,body]] of Object.entries(ends)) scene('end_'+id,6,'AMANHECER • EPÍLOGO',title,s=>[
 body,
 s.farm_grandfather_alive?'Na fazenda, o avô continua vivo e o pacto geracional permanece. A família lembra se vocês estenderam a mão.':'Na fazenda, o sinal apagado marca uma cobrança concluída. A família sobrevivente não esquece quem estava na varanda.',
 'Baltazar continua sendo uma pessoa nova. Damião sabe que escolheu salvar Helena. Turak carrega uma memória humana; Octávio conhece parte da vida que lhe tiraram. Nenhuma entidade pode tomar essas escolhas de volta.'
],[],{complete:['ending']});
const initialVariables={farm_grandfather_alive:true,farm_pact_closed:false,farm_family_trust:0,book_acquired:false,book_known_as_pact_registry:false,octavio_name_found:false,octavio_impossible_date_seen:false,marked_names_investigated:0,baltazar_body_truth_level:0,tiao_suspicion:0,vilar_suspicion:0,players_seen_as_collectors:0,damiao_helena_truth_level:0,turak_vilar_scent_known:false,octavio_memory_truth_level:0,A_power:100,vilar_influence:10,violence_level:0,conversation_successes:0,injuries:0};
root.STORY={scenes,plots,initialVariables};
if(typeof module!=='undefined')module.exports=root.STORY;
})(typeof window!=='undefined'?window:globalThis);
