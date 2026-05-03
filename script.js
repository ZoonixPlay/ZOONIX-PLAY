// 1. CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    databaseURL: "https://zonix-play-default-rtdb.firebaseio.com/" 
};

// 2. CONTADOR DE PESSOAS REAIS (Sem travar)
try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const visitantesRef = database.ref('visitantes_online');
    const meuVisitanteRef = visitantesRef.push();

    // Plano B: Se o banco demorar, exibe "1"
    setTimeout(() => {
        const el = document.getElementById('pessoal-online');
        if (el && el.innerText === "Carregando...") el.innerText = "1";
    }, 3000);

    database.ref('.info/connected').on('value', (snap) => {
        if (snap.val() === true) {
            meuVisitanteRef.onDisconnect().remove();
            meuVisitanteRef.set(true);
        }
    });

    visitantesRef.on('value', (snap) => {
        const total = snap.numChildren();
        const el = document.getElementById('pessoal-online');
        if (el) el.innerText = total > 0 ? total : "1";
    });
} catch (e) {
    if (document.getElementById('pessoal-online')) {
        document.getElementById('pessoal-online').innerText = "1";
    }
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
        data: "2026-05-02", horario: "21:00",    
        link: "https://zac22bp.mpipzni2naturally32kistomach.ru/br/player.html?mdata=NDMyNDA2MV8x&ilang=br" 
    }
];

// 4. FUNÇÕES DO SISTEMA
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
            <div class="match-card ${s.classe}" style="background:#1a1a1a; padding:15px; margin-bottom:10px; border-left:4px solid #00d2ff; display:flex; justify-content:space-between; align-items:center; border-radius:8px;">
                <div class="team" style="display:flex; flex-direction:column; align-items:center;"><img src="${j.escudo1}" width="40"><span>${j.time1}</span></div>
                <div class="info-central" style="text-align:center;">
                    <span style="font-size:12px; opacity:0.8;">${j.campeonato}</span>
                    ${placar}
                    <span class="badge-status" style="display:block; font-weight:bold; color:#00ff00;">${s.texto}</span>
                    ${btn}
                </div>
                <div class="team" style="display:flex; flex-direction:column; align-items:center;"><img src="${j.escudo2}" width="40"><span>${j.time2}</span></div>
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