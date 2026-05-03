// 1. CONFIGURAÇÃO FIREBASE (Use o seu link do Firebase aqui)
const firebaseConfig = {
    databaseURL: "https://zonix-play-default-rtdb.firebaseio.com/" 
};

// 2. LÓGICA DO CONTADOR 100% REAL
try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const visitantesRef = database.ref('visitantes_online');
    const meuVisitanteRef = visitantesRef.push();

    // Se em 5 segundos o Firebase não responder, remove o "Carregando" e põe "1"
    setTimeout(() => {
        const el = document.getElementById('pessoal-online');
        if (el && el.innerText === "Carregando...") {
            el.innerText = "1"; 
        }
    }, 5000);

    database.ref('.info/connected').on('value', (snap) => {
        if (snap.val() === true) {
            meuVisitanteRef.onDisconnect().remove();
            meuVisitanteRef.set(true);
        }
    });

    visitantesRef.on('value', (snap) => {
        const totalOnline = snap.numChildren();
        const contadorEl = document.getElementById('pessoal-online');
        if(contadorEl) {
            // MOSTRA APENAS O NÚMERO REAL
            contadorEl.innerText = totalOnline > 0 ? totalOnline.toLocaleString('pt-BR') : "1";
        }
    });
} catch (e) {
    document.getElementById('pessoal-online').innerText = "1";
}

// 3. LISTA DE JOGOS
const JOGOS = [
    {
        time1: "Palmeiras",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/330px-Palmeiras_logo.svg.png", 
        time2: "Santos",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/9/92/LogoSantosFC.png",
        placar1: 1, placar2: 1, encerrado: true,
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-02", horario: "18:30",    
        link: "https://zac22bp.mpipzni2naturally32kistomach.ru/br/player.html?mdata=NDMyNDA1NV8x&ilang=br"
    },   
    {
        time1: "Cruzeiro",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/1280px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png", 
        time2: "Atlético Mineiro",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Atletico_mineiro_galo.png/250px-Atletico_mineiro_galo.png",
        placar1: 0, placar2: 0, encerrado: false,
        campeonato: "Brasileirão Série A",
        logoCampeonato: "https://upload.wikimedia.org/wikipedia/pt/1/18/Campeonato_Brasileiro_de_Futebol_de_2022_-_S%C3%A9rie_A.png", 
        data: "2026-05-02", horario: "21:00",    
        link: "https://zac22bp.mpipzni2naturally32kistomach.ru/br/player.html?mdata=NDMyNDA2MV8x&ilang=br" 
    }
];

// 4. FUNÇÕES DE UI
function checkStatus(j) {
    const now = new Date();
    const gameTime = new Date(`${j.data}T${j.horario}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    if (j.encerrado) return { status: "finalizado", texto: "FIM DE JOGO", classe: "card-encerrado" };
    if (now >= gameTime && now <= limit) return { status: "live", texto: "AO VIVO", classe: "card-ao-vivo" };
    return { status: "breve", texto: `${j.data.split('-').reverse().join('/')} - ${j.horario}`, classe: "" };
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById('lista-jogos');
    if(!list) return;
    JOGOS.forEach(j => {
        const s = checkStatus(j);
        const btn = s.status === "live" ? `<button class="btn-assistir" onclick="openPlayer('${j.link}')">ASSISTIR</button>` : "";
        const placar = s.status === "finalizado" ? `<div class="placar-final" style="font-size:24px; font-weight:900; color:#00d2ff; text-align:center;">${j.placar1} X ${j.placar2}</div>` : "";

        list.innerHTML += `
            <div class="match-card ${s.classe}">
                <div class="team"><img src="${j.escudo1}"><span>${j.time1}</span></div>
                <div class="info-central">
                    <span style="font-size:12px; opacity:0.8;">${j.campeonato}</span>
                    ${placar}
                    <span class="badge-status">${s.texto}</span>
                    ${btn}
                </div>
                <div class="team"><img src="${j.escudo2}"><span>${j.time2}</span></div>
            </div>`;
    });
});

function openPlayer(link) {
    document.getElementById('videoIframe').src = link;
    document.getElementById('playerModal').style.display = 'flex';
}
function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
}