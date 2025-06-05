document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("detalhes-pedido");

  const pedido = JSON.parse(localStorage.getItem("pedidoFinalizado"));

  if (!pedido || !pedido.itens) {
    container.innerHTML = "<p>Não foi possível carregar os detalhes do pedido.</p>";
    return;
  }

  let html = `<p><strong>Nome do cliente:</strong> ${pedido.nome}</p>`;
  html += `<p><strong>Data do pedido:</strong> ${new Date(pedido.data).toLocaleString()}</p>`;
  html += `<p><strong>Total:</strong> R$ ${Number(pedido.total).toFixed(2)}</p>`;
  html += `<h5 class="mt-4">Itens do pedido:</h5><ul>`;


  pedido.itens.forEach(item => {
    html += `<li>${item.titulo} — Quantidade: ${item.quantidade}</li>`;
  });

  html += "</ul>";
  container.innerHTML = html;
});
