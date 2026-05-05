const JOGOS = [
    {
        time1: "Audax Italiano",
        escudo1: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/4138.png", 
        time2: "Vasco Da Gama",
        escudo2: "https://logodownload.org/wp-content/uploads/2016/09/vasco-logo-1.png",
        encerrado: false, 
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
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    
    const [ano, mes, dia] = jogo.data.split('-'); 
    const dataBr = `${dia}/${mes}/${ano}`;

    if (jogo.encerrado || now > limit) {
        return { status: "finalizado", classe: "card-encerrado", badge: "encerrado", texto: "FIM DE JOGO" };
    }

    if (now >= gameTime && now <= limit) {
        return { status: "live", classe: "card-ao-vivo", badge: "ao-vivo", texto: "AO VIVO" };
    }

    return { status: "breve", classe: "", badge: "em-breve", texto: `${dataBr} - ${jogo.horario}` };
}

function renderizarJogos() {
    const list = document.getElementById('lista-jogos');
    if (!list) return;
    
    list.innerHTML = ""; 
    
    JOGOS.forEach(j => {
        const s = checkStatus(j);
        let infoCentroHtml = "";
        
        if (s.status === "finalizado") {
            infoCentroHtml = `
                <div class="placar-final">
                    <span class="vs">ENCERRADO</span>
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
    setInterval(renderizarJogos, 60000); 
});

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
