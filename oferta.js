(function () {
  var C = window.BN_CONFIG;
  if (!C) return;

  var id = document.body.getAttribute('data-oferta');
  var of = C.ofertas[id];
  if (!of) return;

  function $(s) { return document.querySelector(s); }
  function nome(n) {
    n = (n || '').trim().split(/\s+/)[0] || '';
    return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : '';
  }

  // para testar: abra a página com ?reset=1 e o contador volta para 05:00
  if (/[?&]reset=1/.test(location.search)) C.timer.limpar(id);

  var lead = C.lead.ler();

  // ---------- textos ----------
  var parcelaTxt = of.parcelas + 'x de ' + C.brl(of.valorParcela);
  $('#preco').textContent = C.brl(of.preco);
  $('#parcela').textContent = parcelaTxt;

  var resp = nome(lead.resp), atl = nome(lead.atleta);
  if (resp && atl) $('#saudacao').textContent = resp + ', a condição especial do ' + atl + ' está liberada';
  else if (atl) $('#saudacao').textContent = 'A condição especial do ' + atl + ' está liberada';
  else if (resp) $('#saudacao').textContent = resp + ', a sua condição especial está liberada';

  if (lead.pag === 'Pix') $('#pref').textContent = 'Você escolheu Pix: pagamento único de ' + C.brl(of.preco) + '.';
  else if (lead.pag === 'Cartão de crédito') $('#pref').textContent = 'Você escolheu cartão: pague em até ' + parcelaTxt + '.';

  (of.extras || []).forEach(function (t) {
    var li = document.createElement('li'); li.textContent = t; $('#incl').appendChild(li);
  });

  // ---------- botão de compra ----------
  var cta = $('#cta');
  if (of.checkout) { cta.href = of.checkout; }
  else { cta.setAttribute('aria-disabled', 'true'); cta.textContent = 'Link de compra em breve'; cta.removeAttribute('href'); }

  // ---------- contato (quando expira) ----------
  var ctaContato = $('#ctaContato');
  if (C.contatoUrl) { ctaContato.href = C.contatoUrl; ctaContato.classList.remove('hidden'); }

  // ---------- rastreamento ----------
  try { if (typeof fbq === 'function') fbq('track', 'ViewContent', { content_name: 'Formando Laterais · Black November', value: of.preco, currency: 'BRL' }); } catch (e) {}
  cta.addEventListener('click', function () {
    try { if (typeof fbq === 'function') fbq('track', 'InitiateCheckout', { content_name: 'Formando Laterais · Black November', value: of.preco, currency: 'BRL' }); } catch (e) {}
    try { if (typeof gtag === 'function') gtag('event', 'begin_checkout', { value: of.preco, currency: 'BRL', items: [{ item_name: 'Formando Laterais ' + C.brl(of.preco) }] }); } catch (e) {}
  });

  // ---------- contador ----------
  var t = C.timer.iniciar(id);
  var total = C.tempoOfertaSegundos * 1000;
  var bar = $('#timerBar'), mini = $('#timerMini'), big = $('#timerBig'), fill = $('#timerFill');
  var ativa = $('#ofertaAtiva'), expirada = $('#ofertaExpirada');

  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000)), m = Math.floor(s / 60); s = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function expirar() {
    ativa.classList.add('hidden');
    bar.classList.add('hidden');
    expirada.classList.remove('hidden');
    clearInterval(iv);
  }
  function tick() {
    var left = t.fim - Date.now();
    if (left <= 0) return expirar();
    var f = fmt(left);
    mini.textContent = f; big.textContent = f;
    fill.style.width = Math.max(0, Math.min(100, left / total * 100)) + '%';
    bar.classList.toggle('low', left <= 60000);
  }
  var iv = setInterval(tick, 250);
  tick();
})();
