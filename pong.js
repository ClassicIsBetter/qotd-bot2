const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const pongGames = new Map();

function render(game) {

    const width = 7;
    const height = 5;

    let grid = [];

    for (let y = 0; y < height; y++) {

        let row = "";

        for (let x = 0; x < width; x++) {

            if (x === 0 && y === game.player)
                row += "🟦";

            else if (x === width - 1 && y === game.bot)
                row += "🟥";

            else if (x === game.ball.x && y === game.ball.y)
                row += "⚪";

            else
                row += "⬛";
        }

        grid.push(row);
    }

    return grid.join("\n");
}

function buttons() {

    return [
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("pong_up")
                    .setLabel("⬆️")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("pong_down")
                    .setLabel("⬇️")
                    .setStyle(ButtonStyle.Primary)
            )
    ];
}

function moveBall(game) {

    game.ball.x += game.ball.dx;
    game.ball.y += game.ball.dy;

    // top/bottom bounce
    if (game.ball.y <= 0 || game.ball.y >= 4) {
        game.ball.dy *= -1;
    }

    // player paddle
    if (
        game.ball.x === 1 &&
        game.ball.y === game.player
    ) {
        game.ball.dx = 1;
    }

    // bot paddle
    if (
        game.ball.x === 5 &&
        game.ball.y === game.bot
    ) {
        game.ball.dx = -1;
    }

    // score
    if (game.ball.x < 0) {
        game.botScore++;
        resetBall(game);
    }

    if (game.ball.x > 6) {
        game.playerScore++;
        resetBall(game);
    }

    // bot AI
    if (game.ball.y > game.bot && game.bot < 4)
        game.bot++;

    if (game.ball.y < game.bot && game.bot > 0)
        game.bot--;
}

function resetBall(game) {

    game.ball = {
        x: 3,
        y: 2,
        dx: Math.random() < 0.5 ? -1 : 1,
        dy: Math.random() < 0.5 ? -1 : 1
    };
}

module.exports = {

    pongGames,

    createGame(userId) {

        return {

            userId,

            player: 2,
            bot: 2,

            playerScore: 0,
            botScore: 0,

            ball: {
                x: 3,
                y: 2,
                dx: -1,
                dy: 1
            }
        };
    },

    render,
    buttons,
    moveBall
};