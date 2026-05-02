const JOGOS = [
    {
        time1: "Palmeiras",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/330px-Palmeiras_logo.svg.png", 
        time2: "Santos",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/9/92/LogoSantosFC.png",
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-02", 
        horario: "18:30",    
        link: "https://zac22bp.mpipzni2naturally32kistomach.ru/br/player.html?mdata=NDMyNDA1NV8x&ilang=br"
    },    
    {
        time1: "Flamengo",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png", 
        time2: "Vasco Da Gama",
        escudo2: "https://logodownload.org/wp-content/uploads/2016/09/vasco-logo.png",
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-03", 
        horario: "16:00",    
        link: "#" 
    },

];

// FUNÇÕES DO PLAYER MODAL
function openPlayer(url) {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    iframe.src = url;
    modal.style.display = 'flex';
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    iframe.src = ''; 
    modal.style.display = 'none';
}

function checkStatus(d, h) {
    const now = new Date();
    const gameTime = new Date(`${d}T${h}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    
    const [ano, mes, dia] = d.split('-'); 
    const dataBr = `${dia}/${mes}/${ano}`;

    if (now >= gameTime && now <= limit) {
        return { isLive: true, classe: "card-ao-vivo", badge: "ao-vivo", texto: "AO VIVO" };
    }
    return { isLive: false, classe: "", badge: "em-breve", texto: `${dataBr} - ${h}` };
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById('lista-jogos');
    
    JOGOS.forEach(j => {
        const s = checkStatus(j.data, j.horario);
        
        // Botão modificado para chamar o player interno
        const btnHtml = s.isLive 
            ? `<button class="btn-assistir" onclick="openPlayer('${j.link}')">ASSISTIR</button>` 
            : `<div class="btn-placeholder"></div>`;

        list.innerHTML += `
            <div class="match-card ${s.classe}">
                <div class="team">
                    <img src="${j.escudo1}">
                    <span>${j.time1}</span>
                </div>
                
                <div class="info-central">
                    <div class="campeonato-container">
                        <img src="${j.logoCampeonato}" class="logo-campeonato">
                        <span class="campeonato-nome">${j.campeonato}</span>
                    </div>
                    <span class="badge-status ${s.badge}">${s.texto}</span>
                    ${btnHtml}
                </div>

                <div class="team">
                    <img src="${j.escudo2}">
                    <span>${j.time2}</span>
                </div>
            </div>`;
    });

    // Fechar modal ao clicar fora dele
    window.onclick = function(event) {
        const modal = document.getElementById('playerModal');
        if (event.target == modal) { closePlayer(); }
    }
});

// Exemplo de link codificado em Base64
const linkCodificado = "aHR0cHM6Ly9tZXVwbGF5ZXJvbmxpbmVoZC5jb20vbXlwbGF5L3dhdGNoLmh0bWw/aWQ9c3BvcnR5bmV0";

function openPlayer() {
    // Decodifica o link na hora de abrir
    const linkOriginal = atob(linkCodificado); 
    document.getElementById('videoIframe').src = linkOriginal;
    document.getElementById('playerModal').style.display = 'flex';
}

// Bloqueia o Botão Direito
document.addEventListener('contextmenu', event => event.preventDefault());

// Bloqueia F12, Ctrl+Shift+I, Ctrl+Shift+J e Ctrl+U
document.onkeydown = function(e) {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) || 
        (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
        return false;
    }
};

function openPlayer(link) {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');

    // Tenta decodificar o link. Se não for Base64, ele usa o link direto.
    try {
        iframe.src = atob(link);
    } catch (e) {
        iframe.src = link;
    }
    
    modal.style.display = 'flex';
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    
    modal.style.display = 'none';
    iframe.src = ''; // Limpa o player para não continuar o som
}
