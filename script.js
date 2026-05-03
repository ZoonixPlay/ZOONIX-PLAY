const JOGOS = [
    {
        time1: "Internacional",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sport_Club_Internacional_logo.svg/3840px-Sport_Club_Internacional_logo.svg.png", 
        time2: "Fluminense",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fluminense_Football_Club.svg/500px-Fluminense_Football_Club.svg.png",
        placar1: 0,
        placar2: 0,
        encerrado: false,
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-03", 
        horario: "18:30",    
        link: "#" 
    },
];

function checkStatus(jogo) {
    const now = new Date();
    const gameTime = new Date(`${jogo.data}T${jogo.horario}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    
    const [ano, mes, dia] = jogo.data.split('-'); 
    const dataBr = `${dia}/${mes}/${ano}`;

    // Se o jogo estiver marcado como encerrado
    if (jogo.encerrado) {
        return { status: "finalizado", classe: "card-encerrado", badge: "encerrado", texto: "FIM DE JOGO" };
    }

    // Se estiver no horário do jogo
    if (now >= gameTime && now <= limit) {
        return { status: "live", classe: "card-ao-vivo", badge: "ao-vivo", texto: "AO VIVO" };
    }

    // Se for antes do jogo
    return { status: "breve", classe: "", badge: "em-breve", texto: `${dataBr} - ${jogo.horario}` };
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById('lista-jogos');
    
    JOGOS.forEach(j => {
        const s = checkStatus(j);
        
        // Lógica do Placar e Botão
        let infoCentroHtml = "";
        
        if (s.status === "finalizado") {
            // Se acabou: Mostra Placar e Tira o Botão
            infoCentroHtml = `
                <div class="placar-final">
                    <span class="gols">${j.placar1}</span>
                    <span class="vs">X</span>
                    <span class="gols">${j.placar2}</span>
                </div>
                <span class="badge-status ${s.badge}">${s.texto}</span>
            `;
        } else if (s.status === "live") {
            // Se está ao vivo: Mostra Botão
            infoCentroHtml = `
                <span class="badge-status ${s.badge}">${s.texto}</span>
                <button class="btn-assistir" onclick="openPlayer('${j.link}')">ASSISTIR</button>
            `;
        } else {
            // Se ainda vai começar: Mostra data/hora
            infoCentroHtml = `
                <span class="badge-status ${s.badge}">${s.texto}</span>
                <div class="btn-placeholder"></div>
            `;
        }

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
                    ${infoCentroHtml}
                </div>

                <div class="team">
                    <img src="${j.escudo2}">
                    <span>${j.time2}</span>
                </div>
            </div>`;
    });
});

// Funções do Modal
function openPlayer(link) {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    try {
        iframe.src = atob(link);
    } catch (e) {
        iframe.src = link;
    }
    modal.style.display = 'flex';
}

function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
}

// Fechar ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target == modal) { closePlayer(); }
}

// Bloqueios de Segurança
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
};
