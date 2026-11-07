# Black November · Formando Laterais

Landing + funil de ofertas. Site estático, todos os arquivos na raiz (sem subpastas).

## Como funciona

1. `index.html` é a landing com o formulário.
2. Ao enviar, o formulário calcula a faixa do valor informado e redireciona:
   - `oferta-297.html`, `oferta-397.html` ou `oferta-597.html`: oferta com contador de 5 minutos
   - `contato.html`: valor abaixo do orçamento das ofertas
   - `inscricao-recebida.html`: valor acima do limite, contato direto da equipe
3. Cada resposta chega no Formspree com o campo "Direcionamento", que diz para onde o lead foi.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | landing com o formulário (endpoint do Formspree dentro dele) |
| `oferta-297.html`, `oferta-397.html`, `oferta-597.html` | páginas de oferta |
| `contato.html`, `inscricao-recebida.html` | páginas sem oferta |
| `config.js` | **o arquivo que você edita**: links de compra, faixas, tempo do contador |
| `oferta.js` | lógica do contador e das páginas de oferta |
| `style.css` | visual das páginas de oferta |
| `logo-*.png`, `favicon.png` | marca |

## O que editar em config.js

- `ofertas.o297.checkout`, `o397.checkout`, `o597.checkout`: cole o link de compra de cada oferta.
  Enquanto estiver vazio, o botão fica desativado ("Link de compra em breve").
- `contatoUrl`: link do WhatsApp da equipe, usado quando o tempo da oferta acaba.
- `faixas.mes` e `faixas.curso`: limites de cada faixa. O valor cai na primeira faixa cujo `ate` é maior ou igual a ele.
- `ofertas.oXXX.extras`: linhas a mais em "O que está incluso", se as ofertas tiverem diferenciais.
- `tempoOfertaSegundos`: 300 = 5 minutos.

## Como testar

- Abra uma página de oferta com `?reset=1` no final do endereço para o contador voltar a 05:00.
- O contador não reinicia ao atualizar a página. Se o mesmo navegador voltar em até 24 horas, continua de onde estava.

## Publicar

Suba os arquivos soltos no GitHub (Add file > Upload files) e importe o repositório na Vercel
(Framework Preset: Other, sem build command).
Precisa ser hospedagem de site estático. Não funciona colado dentro do Wix, porque o fluxo usa várias páginas.
