// 1. FIREBASE (Mantenha sua URL do projeto Firebase)
const firebaseConfig = {
    databaseURL: "https://zonix-play-default-rtdb.firebaseio.com/" 
};

try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const visitantesRef = database.ref('visitantes_online');
    const meuVisitanteRef = visitantesRef.push();

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
    console.log("Modo Offline");
}

// 2. LISTA DE JOGOS (Hoje: 02/05/2026)
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

// 3. LOGICA DE RENDERIZAÇÃO
function checkStatus(j) {
    const now = new Date();
    const gameTime = new Date(`${j.data}T${j.horario}:00`);
    const limit = new Date(gameTime.getTime() + (120 * 60 * 1000));
    
    if (j.encerrado) return { status: "finalizado", texto: "FINALIZADO" };
    if (now >= gameTime && now <= limit) return { status: "live", texto: "AO VIVO" };
    return { status: "breve", texto: j.horario };
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById('lista-jogos');
    if(!list) return;

    JOGOS.forEach(j => {
        const s = checkStatus(j);
        const isLive = s.status === 'live';
        const btn = isLive ? `<button onclick="openPlayer('${j.link}')" style="background:#00d2ff; border:none; padding:12px; color:#000; font-weight:900; cursor:pointer; border-radius:8px; width:100%; margin-top:15px; font-family:'Orbitron';">ASSISTIR AGORA</button>` : "";
        
        list.innerHTML += `
            <div style="background:#1a1a1a; border:1px solid #333; padding:20px; margin-bottom:15px; border-radius:12px; display:flex; flex-direction:column; align-items:center; box-shadow: 0 4px 15px rgba(0,0,0,0.6); border-top: 2px solid ${isLive ? '#00ff00' : '#444'};">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                    <div style="text-align:center; flex:1;"><img src="${j.escudo1}" width="50" style="filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));"><br><span style="font-size:13px; font-weight:bold;">${j.time1}</span></div>
                    <div style="flex:1; text-align:center; padding: 0 10px;">
                        <span style="display:block; font-size:11px; color:#00d2ff; text-transform:uppercase;">${j.campeonato}</span>
                        <strong style="font-size:22px; color:${isLive ? '#00ff00' : '#ffffff'}; font-family:'Orbitron';">
                            ${s.status === 'finalizado' ? j.placar1+' - '+j.placar2 : s.texto}
                        </strong>
                    </div>
                    <div style="text-align:center; flex:1;"><img src="${j.escudo2}" width="50" style="filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));"><br><span style="font-size:13px; font-weight:bold;">${j.time2}</span></div>
                </div>
                ${btn}
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