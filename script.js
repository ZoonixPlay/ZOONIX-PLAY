const JOGOS = [
    {
        time1: "Independiente Medellín",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Escudo_del_Deportivo_Independiente_Medell%C3%ADn.png/250px-Escudo_del_Deportivo_Independiente_Medell%C3%ADn.png",
        time2: "Flamengo",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/9/96/Clube_de_Regatas_do_Flamengo_logo.svg",
        encerrado: false,
        campeonato: "CONMEBOL Libertadores",
        data: "2026-05-07",
        horario: "21:30",
        link1: "https://w1.embedtv.live/espn",
        link2: "https://5embeddecanais.xyz/espn/"
    }
];

function checkStatus(jogo) {
    const now = new Date();
    const gameTime = new Date(`${jogo.data}T${jogo.horario}:00`);
    const limit = new Date(gameTime.getTime() + 150 * 60 * 1000);
    const hoje = now.toISOString().split("T")[0];
    const [ano, mes, dia] = jogo.data.split("-");
    const dataFormatada = (jogo.data === hoje) ? "HOJE" : `${dia}/${mes}`;

    if (jogo.encerrado || now > limit) {
        return {
            status: "finalizado",
            labelHorario: "FIM DE JOGO",
            textoBotao: "ENCERRADO"
        };
    }
    if (now >= gameTime && now <= limit) {
        return {
            status: "live",
            labelHorario: null, // ao vivo não precisa de horário, usa o badge
            textoBotao: "ASSISTIR AGORA"
        };
    }
    return {
        status: "breve",
        labelHorario: `${dataFormatada} ÀS ${jogo.horario}`,
        textoBotao: "AGUARDE"
    };
}

function irParaPlayer(l1, l2) {
    window.location.href = `player.html?ch1=${btoa(l1)}&ch2=${btoa(l2)}`;
}

function criarCard(j) {
    const s = checkStatus(j);
    const card = document.createElement("div");

    card.className = `match-card ${s.status === "live" ? "card-ao-vivo" : ""}`;

    card.innerHTML = `
        <div class="scanlines"></div>

        <div class="bg-logo-container">
            <img src="${j.escudo1}" class="bg-logo left">
            <img src="${j.escudo2}" class="bg-logo right">
        </div>

        <div class="team">
            <img src="${j.escudo1}" alt="${j.time1}">
            <span>${j.time1}</span>
        </div>

        <div class="info-central">
            <!-- Nome do campeonato SEMPRE aparece aqui -->
            <div class="campeonato-container">
                <span class="campeonato-nome">${j.campeonato}</span>
            </div>

            <div class="placar-final">
                <span class="vs">VS</span>
            </div>

            <!-- Horário (breve/finalizado) ou badge AO VIVO -->
            ${s.status === "live"
                ? `<div class="badge-status ao-vivo">● AO VIVO</div>`
                : `<div class="badge-status">${s.labelHorario}</div>`
            }

            <!-- Botão: habilitado só ao vivo -->
            <button class="btn-assistir"
                ${s.status !== "live" ? "disabled style='opacity:0.5; cursor:not-allowed'" : ""}
                onclick="irParaPlayer('${j.link1}', '${j.link2}')">
                ${s.textoBotao}
            </button>
        </div>

        <div class="team">
            <img src="${j.escudo2}" alt="${j.time2}">
            <span>${j.time2}</span>
        </div>
    `;
    return card;
}

function renderizarJogos() {
    const list = document.getElementById("lista-jogos");
    if (!list) return;
    list.innerHTML = "";
    JOGOS.forEach(j => list.appendChild(criarCard(j)));
}

document.addEventListener("DOMContentLoaded", renderizarJogos);
