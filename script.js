// 1. LÓGICA DE CONTAGEM REAL (Via API Gratuita - Sem Firebase/Console)
async function atualizarContadorReal() {
    const contadorEl = document.getElementById('pessoal-online');
    
    // Usamos o serviço CountAPI que é aberto e funciona na hora
    // O 'zonix-play-2026' é a sua chave única
    const url = "https://api.countapi.xyz/hit/zonix-play-oficial/visitas";

    try {
        const resposta = await fetch(url);
        const dados = await JSON.parse(await resposta.text());
        
        if (contadorEl) {
            // Exibe o número real de vezes que o site foi carregado
            contadorEl.innerText = dados.value.toLocaleString('pt-BR');
        }
    } catch (erro) {
        console.error("Erro ao carregar contador:", erro);
        if (contadorEl) contadorEl.innerText = "1";
    }
}

// Atualiza ao carregar a página
atualizarContadorReal();

// 2. LISTA DE JOGOS
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

// 3. FUNÇÕES DE STATUS E UI
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