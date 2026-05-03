// CONFIGURAÇÃO DO FIREBASE (OFICIAL)
// Certifique-se de ter incluído os scripts do Firebase no seu HTML antes deste arquivo
const firebaseConfig = {
    databaseURL: "https://zonix-play-default-rtdb.firebaseio.com/" 
};

// Inicialização do Contador Real
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const visitantesRef = database.ref('visitantes_online');
const meuVisitanteRef = visitantesRef.push();

const conectandoRef = database.ref('.info/connected');
conectandoRef.on('value', (snap) => {
    if (snap.val() === true) {
        meuVisitanteRef.onDisconnect().remove();
        meuVisitanteRef.set(true);
    }
});

visitantesRef.on('value', (snap) => {
    const totalOnline = snap.numChildren();
    const contadorEl = document.getElementById('pessoal-online');
    if(contadorEl) contadorEl.innerText = totalOnline.toLocaleString('pt-BR');
});

// LISTA DE JOGOS ATUALIZADA
const JOGOS = [
    {
        time1: "Palmeiras",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/330px-Palmeiras_logo.svg.png", 
        time2: "Santos",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/9/92/LogoSantosFC.png",
        placar1: 1, 
        placar2: 1,
        encerrado: true, // FIM DE JOGO: Mostra placar e remove o play
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-02", 
        horario: "18:30",    
        link: "https://zac22bp.mpipzni2naturally32kistomach.ru/br/player.html?mdata=NDMyNDA1NV8x&ilang=br"
    },   
    {
        time1: "Cruzeiro",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/1280px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png", 
        time2: "Atlético Mineiro",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Atletico_mineiro_galo.png/250px-Atletico_mineiro_galo.png",
        placar1: 0,
        placar2: 0,
        encerrado: false,
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-02", 
        horario: "21:00",    
        link: "https://zac22bp.mpipzni2naturally32kistomach.ru/br/player.html?mdata=NDMyNDA2MV8x&ilang=br" 
    },
    {
        time1: "Flamengo",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png", 
        time2: "Vasco Da Gama",
        escudo2: "https://logodownload.org/wp-content/uploads/2016/09/vasco-logo.png",
        placar1: 0,
        placar2: 0,
        encerrado: false,
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-03", 
        horario: "16:00",    
        link: "#" 
    },
];

// LÓGICA DE STATUS E EXIBIÇÃO
function checkStatus(jogo) {
    const now = new Date();
    const gameTime = new Date(`${jogo.data}T${jogo.horario}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    const [ano, mes, dia] = jogo.data.split('-'); 
    const dataBr = `${dia}/${mes}/${ano}`;

    if (jogo.encerrado) {
        return { status: "finalizado", classe: "card-encerrado", badge: "encerrado", texto: "FIM DE JOGO" };
    }
    if (now >= gameTime && now <= limit) {
        return { status: "live", classe: "card-ao-vivo", badge: "ao-vivo", texto: "AO VIVO" };
    }
    return { status: "breve", classe: "", badge: "em-breve", texto: `${dataBr} - ${jogo.horario}` };
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById('lista-jogos');
    
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

// FUNÇÕES DO MODAL (MULTIPLATAFORMA)
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

window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target == modal) { closePlayer(); }
}

// BLOQUEIOS DE SEGURANÇA
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
};