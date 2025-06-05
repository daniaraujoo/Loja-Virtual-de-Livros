document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form-finalizar").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const formaPagamento = document.querySelector('input[name="pagamento"]:checked')?.value;

    if (!nome || !endereco || !telefone || !cidade || !estado || !formaPagamento) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

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
          telefone,
          endereco,
          cidade,
          estado,
          formaPagamento,
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
            
            return Promise.all(
              itensPedido.map(item => atualizarEstoque(item.id, item.quantidade))
            );
          })
          .then(() => {
           
            localStorage.removeItem("carrinho");
            localStorage.setItem("pedidoFinalizado", JSON.stringify(pedido));
            window.location.href = "confirmacao.html";
          })
          .catch(() => {
            alert("Erro ao finalizar o pedido. Tente novamente.");
          });
      });

    function atualizarEstoque(produtoId, quantidadeVendida) {
      return fetch(`http://localhost:3000/produtos/${produtoId}`)
        .then(res => res.json())
        .then(produto => {
          const novoEstoque = produto.estoque - quantidadeVendida;
          return fetch(`http://localhost:3000/produtos/${produtoId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ estoque: novoEstoque })
          });
        });
    }
  });
});
