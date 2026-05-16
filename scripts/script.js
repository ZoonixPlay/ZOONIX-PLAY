const JOGOS = [
    {
        time1: "Internacional",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sport_Club_Internacional_logo.svg/3840px-Sport_Club_Internacional_logo.svg.png",
        time2: "Vasco Da Gama",
        escudo2: "https://logodownload.org/wp-content/uploads/2016/09/vasco-logo.png",
        encerrado: false,
        campeonato: "Brasileirão Serie A",
        data: "2026-05-16",
        horario: "18:30",
        duracao: 150, /* minutos — futebol: 90min + intervalo + acréscimos */
        link1: "https://meuplayeronlinehd.com/myplay/watch.html?id=primevideo1",
        link2: " https://meuplayeronlinehd.com/myplay/watch.html?id=brasileiraoprime-2 "
    }


    /*{
        time1: "Islam Makhachev",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_logo.svg/200px-UFC_logo.svg.png",
        time2: "Charles Oliveira",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_logo.svg/200px-UFC_logo.svg.png",
        encerrado: false,
        campeonato: "UFC 317 — Peso Leve",
        data: "2026-05-09",
        horario: "12:00",
        duracao: 360,
        link1: "https://seu-link-1",
        link2: "https://seu-link-2"
    }
/* ── COMO ADICIONAR OUTROS ESPORTES ────────────────────────
    FORMULA 1:
    ,{
        time1: "Max Verstappen",
        escudo1: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/200px-F1.svg.png",
        time2: "Lewis Hamilton",
        escudo2: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/200px-F1.svg.png",
        encerrado: false,
        campeonato: "F1 — GP Monaco 2026",
        data: "2026-05-25",
        horario: "09:00",
        duracao: 120,
        link1: "https://seu-link-1",
        link2: "https://seu-link-2"
    }
    ──────────────────────────────────────────────────────────── */
];

/* ============================================================
   DURAÇÃO POR ESPORTE
   Usado como fallback se o jogo não tiver campo "duracao"
   ============================================================ */
function getDuracaoJogo(jogo) {
    if (jogo.duracao) return jogo.duracao;

    const camp = (jogo.campeonato || "").toLowerCase();

    if (camp.includes("ufc") || camp.includes("mma") || camp.includes("luta"))           return 360; /* 6h — prelim + main card */
    if (camp.includes("box"))                                                              return 180; /* 3h */
    if (camp.includes("nba") || camp.includes("basket"))                                  return 180; /* 3h */
    if (camp.includes("nfl") || camp.includes("futebol americano"))                       return 240; /* 4h */
    if (camp.includes("tenis") || camp.includes("tênis"))                                 return 300; /* 5h */
    if (camp.includes("f1")   || camp.includes("formula 1") || camp.includes("fórmula 1") ||
        camp.includes("grande prêmio") || camp.includes("grande premio"))                 return 120; /* 2h — corrida */

    return 150; /* padrão futebol */
}

/* ============================================================
   STATUS DO JOGO
   ============================================================ */
function checkStatus(jogo) {
    const now      = new Date();
    const gameTime = new Date(`${jogo.data}T${jogo.horario}:00`);
    const duracao  = getDuracaoJogo(jogo);
    const limit    = new Date(gameTime.getTime() + duracao * 60 * 1000);

    const hojeStr  = now.toISOString().split("T")[0];
    const eHoje    = jogo.data === hojeStr;

    const [ano, mes, dia] = jogo.data.split("-");
    const dataFormatada = eHoje ? "HOJE" : `${dia}/${mes}/${ano}`;

    if (jogo.encerrado || now > limit) {
        return { status: "finalizado", eHoje };
    }
    if (now >= gameTime && now <= limit) {
        return { status: "live", eHoje };
    }
    return {
        status: eHoje ? "hoje" : "futuro",
        dataFormatada,
        horario: jogo.horario,
        gameTime,
        eHoje
    };
}

function irParaPlayer(l1, l2) {
    window.location.href = `player.html?ch1=${btoa(l1)}&ch2=${btoa(l2)}`;
}

function getDominantColor(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = 20; canvas.height = 20;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, 20, 20);
                const data = ctx.getImageData(0, 0, 20, 20).data;
                let r = 0, g = 0, b = 0, count = 0;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i+3] < 128) continue;
                    const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
                    if (brightness < 20 || brightness > 235) continue;
                    r += data[i]; g += data[i+1]; b += data[i+2];
                    count++;
                }
                if (count === 0) return resolve("rgba(0,210,255,0.15)");
                resolve(`rgb(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)})`);
            } catch(e) { resolve("rgba(0,210,255,0.15)"); }
        };
        img.onerror = () => resolve("rgba(0,210,255,0.15)");
        img.src = src;
    });
}

async function aplicarGradiente(card, escudo1, escudo2) {
    const [cor1, cor2] = await Promise.all([
        getDominantColor(escudo1),
        getDominantColor(escudo2)
    ]);
    const grad = document.createElement("div");
    grad.className = "card-gradient";
    grad.style.setProperty("--cor1", cor1);
    grad.style.setProperty("--cor2", cor2);
    card.prepend(grad);
}

function formatarTempo(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function iniciarContador(el, gameTime) {
    function tick() {
        const diff = gameTime - new Date();
        if (diff <= 0) {
            el.textContent = "00:00:00";
            location.reload();
            return;
        }
        el.textContent = formatarTempo(diff);
        requestAnimationFrame(tick);
    }
    tick();
}

function centroDaPartida(j, s) {
    if (s.status === "live") {
        return {
            badge: `<div class="badge-status ao-vivo">● AO VIVO</div>`,
            action: `<button class="btn-assistir" onclick="irParaPlayer('${j.link1}', '${j.link2}')">▶ ASSISTIR AGORA</button>`
        };
    }

    if (s.status === "finalizado") {
        return {
            badge: `<div class="badge-status">FIM DE JOGO</div>`,
            action: `<button class="btn-assistir" disabled style="opacity:0.45;cursor:not-allowed">⊘ ENCERRADO</button>`
        };
    }

    if (s.status === "hoje") {
        return {
            badge: `<div class="badge-status hoje-badge">HOJE • ${s.horario}</div>`,
            action: `
                <div class="comeca-em">COMEÇA EM</div>
                <div class="countdown" id="cd-${j.data}-${j.horario.replace(':','')}">00:00:00</div>
                <button class="btn-assistir" disabled style="opacity:0.45;cursor:not-allowed">⏱ AGUARDE</button>`
        };
    }

    return {
        badge: `<div class="badge-status">${s.dataFormatada}</div>`,
        action: `
            <div class="horario-futuro">ÀS ${s.horario}</div>
            <button class="btn-assistir" disabled style="opacity:0.45;cursor:not-allowed">⏱ AGUARDE</button>`
    };
}

function criarCard(j) {
    const s    = checkStatus(j);
    const card = document.createElement("div");
    card.className = `match-card ${s.status === "live" ? "card-ao-vivo" : ""}`;
    card.dataset.data = j.data;

    const { badge, action } = centroDaPartida(j, s);

    card.innerHTML = `
        <div class="scanlines"></div>
        <div class="bg-logo-container">
            <img src="${j.escudo1}" class="bg-logo left">
            <img src="${j.escudo2}" class="bg-logo right">
        </div>

        <div class="card-header">
            ${badge}
            <span class="campeonato-header">${j.campeonato}</span>
            <button class="btn-share" title="Compartilhar" onclick="compartilharJogo('${j.time1}','${j.time2}','${j.data}','${j.horario}')">🔗</button>
        </div>

        <div class="card-body">
            <div class="team"><img src="${j.escudo1}" alt="${j.time1}"></div>
            <div class="info-central">
                <div class="placar-final"><span class="vs">VS</span></div>
            </div>
            <div class="team"><img src="${j.escudo2}" alt="${j.time2}"></div>
        </div>

        <div class="card-foot">
            <div class="card-teams-names">
                <span class="team-name">${j.time1}</span>
                <span class="sep">×</span>
                <span class="team-name">${j.time2}</span>
            </div>
            ${action}
        </div>
    `;

    if (s.status === "hoje") {
        const id = `cd-${j.data}-${j.horario.replace(':','')}`;
        requestAnimationFrame(() => {
            const el = document.getElementById(id);
            if (el) iniciarContador(el, s.gameTime);
        });
    }

    aplicarGradiente(card, j.escudo1, j.escudo2);
    return card;
}

function renderizarJogos() {
    const list = document.getElementById("lista-jogos");
    if (!list) return;
    list.innerHTML = "";
    JOGOS.forEach(j => list.appendChild(criarCard(j)));
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarJogos();
    iniciarNotificacoes();
    carregarTema();
});

/* ============================================================
   TEMA CLARO / ESCURO
   ============================================================ */
function toggleTheme() {
    const claro = document.body.classList.toggle("tema-claro");
    document.getElementById("themeBtn").textContent = claro ? "☀️" : "🌙";
    localStorage.setItem("tema", claro ? "claro" : "escuro");
}

function carregarTema() {
    const tema = localStorage.getItem("tema");
    if (tema === "claro") {
        document.body.classList.add("tema-claro");
        document.getElementById("themeBtn").textContent = "☀️";
    }
}

/* ============================================================
   NOTIFICAÇÃO DE JOGO
   ============================================================ */
function fecharNotif() {
    document.getElementById("notif").classList.remove("show");
}

function iniciarNotificacoes() {
    JOGOS.forEach(j => {
        const gameTime = new Date(`${j.data}T${j.horario}:00`);
        const agora    = new Date();
        const diff     = gameTime - agora;

        if (diff > 0 && diff <= 2 * 60 * 1000) {
            mostrarNotif(j);
        } else if (diff <= 0 && diff >= -5 * 60 * 1000) {
            mostrarNotif(j, true);
        } else if (diff > 0) {
            setTimeout(() => mostrarNotif(j), diff - 60 * 1000);
        }
    });
}

function mostrarNotif(j, aoVivo = false) {
    const notif = document.getElementById("notif");
    document.getElementById("notif-title").textContent = aoVivo
        ? `🔴 ${j.time1} x ${j.time2} AO VIVO!`
        : `⏱ ${j.time1} x ${j.time2}`;
    document.getElementById("notif-sub").textContent = aoVivo
        ? "Clique em ASSISTIR AGORA no card"
        : `Começa em instantes — ${j.campeonato}`;
    notif.classList.add("show");
    setTimeout(fecharNotif, 8000);
}

/* ============================================================
   COMPARTILHAR JOGO
   ============================================================ */
function compartilharJogo(time1, time2, data, horario) {
    const url = `${window.location.origin}${window.location.pathname}?jogo=${encodeURIComponent(time1 + ' x ' + time2)}`;
    navigator.clipboard.writeText(url).then(() => {
        const toast = document.getElementById("share-toast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }).catch(() => {
        prompt("Copie o link:", url);
    });
}
