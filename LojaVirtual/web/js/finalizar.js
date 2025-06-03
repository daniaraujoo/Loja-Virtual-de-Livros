document.getElementById("form-finalizar").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que o formulário recarregue a página

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  fetch("http://localhost:3000/produtos")
    .then(res => res.json())
    .then(produtos => {
      const itensPedido = carrinho.map(item => {
        const produto = produtos.find(p => p.id === item.id);
        return {
          id: item.id,
          titulo: produto.titulo,
          preco: produto.preco,
          quantidade: item.quantidade
        };
      });

      const total = itensPedido.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

      const pedido = {
        nome,
        email,
        data: new Date().toISOString(),
        itens: itensPedido,
        total: total.toFixed(2)
      };

      fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      })
        .then(() => {
          localStorage.removeItem("carrinho"); // limpa o carrinho
          window.location.href = "confirmacao.html"; // redireciona
        })
        .catch(() => alert("Erro ao finalizar o pedido. Tente novamente."));
    });
});
