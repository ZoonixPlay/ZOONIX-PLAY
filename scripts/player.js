let link1 = "";
let link2 = "";

// Função executada ao carregar a página
window.onload = function() {
    // Captura os parâmetros da URL (ch1 e ch2)
    const urlParams = new URLSearchParams(window.location.search);
    
    try {
        // Decodifica os links de Base64 para texto original
        link1 = atob(urlParams.get('ch1'));
        link2 = atob(urlParams.get('ch2'));
        
        // Se os links existirem, inicia com a Opção 1
        if (link1) {
            trocarCanal(1);
        }
    } catch (e) {
        console.error("Erro ao carregar os links do jogo:", e);
    }
};

/**
 * Troca o link do iframe e atualiza o visual dos botões
 * @param {number} num - O número da opção (1 ou 2)
 */
function trocarCanal(num) {
    const iframe = document.getElementById('main-player');
    const btn1 = document.getElementById('btn-op1');
    const btn2 = document.getElementById('btn-op2');

    // Define qual link carregar
    if (num === 1) {
        iframe.src = link1;
        btn1.classList.add('ativo');
        btn2.classList.remove('ativo');
    } else {
        iframe.src = link2;
        btn2.classList.add('ativo');
        btn1.classList.remove('ativo');
    }
}

function recarregarPagina() {
    location.reload(); // Isso faz a página atualizar e tentar carregar o player de novo
}

// ... restante das suas funções de trocar canal e capturar links ...