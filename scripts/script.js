const formCatalogo = document.getElementById('formCatalogo');
const gridCatalogo = document.getElementById('gridCatalogo');

async function carregarItens() {
    try {
        const resposta = await fetch('https://meu-catalogo-4cl0.onrender.com/itens');
        const itens = await resposta.json();
        
        gridCatalogo.innerHTML = ''; 
        
        itens.forEach(item => {
            const divCard = document.createElement('div');
            divCard.classList.add('card');
            
            const htmlDescricao = item.descricao ? `<p class="descricao">${item.descricao}</p>` : '';
            const htmlNota = item.nota ? `<p class="nota"> Nota: ${item.nota}</p>` : '';
            const htmlPreco = item.preco ? `<p style="color: #27ae60; font-weight: bold; margin-bottom: 15px;"> Preço: R$ ${item.preco}</p>` : '';
            
            divCard.innerHTML = `
                <div>
                    <h3>${item.nome}</h3>
                    <p class="categoria">${item.categoria}</p>
                    ${htmlDescricao}
                    ${htmlNota}
                    ${htmlPreco}
                </div>
                <button class="btn-excluir" onclick="excluirItem(${item.id})">Excluir</button>
            `;
            
            gridCatalogo.appendChild(divCard);
        });
    } catch (erro) {
        console.error('Erro ao carregar os itens:', erro);
    }
}

formCatalogo.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const novoItem = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        descricao: document.getElementById('descricao').value,
        nota: document.getElementById('nota').value,
        preco: document.getElementById('preco').value
    };

    await fetch('https://meu-catalogo-4cl0.onrender.com/itens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem)
    });

    formCatalogo.reset(); 
    carregarItens(); 
});

async function excluirItem(id) {
    if(confirm("Tem certeza que deseja excluir este item?")) {
        await fetch(`https://meu-catalogo-4cl0.onrender.com/itens${id}`, {
            method: 'DELETE'
        });
        carregarItens();
    }
}

carregarItens();
