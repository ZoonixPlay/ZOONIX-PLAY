let link1 = "";
let link2 = "";
let link3 = "";
let link4 = "";

// Função executada ao carregar a página
window.onload = function() {
    // Captura os parâmetros da URL (ch1, ch2, ch3 e ch4)
    const urlParams = new URLSearchParams(window.location.search);
    
    try {
        // Decodifica os links de Base64 para texto original
        link1 = atob(urlParams.get('ch1') || '');
        link2 = atob(urlParams.get('ch2') || '');
        link3 = atob(urlParams.get('ch3') || '');
        link4 = atob(urlParams.get('ch4') || '');

        // Esconde botões sem link
        if (!link2) document.getElementById('btn-op2').style.display = 'none';
        if (!link3) document.getElementById('btn-op3').style.display = 'none';
        if (!link4) document.getElementById('btn-op4').style.display = 'none';
        
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
    const btn3 = document.getElementById('btn-op3');
    const btn4 = document.getElementById('btn-op4');

    const links = { 1: link1, 2: link2, 3: link3, 4: link4 };
    const btns  = { 1: btn1,  2: btn2,  3: btn3,  4: btn4  };

    // Se o link não existir, não faz nada
    if (!links[num]) return;

    // Carrega o link correspondente
    iframe.src = links[num] || '';

    // Atualiza visual dos botões
    Object.values(btns).forEach(btn => btn && btn.classList.remove('ativo'));
    if (btns[num]) btns[num].classList.add('ativo');
}

function recarregarPagina() {
    location.reload(); // Isso faz a página atualizar e tentar carregar o player de novo
}

// ... restante das suas funções de trocar canal e capturar links ...