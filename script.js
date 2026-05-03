// 1. GERADOR DE PÚBLICO REALISTA (Baseado no Horário)
function atualizarContadorRealista() {
    const contadorEl = document.getElementById('pessoal-online');
    if (!contadorEl) return;

    // Pega a hora atual (0-23)
    const hora = new Date().getHours();
    let basePessoas;

    // Define um público baseado no horário do dia para parecer real
    if (hora >= 18 && hora <= 23) {
        basePessoas = Math.floor(Math.random() * (250 - 180 + 1)) + 180; // Horário de pico (noite)
    } else if (hora >= 12 && hora <= 17) {
        basePessoas = Math.floor(Math.random() * (150 - 90 + 1)) + 90;  // Tarde
    } else {
        basePessoas = Math.floor(Math.random() * (60 - 20 + 1)) + 20;    // Madrugada/Manhã
    }

    contadorEl.innerText = basePessoas.toLocaleString('pt-BR');
}

// Atualiza o número assim que abre e depois a cada 30 segundos
atualizarContadorRealista();
setInterval(atualizarContadorRealista, 30000);

// 2. LISTA DE JOGOS (Atualizada)
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

// 3. LÓGICA DE INTERFACE
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
        const placar = s.status === "finalizado" ? `<div class="placar-final" style="font-size:24px; font-weight:900; color:#00d2ff; text-align:center; margin:10px 0;">${j.placar1} X ${j.placar2}</div>` : "";

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

// 4. FUNÇÕES DO PLAYER
function openPlayer(link) {
    document.getElementById('videoIframe').src = link;
    document.getElementById('playerModal').style.display = 'flex';
}
function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('videoIframe').src = '';
}