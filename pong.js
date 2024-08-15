// Canvas und Kontext initialisieren
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Ball Initialisierung
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
};

// Spieler Initialisierung
const user = {
    x: 0, // Linke Seite des Canvas
    y: (canvas.height - 100) / 2, // Mitte des Canvas in der Höhe
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// Computer Initialisierung
const com = {
    x: canvas.width - 10, // Rechte Seite des Canvas
    y: (canvas.height - 100) / 2, // Mitte des Canvas in der Höhe
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// Netz Initialisierung
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "WHITE"
};

// Zeichne das Netz
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Zeichne Rechteck (Spieler, Computer und Netz)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Zeichne Kreis (Ball)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Zeichne Text (Punktestand)
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px Arial";
    ctx.fillText(text, x, y);
}

// Reset Ball Position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 5;
}

// Kollisionserkennung
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Update Ball Position
function update() {
    // Punktestand aktualisieren
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    // Ballgeschwindigkeit aktualisieren
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball an den Wänden abprallen lassen
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Ballkollision mit Spielern
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.3;
    }

    // Computer Paddle Bewegung
    com.y += ((ball.y - (com.y + com.height / 2)) * 0.1);
}

// Render-Funktion
function render() {
    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichne das Netz
    drawNet();

    // Zeichne den Ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Zeichne die Spieler und den Computer
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Zeichne den Punktestand
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
}

// Spielschleife
function game() {
    update();
    render();
}

// Steuerung des Spieler-Paddles
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// Spiel alle 50ms aktualisieren
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
