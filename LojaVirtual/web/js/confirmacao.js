const container = document.getElementById("detalhes-pedido");

fetch("http://localhost:3000/pedidos?_sort=id&_order=desc&_limit=1")
  .then(res => res.json())
  .then(pedidos => {
    if (pedidos.length === 0) {
      container.innerHTML = "<p>Nenhum pedido encontrado.</p>";
      return;
    }

    const pedido = pedidos[0];
    let html = `<p><strong>Data do pedido:</strong> ${pedido.data}</p>`;
    html += `<p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>`;
    html += `<h5 class="mt-3">Itens do pedido:</h5><ul>`;

    // Busca os títulos dos livros para exibir
    fetch("http://localhost:3000/produtos")
      .then(res => res.json())
      .then(produtos => {
        pedido.itens.forEach(item => {
          const produto = produtos.find(p => p.id === item.id);
          html += `<li>${produto.titulo} — Quantidade: ${item.quantidade}</li>`;
        });

        html += "</ul>";
        container.innerHTML = html;
      });
  });
