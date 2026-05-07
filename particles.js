const canvas = document.createElement("canvas");
canvas.id = "particles-canvas";
canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
`;
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const COLORS = ["#00d2ff", "#9d00ff", "#ffffff", "#00aacc"];

class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
        this.x      = Math.random() * canvas.width;
        this.y      = init ? Math.random() * canvas.height : -20;
        this.r      = Math.random() * 4 + 1.5;
        this.speed  = Math.random() * 1.2 + 0.3;
        this.dx     = (Math.random() - 0.5) * 0.5;
        this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha  = Math.random() * 0.5 + 0.15;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.04 + 0.01;

        /* tipo: circle, diamond, cross */
        const t = Math.random();
        this.type = t < 0.6 ? "circle" : t < 0.85 ? "diamond" : "cross";

        /* rotação para diamond/cross */
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
    }

    update() {
        this.y     += this.speed;
        this.x     += this.dx;
        this.twinkle += this.twinkleSpeed;
        this.angle += this.rotSpeed;

        if (this.y > canvas.height + 20) this.reset();
    }

    draw() {
        const pulse = Math.sin(this.twinkle) * 0.2;
        const a     = Math.max(0, Math.min(1, this.alpha + pulse));

        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle   = this.color;
        ctx.strokeStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.type === "circle") {
            /* bola com brilho neon */
            const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r);
            grd.addColorStop(0, this.color);
            grd.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(0, 0, this.r, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            /* halo externo suave */
            ctx.beginPath();
            ctx.arc(0, 0, this.r * 2.2, 0, Math.PI * 2);
            ctx.globalAlpha = a * 0.12;
            ctx.fill();

        } else if (this.type === "diamond") {
            const s = this.r * 1.6;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.6, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.6, 0);
            ctx.closePath();
            ctx.fill();

        } else {
            /* cruz / estrela */
            const s = this.r * 1.4;
            ctx.lineWidth = this.r * 0.5;
            ctx.lineCap   = "round";
            ctx.beginPath();
            ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
            ctx.moveTo(0, -s); ctx.lineTo(0, s);
            ctx.stroke();
        }

        ctx.restore();
    }
}

/* Trilha de luz que cai rápido */
class Streak {
    constructor() { this.reset(true); }

    reset(init = false) {
        this.x     = Math.random() * canvas.width;
        this.y     = init ? Math.random() * canvas.height : -60;
        this.len   = Math.random() * 60 + 30;
        this.speed = Math.random() * 4 + 3;
        this.color = Math.random() < 0.7 ? "#00d2ff" : "#9d00ff";
        this.alpha = Math.random() * 0.2 + 0.05;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height + this.len) this.reset();
    }

    draw() {
        const grd = ctx.createLinearGradient(this.x, this.y - this.len, this.x, this.y);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(1, this.color);

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = grd;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.len);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.restore();
    }
}

const PARTICLE_COUNT = 80;
const STREAK_COUNT   = 18;

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
const streaks    = Array.from({ length: STREAK_COUNT },   () => new Streak());

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    streaks.forEach(s  => { s.update(); s.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
}

loop();