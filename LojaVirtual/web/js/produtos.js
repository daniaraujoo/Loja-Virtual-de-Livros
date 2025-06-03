const livrosContainer = document.getElementById("livros");

fetch("http://localhost:3000/produtos")
  .then(res => res.json())
  .then(produtos => {
    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${produto.titulo}</h5>
            <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
            <p class="card-text">Estoque: ${produto.estoque}</p>
            <button class="btn btn-primary mt-auto" onclick="adicionarAoCarrinho(${produto.id})">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      `;
      livrosContainer.appendChild(card);
    });
  });

function adicionarAoCarrinho(idProduto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const itemExistente = carrinho.find(item => item.id === idProduto);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id: idProduto, quantidade: 1 });
  }
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Livro adicionado ao carrinho!");
}
