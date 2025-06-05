const tabelaCarrinho = document.getElementById("tabela-carrinho");
const totalElement = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function atualizarCarrinho() {
  tabelaCarrinho.innerHTML = "";
  let total = 0;

  fetch("http://localhost:3000/produtos")
    .then(res => res.json())
    .then(produtos => {
      carrinho.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        const subtotal = produto.preco * item.quantidade;
        total += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${produto.imagem}" alt="${produto.titulo}" class="img-fluid"></td>
          <td>${produto.titulo}</td>
          <td>R$ ${produto.preco.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="alterarQuantidade(${item.id}, -1)">-</button>
            ${item.quantidade}
            <button class="btn btn-sm btn-outline-primary ms-1" onclick="alterarQuantidade(${item.id}, 1)">+</button>
          </td>
          <td>R$ ${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="removerDoCarrinho(${item.id})">Remover</button>
          </td>
        `;
        tabelaCarrinho.appendChild(row);
      });

      totalElement.textContent = total.toFixed(2);
    });
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(p => p.id !== id);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(p => p.id !== id);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

atualizarCarrinho();
