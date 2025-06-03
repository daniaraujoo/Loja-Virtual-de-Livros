const carrinhoContainer = document.getElementById("carrinho-itens");
const totalContainer = document.getElementById("total-carrinho");

function carregarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    carrinhoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalContainer.innerText = "R$ 0,00";
    return;
  }

  fetch("http://localhost:3000/produtos")
    .then(res => res.json())
    .then(produtos => {
      let total = 0;
      let html = '<table class="table"><thead><tr><th>Livro</th><th>Preço</th><th>Quantidade</th><th>Subtotal</th></tr></thead><tbody>';

      carrinho.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        if (produto) {
          const subtotal = produto.preco * item.quantidade;
          total += subtotal;
          html += `
            <tr>
              <td>${produto.titulo}</td>
              <td>R$ ${produto.preco.toFixed(2)}</td>
              <td>${item.quantidade}</td>
              <td>R$ ${subtotal.toFixed(2)}</td>
            </tr>
          `;
        }
      });

      html += `</tbody></table>`;
      carrinhoContainer.innerHTML = html;
      totalContainer.innerText = `R$ ${total.toFixed(2)}`;
    });
}

// Executa ao carregar a página
window.onload = carregarCarrinho;
