const JOGOS = [
    {
        time1: "Botafogo",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg/500px-Botafogo_de_Futebol_e_Regatas_logo.svg.png", 
        time2: "Racing",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/500px-Escudo_de_Racing_Club_%282014%29.svg.png",
        encerrado: false, 
        campeonato: "CONMEBOL Sudamericana",
        data: "2026-05-06", 
        horario: "21:30",    
        link: "https://nossoplayeronlinehd.cfd/tv/paramountplus" 
    },     
    {
        time1: "Santa Fe",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Escudo_de_Independiente_Santa_Fe.png/250px-Escudo_de_Independiente_Santa_Fe.png", 
        time2: "Corinthians",
        escudo2: "https://logodownload.org/wp-content/uploads/2016/11/Corinthians-logo-escudo-1.png",
        encerrado: false, 
        campeonato: "CONMEBOL Libertadores",
        data: "2026-05-06", 
        horario: "21:30",    
        link: "https://nossoplayeronlinehd.ink/tv/globosp" 
    },
    {
        time1: "Rivadavia",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Escudo_del_Club_Independiente_Rivadavia.svg/960px-Escudo_del_Club_Independiente_Rivadavia.svg.png", 
        time2: "Fluminense",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fluminense_Football_Club.svg/1920px-Fluminense_Football_Club.svg.png",
        encerrado: false, 
        campeonato: "CONMEBOL Libertadores",
        data: "2026-05-06", 
        horario: "21:30",    
        link: "https://nossoplayeronlinehd.ink/tv/globorj" 
    },
    {
        time1: "Universidade Católica",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Escudo_Club_Deportivo_Universidad_Cat%C3%B3lica.svg/3840px-Escudo_Club_Deportivo_Universidad_Cat%C3%B3lica.svg.png", 
        time2: "Cruzeiro",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg",
        encerrado: false, 
        campeonato: "CONMEBOL Libertadores",
        data: "2026-05-06", 
        horario: "23:00",    
        link: "https://nossoplayeronlinehd.cfd/tv/espn" 
    }
];

function checkStatus(jogo) {
    const now = new Date();
    const gameTime = new Date(`${jogo.data}T${jogo.horario}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    const hoje = now.toISOString().split('T')[0];
    const [ano, mes, dia] = jogo.data.split('-');
    const dataExibicao = (jogo.data === hoje) ? "Hoje" : `${dia}/${mes}/${ano}`;

    if (jogo.encerrado || now > limit) {
        return { status: "finalizado", classe: "card-encerrado", badge: "encerrado", texto: "FIM DE JOGO" };
    }
    if (now >= gameTime && now <= limit) {
        return { status: "live", classe: "card-ao-vivo", badge: "ao-vivo", texto: "AO VIVO" };
    }
    return { status: "breve", classe: "", badge: "em-breve", texto: `${dataExibicao} - ${jogo.horario}` };
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

function openPlayer(link) {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');

    // 1. Decodifica o link
    let urlFinal;
    try {
        urlFinal = atob(link);
    } catch (e) {
        urlFinal = link;
    }

    // 2. Garante HTTPS (Obrigatório para TVs modernas)
    if (window.location.protocol === 'https:') {
        urlFinal = urlFinal.replace("http://", "https://");
    }

    // 3. Exibe o modal ANTES de injetar o link (isso acelera a renderização na TV)
    modal.style.display = 'block';

    // 4. Injeta o link com um delay mínimo
    setTimeout(() => {
        iframe.setAttribute("referrerpolicy", "no-referrer");
        iframe.src = urlFinal;
    }, 100);
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = ""; // Para o som quando fecha o modal
}

window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target == modal) { 
        closePlayer(); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarJogos();
    setInterval(renderizarJogos, 60000); 
});

