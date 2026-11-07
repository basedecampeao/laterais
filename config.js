// ============================================================
// CONFIGURAÇÃO · Black November · Formando Laterais
// Tudo que você pode precisar editar fica neste arquivo.
// ============================================================

window.BN_CONFIG = {

  // Tempo da oferta, em segundos (300 = 5 minutos)
  tempoOfertaSegundos: 300,

  // Se o mesmo navegador voltar dentro desse prazo, o contador NÃO reinicia.
  horasParaNovoContador: 24,

  // Contato da equipe, usado quando o tempo da oferta acaba.
  // Exemplo: "https://wa.me/5551999999999". Se ficar vazio, a página só avisa que a equipe entra em contato.
  contatoUrl: "",

  // ----------------------------------------------------------
  // OFERTAS
  // checkout: cole aqui o link de compra de cada oferta.
  // extras: linhas a mais na lista "O que está incluso" (se as ofertas tiverem diferenciais).
  // ----------------------------------------------------------
  ofertas: {
    o297: { preco: 297, parcelas: 3, valorParcela: 105.99, pagina: "oferta-297.html", checkout: "https://pay.hotmart.com/K108384222O?off=h04t05kn", extras: [] },
    o397: { preco: 397, parcelas: 3, valorParcela: 141.68, pagina: "oferta-397.html", checkout: "https://pay.hotmart.com/K108384222O?off=uebtv0l9", extras: [] },
    o597: { preco: 597, parcelas: 3, valorParcela: 213.05, pagina: "oferta-597.html", checkout: "https://pay.hotmart.com/K108384222O?off=9507tiv3", extras: [] }
  },

  // Páginas sem oferta
  paginas: { contato: "contato.html", premium: "inscricao-recebida.html" },

  // ----------------------------------------------------------
  // FAIXAS
  // O valor digitado cai na PRIMEIRA faixa em que "ate" é maior ou igual a ele.
  // "ate" é inclusivo e em reais. Infinity = sem limite.
  //
  // mes   = valor que o responsável informou "Por mês"
  // curso = valor que o responsável informou "No curso todo"
  // ----------------------------------------------------------
  faixas: {
    mes: [
      { ate: 99.99,    destino: "contato" },   // abaixo de R$ 100 por mês: sem oferta
      { ate: 141.67,   destino: "o297" },      // cabe a parcela de 105,99
      { ate: 213.04,   destino: "o397" },      // cabe a parcela de 141,68
      { ate: 300,      destino: "o597" },      // cabe a parcela de 213,05
      { ate: Infinity, destino: "premium" }    // acima de R$ 300 por mês: contato direto
    ],
    curso: [
      { ate: 99.99,    destino: "contato" },   // abaixo de R$ 100: sem oferta
      { ate: 297,      destino: "o297" },      // de 100 até 297
      { ate: 400,      destino: "o397" },      // acima de 297 até 400
      { ate: 600,      destino: "o597" },      // acima de 400 até 600
      { ate: Infinity, destino: "premium" }    // acima de R$ 600: contato direto
    ]
  }
};

// ============================================================
// FUNÇÕES AUXILIARES (não precisa editar daqui para baixo)
// ============================================================
(function () {
  var C = window.BN_CONFIG;

  C.brl = function (n) {
    return 'R$ ' + Number(n).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // decide para onde o lead vai, a partir do valor (em centavos) e de "Por mês" / "No curso todo"
  C.rotear = function (cents, periodo) {
    var modo = periodo === 'Por mês' ? 'mes' : 'curso';
    var lista = C.faixas[modo];
    var destino = 'contato';
    for (var i = 0; i < lista.length; i++) {
      var lim = lista[i].ate === Infinity ? Infinity : Math.round(lista[i].ate * 100);
      if (cents <= lim) { destino = lista[i].destino; break; }
    }
    var o = C.ofertas[destino];
    var pagina = o ? o.pagina : C.paginas[destino];
    var rotulo = o
      ? 'Oferta ' + C.brl(o.preco) + ' (' + o.parcelas + 'x de ' + C.brl(o.valorParcela) + ')'
      : (destino === 'premium' ? 'Premium: contato direto da equipe' : 'Sem oferta no orçamento: contato da equipe');
    return { destino: destino, pagina: pagina, rotulo: rotulo };
  };

  // armazenamento seguro (se o navegador bloquear, usa memória)
  var mem = {};
  function store() { try { var k = '__bn'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } }
  function get(k) { var s = store(); try { return JSON.parse(s ? s.getItem(k) : mem[k] || 'null'); } catch (e) { return null; } }
  function set(k, v) { var s = store(); var j = JSON.stringify(v); if (s) s.setItem(k, j); else mem[k] = j; }
  function del(k) { var s = store(); if (s) s.removeItem(k); else delete mem[k]; }

  C.lead = {
    salvar: function (obj) { set('bn_lead', obj); },
    ler: function () { return get('bn_lead') || {}; }
  };

  // contador: guarda quando começou, então atualizar a página não reinicia
  C.timer = {
    iniciar: function (id) {
      var k = 'bn_timer_' + id, now = Date.now();
      var cur = get(k);
      if (cur && (now - cur.inicio) < C.horasParaNovoContador * 3600 * 1000) return cur;
      var novo = { inicio: now, fim: now + C.tempoOfertaSegundos * 1000 };
      set(k, novo);
      return novo;
    },
    limpar: function (id) { del('bn_timer_' + id); }
  };
})();
