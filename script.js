// 1. CONFIGURAÇÃO DO FIREBASE (CONTADOR REAL)
const firebaseConfig = {
    databaseURL: "https://zonix-play-default-rtdb.firebaseio.com/" 
};

try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const visitantesRef = database.ref('visitantes_online');
    const meuVisitanteRef = visitantesRef.push();

    // Lógica de Presença
    database.ref('.info/connected').on('value', (snap) => {
        if (snap.val() === true) {
            meuVisitanteRef.onDisconnect().remove();
            meuVisitanteRef.set(true);
        }
    });

    // Atualiza o contador na tela
    visitantesRef.on('value', (snap) => {
        const total = snap.numChildren();
        const el = document.getElementById('pessoal-online');
        if (el) el.innerText = total > 0 ? total : "1";
    });
} catch (e) {
    console.error("Erro no Firebase: ", e);
}

// 2. BANCO DE DADOS DE JOGOS (Hoje: 02/05/2026)
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

// 3. LÓGICA DE EXIBIÇÃO
function checkStatus(j) {
    const now = new Date();
    const gameTime = new Date(`${j.data}T${j.horario}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    
    if (j.encerrado) return { status: "finalizado", texto: "FIM DE JOGO" };
    if (now >= gameTime && now <= limit) return { status: "live", texto: "AO VIVO" };
    return { status: "breve", texto: j.horario };
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById('lista-jogos');
    if(!list) return;

    JOGOS.forEach(j => {
        const s = checkStatus(j);
        const btn = s.status === "live" ? `<button class="btn-assistir" onclick="openPlayer('${j.link}')" style="background:#00d2ff; border:none; padding:8px 15px; color:#000; font-weight:bold; cursor:pointer; border-radius:5px; margin-top:5px;">ASSISTIR</button>` : "";
        
        list.innerHTML += `
            <div style="background:#111; border:1px solid #222; padding:15px; margin-bottom:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; color:#fff;">
                <div style="text-align:center; flex:1;"><img src="${j.escudo1}" width="35"><br><small>${j.time1}</small></div>
                <div style="text-align:center; flex:1;">
                    <span style="display:block; font-size:10px; color:#00d2ff; margin-bottom:4px;">${j.campeonato}</span>
                    <strong style="color:${s.status === 'live' ? '#00ff00' : '#888'};">${s.texto}</strong>
                    ${btn}
                </div>
                <div style="text-align:center; flex:1;"><img src="${j.escudo2}" width="35"><br><small>${j.time2}</small></div>
            </div>`;
    });
});

function openPlayer(link) {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    iframe.src = link;
    modal.style.display = 'flex';
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('videoIframe');
    modal.style.display = 'none';
    iframe.src = '';
}