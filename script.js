const JOGOS = [
    {
        time1: "Audax Italiano",
        escudo1: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/4138.png", 
        time2: "Vasco Da Gama",
        escudo2: "https://logodownload.org/wp-content/uploads/2016/09/vasco-logo-1.png",
        placar1: 0,
        placar2: 0,
        encerrado: false, // Se mudar para true, encerra na hora. Se for false, encerra automático após 2h.
        campeonato: "CONMEBOL Sudamericana",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/e/e4/Conmebol_Sudamericana_logo.png", 
        data: "2026-05-06", 
        horario: "19:00",    
        link: "https://nossoplayeronlinehd.cfd/tv/paramountplus" 
    },
];

function checkStatus(jogo) {
    const now = new Date();
    const gameTime = new Date(`${jogo.data}T${jogo.horario}:00`);
    
    // Define o limite de 120 minutos (2 horas) para encerramento automático
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    
    const [ano, mes, dia] = jogo.data.split('-'); 
    const dataBr = `${dia}/${mes}/${ano}`;

    // REGRA DE ENCERRAMENTO: Se marcado como encerrado OU se o horário atual passou do limite de 2h
    if (jogo.encerrado || now > limit) {
        return { status: "finalizado", classe: "card-encerrado", badge: "encerrado", texto: "FIM DE JOGO" };
    }

    // REGRA AO VIVO: Se está entre o horário de início e o limite de 2h
    if (now >= gameTime && now <= limit) {
        return { status: "live", classe: "card-ao-vivo", badge: "ao-vivo", texto: "AO VIVO" };
    }

    // REGRA AGENDADO: Antes do início
    return { status: "breve", classe: "", badge: "em-breve", texto: `${dataBr} - ${jogo.horario}` };
}

function renderizarJogos() {
    const list = document.getElementById('lista-jogos');
    if (!list) return;
    
    list.innerHTML = ""; // Limpa a lista para atualizar
    
    JOGOS.forEach(j => {
        const s = checkStatus(j);
        let infoCentroHtml = "";
        
        if (s.status === "finalizado") {
            infoCentroHtml = `
                <div class="placar-final">
                    <span class="gols">${j.placar1}</span>
                    <span class="vs">X</span>
                    <span class="gols">${j.placar2}</span>
                </div>
                <span class="badge-status ${s.badge}">${s.texto}</span>
            `;
        } else if (s.status === "live") {
            infoCentroHtml = `
                <span class="badge-status ${s.badge}">${s.texto}</span>
                <button class="btn-assistir" onclick="openPlayer('${j.link}')">ASSISTIR</button>
            `;
        } else {
            infoCentroHtml = `
                <span class="badge-status ${s.badge}">${s.texto}</span>
                <div class="btn-placeholder"></div>
            `;
        }

        list.innerHTML += `
            <div class="match-card ${s.classe}">
                <div class="bg-logo-container">
                    <img src="${j.escudo1}" class="bg-logo left">
                    <img src="${j.escudo2}" class="bg-logo right">
                </div>
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
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarJogos();
    // Atualiza a lista automaticamente a cada 60 segundos para virar o status sem F5
    setInterval(renderizarJogos, 60000); 
});

// Funções do Modal e Segurança permanecem as mesmas...
function openPlayer(link) {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    try { iframe.src = atob(link); } catch (e) { iframe.src = link; }
    modal.style.display = 'flex';
}

function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
}

window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target == modal) { closePlayer(); }
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
};
