const dotenv = require('dotenv').config();
const math = require("mathjs");
const QRCode = require("qrcode");
const { translate } = require("@vitalets/google-translate-api");
console.log("Dotenv loaded:", dotenv.parsed ? "Success!" : "Failed to read .env file");
const pong = require("./pong");

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// =====================
// ENV
// =====================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const INPUT_CHANNEL_ID = process.env.INPUT_CHANNEL_ID;
const OUTPUT_CHANNEL_ID = process.env.OUTPUT_CHANNEL_ID;
const REVIEW_CHANNEL_ID = process.env.REVIEW_CHANNEL_ID;

// =====================
// OWNER
// =====================
const OWNER_ID = process.env.OWNER_ID;

// =====================
// ROLE PING
// =====================
const QOTD_ROLE_ID = "1479019281126785096";

// =====================
// PRESET QOTDS
// =====================
const presetQOTDs = [

`"what was the last thing you ate"`,

`"what's your favourite season?"
​
🌺 | spring
☀️ | summer
🍂 | autumn
❄️ | winter`,

`"whats your favorite Minecraft block/item"`,

`"what is your favourite meme?"`,

`"whats your most used emoji & sticker in discord (first in frequently used)"`,

`"Make a story in the thread"`,

`"cats or dogs?"
🐈 | Cats
🐕 | Dogs`,

`"what game have you been playing the most lately?"`,

`"what's your dream job?"`,

`"what's the weirdest food combo you've tried?"`,

`"what's your favourite roblox game?"`,

`"what was your first ever video game?"`,

`"what's your favourite snack?"`,

`"what's your most listened to song right now?"`,

`"what's the funniest thing that's happened to you recently?"`,

`"show your desktop/home screen"`,

`"what's your favourite movie or tv show?"`,

`"if you could instantly learn one skill what would it be?"`,

`"what's your favourite app on your phone?"`,

`"night owl or early bird?"
🌙 | Night owl
🌅 | Early bird`,

`"what's your favourite fast food place?"`,

`"what's one game you always come back to?"`,

`"what's your favourite animal?"`,

`"pineapple on pizza?"
🍍 | yes
🚫 | no`,

`"what was the last thing you searched on google?"`,

`"what superpower would you want?"`,

`"post a random image from your gallery"`,

`"what's your favourite holiday?"
🎃 | Halloween
🎄 | Christmas
🐣 | Easter
🎆 | New Years`,

`"what's your favourite drink?"`,

`"console, pc, or mobile?"
🖥️ | PC
🎮 | Console
📱 | Mobile`,

`"what's your favourite discord server emoji?(send an image if you dont have nitro)"`,

`"if animals could talk, which would be the rudest?"`,

`"what colour do you use the most in your builds/art?"`,

`"what's your comfort game?"`,

`"what's your favourite youtuber?"`,

`"what's the best smell ever?"`,

`"what's your least favourite chore?"`,

`"what was your favourite show as a kid?"`,

`"what's your favourite thing to do when bored?"`,

`"what's the oldest device you still use?"`,

`"what's a game everyone likes but you dont?"`,

`"what's your favourite thing about discord?"`,

];

const eightBallResponses = [

  "Yes.",
  "No.",
  "Probably.",
  "Maybe.",
  "Definitely.",
  "Absolutely not.",
  "Ask again later.",
  "Most likely.",
  "Very doubtful.",
  "Without a doubt.",
  "Signs point to yes.",
  "I don't think so."
];

// =====================
// SIMPLE COMMANDS
// =====================
const simpleCommands = {

  ping: {
    message: "Pong!",
    description: "check if the bot is alive"
  },

  help: {
    embed: true,
    title: "List Of Commands",
    color: 0xA9A9A9,

    message:
`
**-----QOTD-----**
/suggestqotd
Suggest a QOTD

/qotdqueue
View your queued QOTDs + statuses (Currently down)

/sendqotd
Force send oldest QOTD (Owner only)

/forceqotd
Force send a specific queued QOTD (Owner only)

**-----Games/Fun-----**
/snake
Play snake

/askai
Ask ChatGPT 3.5 Turbo anything(has proper chat memory, resets after 20 messages)

**-----Economy/Coins-----**

/work
Get a random about of coins

/daily
Claim daily coins(24H after last claimed, not actually daily)

/leaderboard
View balance leaderboard


**-----Other-----**
/help
Shows this command list

/ping
Check if the bot is alive
`,

    description: "List all commands"
  }
};

// =====================
// STATE
// =====================
//let qotdNumber = 29;
const axios = require("axios");
//const { QuickDB } = require("quick.db");
//const db = new QuickDB();
const { exec } = require("child_process");
//const fs = require("fs");

// =====================
// SNAKE GAMES
// =====================
const snakeGames = new Map();
const aiConversations = new Map();
const mineGames = new Map();
const snakeLogMessages = new Map();
const tttGames = new Map();
const pongGames = new Map();

console.log("Bot starting...");

const MINE_EMOJIS = {

  grass: "<:Mine_grass:1507344590057902187>",
  dirt: "<:Mine_dirt:1507344656781021285>",
  stone: "<:Mine_stone:1507345387579772989>",
  air: "<:Mine_air:1507344935836455093>",
  player: "🐈"
};

// =====================
// CLIENT
// =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

//status
//status & server list on startup
client.once('ready', () => {
    // 1. Set bot activity status
    client.user.setPresence({
        activities: [
            {
                name: 'very cool test, wow',
                type: 4
            }
        ],
        status: 'online'
    });

    // 2. Fetch and print out the connected server list
    console.log("\n=================================");
    console.log(`🤖 Bot is online as: ${client.user.tag}`);
    console.log(`📡 Connected to ${client.guilds.cache.size} server(s):`);
    console.log("=================================");
    
    client.guilds.cache.forEach(guild => {
        console.log(`🏠 Name: "${guild.name}" | 👥 Members: ${guild.memberCount} | 🆔 ID: ${guild.id}`);
    });
    
    console.log("=================================\n");
});

console.log("tried to set status");



// soup base :P
const ws = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false
    },
    realtime: {
      transport: ws
    }
  }
);

client.once("ready", () => {

    setInterval(
        checkReminders,
        30000
    );

});

async function LogChannel(message, interaction = null, type = "INFO") {
  try {
    if (!process.env.LOG_CHANNEL_ID) return;

    const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (!channel) return;

    const time = new Date().toLocaleString();

    let userPart = "";
    let guildPart = "";

    if (interaction) {
      const user = interaction.user;
      const guild = interaction.guild;

      userPart = `👤 ${user.tag} (${user.id})`;

      if (guild) {
        guildPart = ` | 🏠 ${guild.name} (${guild.id})`;
      }
    }

    await channel.send(
      `🧾 **[${type}] ${time}**\n` +
      `${userPart}${guildPart}\n` +
      `${message}`
    );

  } catch (err) {
    console.log("LogChannel error:", err);
  }
}


function createMineWorld() {

  const world = [];

  for (let y = 0; y < 6; y++) {

    let row = [];

    for (let x = 0; x < 6; x++) {

      // top grass
      if (y === 4)
        row.push("grass");

      // dirt
      else if (y > 4 && y < 8)
        row.push("dirt");

      // stone
      else if (y >= 8)
        row.push("stone");

      // sky
      else
        row.push("air");
    }

    world.push(row);
  }

  return world;
}

function tttButtons(board, gameId, disabled = false) {
  const rows = [];

  for (let y = 0; y < 3; y++) {
    const row = new ActionRowBuilder();

    for (let x = 0; x < 3; x++) {
      const val = board[y][x];

      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`ttt_${gameId}_${y}_${x}`)
          .setLabel(val)
          .setStyle(
            val === "❌" ? ButtonStyle.Danger :
            val === "⭕" ? ButtonStyle.Success :
            ButtonStyle.Secondary
          )
          .setDisabled(disabled || val !== "⬜")
      );
    }

    rows.push(row);
  }

  return rows;
}

function renderMine(game) {

  let output = "";

  for (let y = 0; y < 6; y++) {

    let row = "";

    for (let x = 0; x < 6; x++) {

      // player
      if (
        x === game.x &&
        y === game.y
      ) {

        row += MINE_EMOJIS.player;
      }

      else {

        const block =
          game.world[y][x];

        row +=
          MINE_EMOJIS[block];
      }
    }

    output += row + "\n";
  }

  return output;
}

function rgbToEmoji(r, g, b) {

  // black
  if (r < 35 && g < 35 && b < 35)
    return "⬛";

  // white
  if (r > 220 && g > 220 && b > 220)
    return "⬜";

  // gray
  if (
    Math.abs(r - g) < 15 &&
    Math.abs(g - b) < 15
  ) {

    if (r > 170)
      return "⬜";

    if (r > 80)
      return "⬜";

    return "⬛";
  }

  // RED
  if (
    r > g + 40 &&
    r > b + 40
  ) {

    // orange
    if (
      g > 100 &&
      b < 80
    ) {
      return "🟧";
    }

    // pink
    if (
      b > 120
    ) {
      return "🟪";
    }

    return "🟥";
  }

  // GREEN
  if (
    g > r + 30 &&
    g > b + 30
  ) {

    return "🟩";
  }

  // BLUE
  if (
    b > r + 30 &&
    b > g + 30
  ) {

    // cyan
    if (g > 120)
      return "🟦";

    return "🟦";
  }

  // yellow
  if (
    r > 170 &&
    g > 170 &&
    b < 120
  ) {

    return "🟨";
  }

  // purple
  if (
    r > 120 &&
    b > 120 &&
    g < 100
  ) {

    return "🟪";
  }

  // ACTUAL brown
  if (
    r > 90 &&
    r < 170 &&
    g > 40 &&
    g < 110 &&
    b < 70
  ) {

    return "🟫";
  }

  // fallback:
  // choose MOST dominant colour
  if (r >= g && r >= b)
    return "🟥";

  if (g >= r && g >= b)
    return "🟩";

  return "🟦";
}



const shopItems = [

  {
    name: "test item",
    price: 150,
    emoji: "🐈"
  },

  {
    name: "very expensive item",
    price: 100000,
    emoji: "💸"
  },

];

// list of servers
//console.log(bot.guilds.cache.map(guild => guild.name));


// =====================
// DATABASE
// =====================

const fs = require("fs");

let database = {
  users: {}
};

if (
  fs.existsSync("./database.json")
) {

  database = JSON.parse(
    fs.readFileSync(
      "./database.json",
      "utf8"
    )
  );
}

function saveDatabase() {

  fs.writeFileSync(
    "./database.json",
    JSON.stringify(
      database,
      null,
      2
    )
  );
}

// get qotd number
async function getQotdNumber(serverId) {

  const { data } = await supabase
    .from("qotd_data")
    .select("*")
    .eq("server_id", serverId)
    .maybeSingle();

  // default if server not setup yet
  if (!data) {

    await supabase
      .from("qotd_data")
      .upsert({
        server_id: serverId,
        qotd_number: 1
      });

    return 1;
  }

  return data.qotd_number || 1;
}

// save qotd number
async function setQotdNumber(
  serverId,
  number
) {

  await supabase
    .from("qotd_data")
    .upsert({
      server_id: serverId,
      qotd_number: number
    });
}
// =====================
// COMMANDS
// =====================
const commands = [

  ...Object.keys(simpleCommands).map(cmd =>
    new SlashCommandBuilder()
      .setName(cmd)
      .setDescription(simpleCommands[cmd].description)
      .toJSON()
  ),


  // command array
  new SlashCommandBuilder()
    .setName('suggestqotd')
    .setDescription('Suggest a QOTD')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('sendqotd')
    .setDescription('Force send oldest QOTD')
    .toJSON(),

  new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the richest users (balance)')
  .toJSON(),

  new SlashCommandBuilder()
  .setName("pong")
  .setDescription("Play Pong")
  .toJSON(),

  //slahcommandpoint

  new SlashCommandBuilder()
  .setName("countdown")
  .setDescription("Creates a countdown using Discord timestamps")
  .addStringOption(option =>
    option
      .setName("until")
      .setDescription("Date (DD/MM/YYYY or DD/MM/YYYY HH:MM)")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("title")
      .setDescription("Optional title")
      .setRequired(false)
  )
  .toJSON(),

  new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate text")
  .addStringOption(option =>
    option
      .setName("text")
      .setDescription("Text to translate")
      .setRequired(true)
  )
.addStringOption(option =>
  option
    .setName("language")
    .setDescription("Language to translate to")
    .setRequired(true)
    .addChoices(
      { name: "🇬🇧 English", value: "en" },
      { name: "🇪🇸 Spanish", value: "es" },
      { name: "🇫🇷 French", value: "fr" },
      { name: "🇩🇪 German", value: "de" },
      { name: "🇯🇵 Japanese", value: "ja" },
      { name: "🇰🇷 Korean", value: "ko" },
      { name: "🇨🇳 Chinese (Simplified)", value: "zh-cn" },
      { name: "🇮🇹 Italian", value: "it" },
      { name: "🇵🇹 Portuguese", value: "pt" },
      { name: "🇷🇺 Russian", value: "ru" }
    )
)
  .toJSON(),

  new SlashCommandBuilder()
  .setName("qr")
  .setDescription("Generate a QR code")
  .addStringOption(option =>
    option
      .setName("text")
      .setDescription("Text or URL")
      .setRequired(true)
  )
  .toJSON(),

  new SlashCommandBuilder()
  .setName("maths")
  .setDescription("Solve a maths equation")
  .addStringOption(option =>
    option
      .setName("equation")
      .setDescription("Example: (2+5)*10")
      .setRequired(true)
  )
  .toJSON(),

  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Set yourself a reminder")
    .addStringOption(option =>
        option
            .setName("time")
            .setDescription("10m, 2h, 1d or YYYY-MM-DD HH:MM")
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName("reminder")
            .setDescription("What should I remind you about?")
            .setRequired(true)
    )
    .toJSON(),

  new SlashCommandBuilder()
  .setName("python")
  .setDescription("Run Python code")
  .addStringOption(option =>
    option
      .setName("code")
      .setDescription("Python code")
      .setRequired(true)
  )
  .toJSON(),

  new SlashCommandBuilder()
  .setName("tictactoe")
  .setDescription("Play tic tac toe")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("Opponent")
      .setRequired(true)
  )
  .toJSON(),

  new SlashCommandBuilder()
    .setName('forceqotd')
    .setDescription('Force send a specific queued QOTD')
    .addIntegerOption(option =>
      option
        .setName('number')
        .setDescription('Queue number to send')
        .setRequired(true)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName('qotdqueue')
    .setDescription('View your queued QOTDs')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('snake')
    .setDescription('Play snake')
    .toJSON(),

  new SlashCommandBuilder()
  .setName('work')
  .setDescription('Work for coins')
  .toJSON(),

  

  new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Shows info about the server')
  .toJSON(),

  new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Shows user info')
  .toJSON(),


  new SlashCommandBuilder()
  .setName('minecraft')
  .setDescription('Start a minecraft world')
  .toJSON(),

  new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim daily coins')
  .toJSON(),

  new SlashCommandBuilder()
  .setName('shop')
  .setDescription('View the coin shop')
  .toJSON(),

  new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your coin balance')
  .toJSON(),

new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory')
  .toJSON(),

  new SlashCommandBuilder()
  .setName('setcoins')
  .setDescription('Set a users coins')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('User')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('amount')
      .setDescription('Amount of coins')
      .setRequired(true)
  )
  .toJSON(),

new SlashCommandBuilder()
  .setName('minemove')
  .setDescription('Move in minecraft')
  .addStringOption(option =>
    option
      .setName('direction')
      .setDescription('Direction')
      .setRequired(true)
      .addChoices(
        { name: 'Up', value: 'up' },
        { name: 'Down', value: 'down' },
        { name: 'Left', value: 'left' },
        { name: 'Right', value: 'right' }
      )
  )
  .toJSON(),


  new SlashCommandBuilder()
  .setName('betterbot')
  .setDescription('Compare The Silly Bot and MangoBot')
  .toJSON(),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Set bot status')
    .addStringOption(option =>
     option
      .setName('text')
      .setDescription('Status text')
      .setRequired(true)
  )
  .toJSON(),
  
  new SlashCommandBuilder()
  .setName('askai')
  .setDescription('Ask the AI something')
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('What to ask')
      .setRequired(true)
  )
  .toJSON(),

  new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask the 8ball something')
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('Your question')
      .setRequired(true)
  )
  .toJSON(),

    new SlashCommandBuilder()
  .setName('dice')
  .setDescription('Roll a dice')
  .addIntegerOption(option =>
    option
      .setName('max')
      .setDescription('Maximum number')
      .setRequired(true)
  )
  .toJSON(),
      
];

// =====================
// REGISTER COMMANDS
// =====================
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {

  try {

    console.log("Registering commands...");

    await rest.put(
  Routes.applicationCommands(CLIENT_ID),
  { body: commands }
);

    console.log("Commands ready.");

  } catch (err) {
    console.error(err);
  }
})();

// =====================
// EXTRACT EMOJIS
// =====================
function extractEmojis(lines) {

  return lines
    .filter(line => line.includes("|"))
    .map(line =>
      line.split("|")[0].trim()
    );
}


//reminder
function parseReminderTime(input) {

    input = input.trim().toLowerCase();

    const now = new Date();

    const match = input.match(/^(\d+)([smhd])$/);

    if (match) {

        const amount = parseInt(match[1]);

        const unit = match[2];

        let ms = 0;

        if (unit === "s") ms = amount * 1000;
        if (unit === "m") ms = amount * 60000;
        if (unit === "h") ms = amount * 3600000;
        if (unit === "d") ms = amount * 86400000;

        return new Date(now.getTime() + ms);
    }

    const date = new Date(input);

    if (!isNaN(date.getTime()))
        return date;

    return null;
}

// =====================
// SNAKE RENDER
// =====================
function renderSnake(game) {

  const size = 8;

  let grid = [];

  for (let y = 0; y < size; y++) {

    let row = [];

    for (let x = 0; x < size; x++) {

      // apple
      if (
        x === game.apple.x &&
        y === game.apple.y
      ) {

        row.push("🍎");
        continue;
      }

      // snake
      const snakePart =
        game.snake.find(
          s =>
            s.x === x &&
            s.y === y
        );

      if (snakePart) {

        // head
        if (
          snakePart.x === game.snake[0].x &&
          snakePart.y === game.snake[0].y
        ) {

          if (game.direction === "up")
            row.push("⬆️");

          else if (game.direction === "down")
            row.push("⬇️");

          else if (game.direction === "left")
            row.push("⬅️");

          else
            row.push("➡️");

        } else {

          // body
          row.push("🟩");
        }

        continue;
      }

      // empty
      row.push("⬛");
    }

    grid.push(row.join(""));
  }

  return grid.join("\n");
}
// =====================
// MOVE SNAKE
// =====================
function moveSnake(game) {

  const head = {
    ...game.snake[0]
  };

  if (game.direction === "up")
    head.y--;

  if (game.direction === "down")
    head.y++;

  if (game.direction === "left")
    head.x--;

  if (game.direction === "right")
    head.x++;

  // wall collision
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= 8 ||
    head.y >= 8
  ) {

    game.over = true;
    return;
  }

  // self collision
  if (
    game.snake.some(
      s =>
        s.x === head.x &&
        s.y === head.y
    )
  ) {

    game.over = true;
    return;
  }

  game.snake.unshift(head);

  // apple
  if (
    head.x === game.apple.x &&
    head.y === game.apple.y
  ) {

    let valid = false;

    while (!valid) {

      const newApple = {
        x: Math.floor(
          Math.random() * 8
        ),
        y: Math.floor(
          Math.random() * 8
        )
      };

      if (
        !game.snake.some(
          s =>
            s.x === newApple.x &&
            s.y === newApple.y
        )
      ) {

        game.apple = newApple;
        valid = true;
      }
    }

  } else {

    game.snake.pop();
  }
}

// =====================
// SNAKE BUTTONS
// =====================
function snakeButtons() {

  return [

    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId("snake_blank")
          .setLabel("⬛")
          .setStyle(
            ButtonStyle.Secondary
          )
          .setDisabled(true),

        new ButtonBuilder()
          .setCustomId("snake_up")
          .setLabel("⬆️")
          .setStyle(
            ButtonStyle.Primary
          )
      ),

    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId("snake_left")
          .setLabel("⬅️")
          .setStyle(
            ButtonStyle.Primary
          ),

        new ButtonBuilder()
          .setCustomId("snake_down")
          .setLabel("⬇️")
          .setStyle(
            ButtonStyle.Primary
          ),

        new ButtonBuilder()
          .setCustomId("snake_right")
          .setLabel("➡️")
          .setStyle(
            ButtonStyle.Primary
          )
      )
  ];
}



// =====================
// POST QOTD
// =====================
async function postQOTD(content) {

  const outputChannel =
    await client.channels.fetch(
      OUTPUT_CHANNEL_ID
    );

  // get current qotd number
  const qotdNumber =
    await getQotdNumber(
      outputChannel.guild.id
    );

  const lines = content
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const reactions =
    extractEmojis(lines);

  const embed = new EmbedBuilder()
    .setTitle(`QOTD #${qotdNumber}`)
    .setDescription(content)
    .setColor(0xffcc00);

  const sent = await outputChannel.send({
    content: `<@&${QOTD_ROLE_ID}>`,
    embeds: [embed]
  });

  // reactions
  for (const reaction of reactions) {

    await sent.react(reaction)
      .catch(() => {});
  }

  // thread
  await sent.startThread({
    name:
      `QOTD #${qotdNumber} discussion`,
    autoArchiveDuration: 1440
  }).catch(() => {});

  // increase qotd number
  await setQotdNumber(
    outputChannel.guild.id,
    qotdNumber + 1
  );
}

function renderPong(game) {

  const width = 8;
  const height = 5;

  let output = "";

  for (let y = 0; y < height; y++) {

    let row = "";

    for (let x = 0; x < width; x++) {

      if (x === 0 && y === game.player)
        row += "🟦";

      else if (x === width - 1 && y === game.bot)
        row += "🟥";

      else if (
        x === game.ball.x &&
        y === game.ball.y
      )
        row += "⚪";

      else
        row += "⬛";
    }

    output += row + "\n";
  }

  return output;
}

function movePong(game) {

  // bot AI
  if (game.ball.y > game.bot && game.bot < 4)
    game.bot++;

  if (game.ball.y < game.bot && game.bot > 0)
    game.bot--;

  game.ball.x += game.ball.dx;
  game.ball.y += game.ball.dy;

  // bounce top/bottom
  if (game.ball.y <= 0 || game.ball.y >= 4)
    game.ball.dy *= -1;

  // player paddle
  if (
    game.ball.x === 1 &&
    game.ball.y === game.player
  ) {
    game.ball.dx = 1;
  }

  // bot paddle
  if (
    game.ball.x === 6 &&
    game.ball.y === game.bot
  ) {
    game.ball.dx = -1;
  }

  // player scores
  if (game.ball.x > 7) {

    game.playerScore++;

    game.ball = {
      x: 4,
      y: 2,
      dx: -1,
      dy: 1
    };
  }

  // bot scores
  if (game.ball.x < 0) {

    game.botScore++;

    game.ball = {
      x: 4,
      y: 2,
      dx: 1,
      dy: -1
    };
  }
}

function pongButtons() {

  return [

    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId("pong_up")
          .setLabel("⬆️")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("pong_move")
          .setLabel("🔄️")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("pong_down")
          .setLabel("⬇️")
          .setStyle(ButtonStyle.Primary)
      )
  ];
}



async function checkReminders() {

    const { data } = await supabase
        .from("reminders")
        .select("*")
        .eq("sent", false)
        .lte("remind_at", new Date().toISOString());

    if (!data) return;

    for (const reminder of data) {

        try {

            const user =
                await client.users.fetch(
                    reminder.user_id
                );

            await user.send(
                `⏰ Reminder:\n${reminder.reminder}`
            );

            await supabase
                .from("reminders")
                .update({
                    sent: true
                })
                .eq("id", reminder.id);

        } catch (err) {

            console.log(err);

        }
    }
}
// =====================
// SEND QOTD
// =====================
async function sendQOTD() {

  try {

    const inputChannel =
      await client.channels.fetch(
        INPUT_CHANNEL_ID
      );

    const messages =
      await inputChannel.messages.fetch({
        limit: 100
      });

    const sorted =
      [...messages.values()]
        .sort((a, b) =>
          a.createdTimestamp -
          b.createdTimestamp
        );

    if (sorted.length > 0) {

      const oldest =
        sorted[0];

      await postQOTD(
        oldest.content
      );

      await oldest.delete()
        .catch(() => {});

    } else {

      const randomPreset =
        presetQOTDs[
          Math.floor(
            Math.random() *
            presetQOTDs.length
          )
        ];

      await postQOTD(
        randomPreset
      );
    }

  } catch (err) {

    console.error(
      "QOTD error:",
      err
    );
  }
}

// =====================
// SCHEDULE
// =====================
function scheduleQOTD(hour, minute) {

  setInterval(() => {

    const now = new Date();

    const adelaide = new Date(
      now.toLocaleString(
        "en-US",
        {
          timeZone:
            "Australia/Adelaide"
        }
      )
    );

    if (
      adelaide.getHours() === hour &&
      adelaide.getMinutes() === minute
    ) {

      sendQOTD();
    }

  }, 60000);
}

// =====================
// READY
// =====================
client.once('ready', () => {

  console.log(
    `Logged in as ${client.user.tag}`
  );

  scheduleQOTD(16, 30);
});

// =====================
// INTERACTIONS
// =====================
client.on(
  'interactionCreate',
  async (interaction) => {


    const axios = require("axios");
    

    // =====================
    // MODAL SUBMIT
    // =====================
    if (interaction.isModalSubmit()) {

      if (
        interaction.customId ===
        'qotdModal'
      ) {

        const question =
          interaction.fields.getTextInputValue(
            'question'
          );

        const answers =
          interaction.fields.getTextInputValue(
            'answers'
          );

        const reviewChannel =
          await client.channels.fetch(
            REVIEW_CHANNEL_ID
          );

        const qotdContent =
`"${question}" suggested by <@${interaction.user.id}>
${answers}`;

        const embed =
          new EmbedBuilder()
            .setTitle(
              "New QOTD Suggestion"
            )
            .setDescription(
              qotdContent
            )
            .setColor(0xffff00)
            .setFooter({
              text:
                "Status: Pending"
            });

        const buttons =
          new ActionRowBuilder()
            .addComponents(

              new ButtonBuilder()
                .setCustomId(
                  "accept_qotd"
                )
                .setLabel(
                  "Accept"
                )
                .setStyle(
                  ButtonStyle.Success
                ),

              new ButtonBuilder()
                .setCustomId(
                  "decline_qotd"
                )
                .setLabel(
                  "Decline"
                )
                .setStyle(
                  ButtonStyle.Danger
                )
            );

        const reviewMessage =
          await reviewChannel.send({
            embeds: [embed],
            components: [buttons]
          });

        await reviewMessage.startThread({
          name:
            `Review: ${question.slice(0, 50)}`,
          autoArchiveDuration: 1440
        }).catch(() => {});

        return interaction.reply({
          content:
            "Your QOTD was submitted for review.",
          ephemeral: true
        });
      }

      return;
    }

    // =====================
// BUTTONS
// =====================
if (interaction.isButton()) {




  if (interaction.customId.startsWith("ttt_")) {

  const parts = interaction.customId.split("_");
  const gameId = parts[1];
  const y = parseInt(parts[2]);
  const x = parseInt(parts[3]);

  const game = tttGames.get(gameId);

  if (!game) {
    return interaction.reply({
      content: "Game expired.",
      ephemeral: true
    });
  }

  if (interaction.user.id !== game.turn) {
    return interaction.reply({
      content: "Not your turn.",
      ephemeral: true
    });
  }

  if (game.over) return;

  const symbol =
    game.players[0] === interaction.user.id ? "❌" : "⭕";

  if (game.board[y][x] !== "⬜") {
    return interaction.reply({
      content: "That spot is taken.",
      ephemeral: true
    });
  }

  game.board[y][x] = symbol;

  const b = game.board;

  const wins = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]],
  ];

  const checkWin = (s) =>
    wins.some(w =>
      w.every(([yy,xx]) => b[yy][xx] === s)
    );

  if (checkWin(symbol)) {

    game.over = true;

    return interaction.update({
      content: `🏆 <@${interaction.user.id}> wins!`,
      components: tttButtons(game.board, gameId, true)
    });
  }

  game.turn =
    game.players.find(p => p !== game.turn);

  return interaction.update({
    content: `Turn: <@${game.turn}>`,
    components: tttButtons(game.board, gameId)
  });
}

  // =====================
  // SNAKE BUTTONS
  // =====================
  if (
    !interaction.customId.startsWith(
      "snake_"
    )
  ) {

    // continue to qotd buttons

  } else {

    // blank button
    if (
      interaction.customId ===
      "snake_blank"
    ) {

      return interaction.deferUpdate();
    }

    const game =
      snakeGames.get(
        interaction.message.id
      );

    if (!game) {

      return interaction.reply({
        content:
          "Game expired.",
        ephemeral: true
      });
    }

    if (
      interaction.user.id !==
      game.userId
    ) {

      return interaction.reply({
        content:
          "This isn't your game.",
        ephemeral: true
      });
    }

    const direction =
      interaction.customId.replace(
        "snake_",
        ""
      );

    game.direction =
      direction;

    moveSnake(game);
    const logMsg = snakeLogMessages.get(interaction.message.id);

if (logMsg) {
  logMsg.edit(
    `🐍 **Snake Live Game**\n` +
    `Player: <@${game.userId}>\n` +
    `Score: ${game.snake.length - 1}\n\n` +
    `${renderSnake(game)}`
  );
}

    // game over
    if (game.over) {

      const logMsg = snakeLogMessages.get(interaction.message.id);

if (logMsg) {
  logMsg.edit(
    `💀 **Snake Game Ended**\n` +
    `Player: <@${game.userId}>\n` +
    `Final Score: ${game.snake.length - 1}\n\n` +
    `${renderSnake(game)}`
  );

  snakeLogMessages.delete(interaction.message.id);
}

      return interaction.update({
        content:
`# Game Over

Score: ${game.snake.length - 1}

${renderSnake(game)}`,
        components: []
      });
    }

    return interaction.update({
      content:
`# Snake

Score: ${game.snake.length - 1}

${renderSnake(game)}`,
      components:
        snakeButtons()
    });
  }


// pong
// =====================
// PONG BUTTONS
// =====================
if (
  interaction.customId.startsWith("pong_")
) {

  const game =
    pongGames.get(
      interaction.message.id
    );

  if (!game) {
    return interaction.reply({
      content: "Game expired.",
      ephemeral: true
    });
  }

  if (
    interaction.user.id !== game.userId
  ) {
    return interaction.reply({
      content: "This isn't your game.",
      ephemeral: true
    });
  }


  // move player up
  if (
    interaction.customId === "pong_up" &&
    game.player > 0
  ) {
    game.player--;
  }


  // move player down
  if (
    interaction.customId === "pong_down" &&
    game.player < 4
  ) {
    game.player++;
  }


  // middle button = advance game
  if (
    interaction.customId === "pong_move"
  ) {

    // AI + ball moves
    movePong(game);

  } else {

    // optional: still move the game after paddle movement
    movePong(game);

  }


  if (
    game.playerScore >= 5 ||
    game.botScore >= 5
  ) {

    pongGames.delete(
      interaction.message.id
    );

    return interaction.update({

      content:
`# 🏓 Pong

🏆 ${
game.playerScore > game.botScore
? "You Win!"
: "Bot Wins!"
}

Player: ${game.playerScore}
Bot: ${game.botScore}

${renderPong(game)}`,

      components: []

    });
  }


  return interaction.update({

    content:
`# 🏓 Pong

Player: ${game.playerScore}
Bot: ${game.botScore}

${renderPong(game)}`,

    components:
      pongButtons()

  });
}
// =====================
// SHOP BUTTONS
// =====================
if (
  interaction.customId.startsWith(
    "buy_"
  )
) {

  const itemIndex =
    parseInt(
      interaction.customId.replace(
        "buy_",
        ""
      )
    );

  const item =
    shopItems[itemIndex];

  if (!item) {

    return interaction.reply({
      content:
        "Item not found.",
      ephemeral: true
    });
  }

  const userId =
    interaction.user.id;

  const { data } =
    await supabase
      .from("coins")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();

  let coins =
    data?.coins || 0;

  // not enough money
  if (
    coins < item.price
  ) {

    return interaction.reply({
      content:
`❌ You need ${item.price} coins to buy ${item.name}.`,
      ephemeral: true
    });
  }

  // remove coins
  coins -= item.price;

  // save coins
  await supabase
    .from("coins")
    .upsert({
      user_id: userId,
      coins: coins
    });

  // save inventory item
  await supabase
    .from("inventory")
    .insert({
      user_id: userId,
      item_name: item.name
    });

  return interaction.reply({
    content:
`✅ You bought ${item.emoji} ${item.name} for ${item.price} coins!

💰 Remaining coins: ${coins}`,
    ephemeral: true
  });
}
  // =====================
  // QOTD BUTTONS
  // =====================
  if (
    interaction.user.id !==
    OWNER_ID
  ) {

    return interaction.reply({
      content:
        "No permission.",
      ephemeral: true
    });
  }

  const embed =
    interaction.message.embeds[0];

  if (!embed) return;

  const content =
    embed.description;

  const newEmbed =
    EmbedBuilder.from(embed);

  // =====================
  // ACCEPT
  // =====================
  if (
    interaction.customId ===
    "accept_qotd"
  ) {

    const inputChannel =
      await client.channels.fetch(
        INPUT_CHANNEL_ID
      );

    await inputChannel.send(
      content
    );

    newEmbed.setFooter({
      text:
        "Status: Accepted ✅"
    });

    await interaction.update({
      embeds: [newEmbed],
      components: []
    });

    return;
  }

  // =====================
  // DECLINE
  // =====================
  if (
    interaction.customId ===
    "decline_qotd"
  ) {

    newEmbed.setFooter({
      text:
        "Status: Declined ❌"
    });

    await interaction.update({
      embeds: [newEmbed],
      components: []
    });

    return;
  }
}
    // =====================
    // CHAT COMMANDS
    // =====================
    if (
      !interaction.isChatInputCommand()
    ) return;

    // simple commands
    if (
      simpleCommands[
        interaction.commandName
      ]
    ) {

      const cmd =
        simpleCommands[
          interaction.commandName
        ];

      if (cmd.embed) {

        const embed =
          new EmbedBuilder()
            .setTitle(
              cmd.title || "Command"
            )
            .setDescription(
              cmd.message
            )
            .setColor(
              cmd.color || 0xffffff
            );

        return interaction.reply({
          embeds: [embed]
        });
      }

      return interaction.reply(
        cmd.message
      );
    }

    // suggestqotd
    if (
      interaction.commandName ===
      'suggestqotd'
    ) {

      const modal =
        new ModalBuilder()
          .setCustomId(
            'qotdModal'
          )
          .setTitle(
            'Suggest a QOTD'
          );

      const question =
        new TextInputBuilder()
          .setCustomId(
            'question'
          )
          .setLabel(
            'Question'
          )
          .setStyle(
            TextInputStyle.Paragraph
          );

      const answers =
        new TextInputBuilder()
          .setCustomId(
            'answers'
          )
          .setLabel(
            'Answers (one per line: emoji | text)'
          )
          .setPlaceholder(
`🍕 | Pizza
🍔 | Burger
🌮 | Taco`
          )
          .setStyle(
            TextInputStyle.Paragraph
          );

      modal.addComponents(

        new ActionRowBuilder()
          .addComponents(
            question
          ),

        new ActionRowBuilder()
          .addComponents(
            answers
          )
      );

      return interaction.showModal(
        modal
      );
    }

  


    // snake
    if (
      interaction.commandName ===
      'snake'
    ) {

      const game = {

        userId:
          interaction.user.id,

        snake: [
          {
            x: 4,
            y: 4
          }
        ],

        apple: {
          x: 2,
          y: 2
        },

        direction: "right",

        over: false
      };

      await interaction.reply({
        content:
`# Snake

Score: 0

${renderSnake(game)}`,
        components:
          snakeButtons()
      });

      const msg =
        await interaction.fetchReply();

      snakeGames.set(
        msg.id,
        game
      );
      const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);

const logMsg = await logChannel.send(
  `🐍 **Snake Live Game Started**\n` +
  `Player: <@${interaction.user.id}>\n` +
  `Score: 0\n\n` +
  `${renderSnake(game)}`
);

snakeLogMessages.set(msg.id, logMsg);
      //checkpoint snake
    }

    // qotdqueue
    if (
      interaction.commandName ===
      'qotdqueue'
    ) {

      return interaction.reply({
        content:
          "qotd queue system currently down",
        ephemeral: true
      });
    }

    // forceqotd
    if (
      interaction.commandName ===
      'forceqotd'
    ) {

      if (
        interaction.user.id !==
        OWNER_ID
      ) {

        return interaction.reply({
          content:
            "No permission.",
          ephemeral: true
        });
      }

      const number =
        interaction.options.getInteger(
          'number'
        );

      const inputChannel =
        await client.channels.fetch(
          INPUT_CHANNEL_ID
        );

      const messages =
        await inputChannel.messages.fetch({
          limit: 100
        });

      const sorted =
        [...messages.values()]
          .sort((a, b) =>
            a.createdTimestamp -
            b.createdTimestamp
          );

      if (
        number < 1 ||
        number > sorted.length
      ) {

        return interaction.reply({
          content:
            `Invalid queue number. There are ${sorted.length} QOTDs queued.`,
          ephemeral: true
        });
      }

      const targetMessage =
        sorted[number - 1];

      await postQOTD(
        targetMessage.content
      );

      await targetMessage.delete()
        .catch(() => {});

      return interaction.reply({
        content:
          `Forced QOTD #${number} to send.`,
        ephemeral: true
      });
    }


// maths
if (
  interaction.commandName ===
  "maths"
) {

  const equation =
    interaction.options.getString(
      "equation"
    );

  try {

    const answer =
      math.evaluate(equation);

    const embed =
      new EmbedBuilder()
        .setTitle("🧮 Maths")
        .addFields(
          {
            name: "Equation",
            value: `\`${equation}\``
          },
          {
            name: "Answer",
            value: `\`${answer}\``
          }
        )
        .setColor(0x00b0f4);

    return interaction.reply({
      embeds: [embed]
    });

  } catch {

    return interaction.reply({
      content:
        "❌ Invalid equation.",
      ephemeral: true
    });

  }

}

// countdown
if (interaction.commandName === "countdown") {

    const input =
        interaction.options.getString("until");

    const title =
        interaction.options.getString("title") || "Countdown";

    // Match:
    // DD/MM/YYYY
    // DD/MM/YYYY HH:MM
    const match = input.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/
    );

    if (!match) {

        return interaction.reply({
            content: "❌ Invalid format.\nUse `DD/MM/YYYY` or `DD/MM/YYYY HH:MM`",
            ephemeral: true
        });

    }

    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const hour = Number(match[4] || 0);
    const minute = Number(match[5] || 0);

    const date = new Date(year, month, day, hour, minute);

    if (isNaN(date.getTime())) {

        return interaction.reply({
            content: "❌ Invalid date.",
            ephemeral: true
        });

    }

    const unix =
        Math.floor(date.getTime() / 1000);

    return interaction.reply({

        embeds: [

            new EmbedBuilder()
                .setTitle(`⏳ ${title}`)
                .setDescription(
`📅 **Date**
<t:${unix}:F>

⏳ **Time Remaining**
<t:${unix}:R>`
                )
                .setColor(0x00b0f4)

        ]

    });

}

// qr
if (
  interaction.commandName ===
  "qr"
) {

  const text =
    interaction.options.getString(
      "text"
    );

  try {

    const buffer =
      await QRCode.toBuffer(text);

    return interaction.reply({

      files: [
        {
          attachment: buffer,
          name: "qrcode.png"
        }
      ]

    });

  } catch {

    return interaction.reply({

      content:
        "❌ Failed to generate QR code.",

      ephemeral: true

    });

  }

}

//interactionmarker

// translate
if (
  interaction.commandName ===
  "translate"
) {

  const text =
    interaction.options.getString(
      "text"
    );

  const language =
    interaction.options.getString(
      "language"
    );

try {

    const result = await translate(text, {
        to: language
    });

    const translated = result.text;

    const embed = new EmbedBuilder()
        .setTitle("🌍 Translation")
        .addFields(
            {
                name: "Original",
                value: text
            },
            {
                name: "Translation",
                value: translated
            }
        );

    return interaction.reply({
        embeds: [embed]
    });

} catch (err) {

    console.error(err);

    return interaction.reply({
        content: `❌ ${err.message}`,
        ephemeral: true
    });

}

}

if (interaction.commandName === "remind") {

    const time =
        interaction.options.getString("time");

    const reminder =
        interaction.options.getString("reminder");

    const remindAt =
        parseReminderTime(time);

    if (!remindAt) {

        return interaction.reply({
            content:
                "Invalid time.\nExamples: `10m`, `2h`, `1d`, `2026-12-25 09:00`",
            ephemeral: true
        });
    }

    await supabase
        .from("reminders")
        .insert({

            user_id:
                interaction.user.id,

            reminder,

            remind_at:
                remindAt.toISOString()

        });

    return interaction.reply({

        content:
            `✅ Reminder set for <t:${Math.floor(remindAt.getTime()/1000)}:F>`,

        ephemeral: true

    });
}
        // dice
if (
  interaction.commandName ===
  'dice'
) {

  const max =
    interaction.options.getInteger(
      'max'
    );

  // stop weird numbers
  if (max < 1) {

    return interaction.reply({
      content:
        "Max number must be at least 1.",
      ephemeral: true
    });
  }

  const roll =
    Math.floor(
      Math.random() * max
    ) + 1;

  return interaction.reply({
    embeds: [

      new EmbedBuilder()
        .setTitle("Roll Dice")
        .addFields(
          {
            name: "Max Number",
            value: max.toString(),
            inline: true
          },
          {
            name: "You Rolled",
            value: roll.toString(),
            inline: true
          }
        )
        .setColor(0xffffff)
    ]
  });
}


    // minecraft
if (
  interaction.commandName ===
  'minecraft'
) {

  const game = {

    x: 5,
    y: 2,

    world:
      createMineWorld()
  };

  mineGames.set(
    interaction.user.id,
    game
  );

  return interaction.reply({
    content:
`# Minecraft

${renderMine(game)}`
  });
}

// minemove
if (
  interaction.commandName ===
  'minemove'
) {

  const direction =
    interaction.options.getString(
      'direction'
    );

  const game =
    mineGames.get(
      interaction.user.id
    );

  if (!game) {

    return interaction.reply({
      content:
        "Start a world first with /minecraft",
      ephemeral: true
    });
  }

  let newX = game.x;
  let newY = game.y;

  if (direction === "up")
    newY--;

  if (direction === "down")
    newY++;

  if (direction === "left")
    newX--;

  if (direction === "right")
    newX++;

  // bounds
  if (
    newX >= 0 &&
    newX < 10 &&
    newY >= 0 &&
    newY < 10
  ) {

    game.x = newX;
    game.y = newY;
  }

  return interaction.reply({
    content:
`# Minecraft

${renderMine(game)}`
  });
}


// work
if (interaction.commandName === "work") {

  const userId = interaction.user.id;

  const earned =
    Math.floor(Math.random() * 50) + 10;

  // get current data safely
  const { data, error } = await supabase
    .from("coins")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log(error);
    return interaction.reply({
      content: "Database error.",
      ephemeral: true
    });
  }

  let coins = data?.coins || 0;

  coins += earned;

  // save back to database
  const { error: upsertError } = await supabase
    .from("coins")
    .upsert({
      user_id: userId,
      coins: coins
    });

  if (upsertError) {
    console.log(upsertError);
    return interaction.reply({
      content: "Failed to save coins.",
      ephemeral: true
    });
  }

  return interaction.reply({
    content:
`💰 You worked and earned ${earned} coins!

You now have ${coins} coins.`
  });
}
// leaderboard
// leaderboard
if (
  interaction.commandName ===
  'leaderboard'
) {

  const {
    data
  } = await supabase
    .from('coins')
    .select('*')
    .order('coins', {
      ascending: false
    })
    .limit(10);

  if (
    !data ||
    data.length <= 0
  ) {

    return interaction.reply(
      "Nobody has any coins yet."
    );
  }

  let text = "";

  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    const user =
      data[i];

    text +=
`**${i + 1}.** <@${user.user_id}> — 💰 ${user.coins} coins\n`;
  }

  const embed =
    new EmbedBuilder()
      .setTitle(
        "💰 Coin Leaderboard"
      )
      .setDescription(text)
      .setColor(0xffd700);

  return interaction.reply({
    embeds: [embed]
  });
}
    // setcoins
// setcoins
if (
  interaction.commandName ===
  'setcoins'
) {

  if (
    interaction.user.id !==
    OWNER_ID
  ) {

    return interaction.reply({
      content:
        "No permission.",
      ephemeral: true
    });
  }

  const user =
    interaction.options.getUser(
      'user'
    );

  const amount =
    interaction.options.getInteger(
      'amount'
    );

  await supabase
    .from('coins')
    .upsert({
      user_id: user.id,
      coins: amount
    });

  return interaction.reply({
    content:
`💰 Set ${user.username}'s coins to ${amount}.`
  });
}

    // daily
    if (interaction.commandName === "daily") {

  const userId = interaction.user.id;

  const today =
    new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("coins")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  let coins = data?.coins || 0;
  let streak = data?.daily_streak || 0;
  let last = data?.last_daily || null;

  // already claimed today
  if (last === today) {
    return interaction.reply({
      content: "❌ You already claimed your daily today.",
      ephemeral: true
    });
  }

  // check if streak continues or resets
  if (last) {

    const lastDate = new Date(last);
    const todayDate = new Date(today);

    const diff =
      Math.floor(
        (todayDate - lastDate) /
        (1000 * 60 * 60 * 24)
      );

    if (diff === 1) {
      streak += 1;
    } else {
      streak = 0;
    }
  } else {
    streak = 0;
  }

  // formula: 100 * 1.2^streak
  const multiplier =
    Math.pow(1.2, streak);

  const earned =
    Math.floor(100 * multiplier);

  coins += earned;

  await supabase
    .from("coins")
    .upsert({
      user_id: userId,
      coins: coins,
      daily_streak: streak,
      last_daily: today
    });

  return interaction.reply({
    content:
`**Daily Reward Claimed!**

🔥 Streak: ${streak}
✨ Multiplier: x${multiplier.toFixed(2)}

💸 You earned ${earned} coins!
💰 Total: ${coins} coins`
  });
}



    // balance
if (
  interaction.commandName ===
  'balance'
) {

  const userId =
    interaction.user.id;

  const { data } =
    await supabase
      .from("coins")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();

  const coins =
    data?.coins || 0;

  const embed =
    new EmbedBuilder()
      .setTitle(
        "Your Balance"
      )
      .setDescription(
        `You currently have **${coins}** coins.`
      )
      .setColor(0xffd700);

  return interaction.reply({
    embeds: [embed]
  });
}

// inventory
if (
  interaction.commandName ===
  'inventory'
) {

  const userId =
    interaction.user.id;

  const { data, error } =
    await supabase
      .from("inventory")
      .select("*")
      .eq(
        "user_id",
        userId
      );

  if (error) {

    console.log(error);

    return interaction.reply({
      content:
        "Inventory database error.",
      ephemeral: true
    });
  }

  let text = "";

  // empty inventory
  if (
    !data ||
    data.length <= 0
  ) {

    text =
      "Your inventory is empty.";
  }

  else {

    // count duplicates
    const itemCounts = {};

    for (const item of data) {

      if (
        !itemCounts[item.item_name]
      ) {

        itemCounts[item.item_name] = 0;
      }

      itemCounts[item.item_name]++;
    }

    // make text
    for (const itemName in itemCounts) {

      text +=
`• ${itemName} x${itemCounts[itemName]}\n`;
    }
  }

  const embed =
    new EmbedBuilder()
      .setTitle(
        "Your Inventory"
      )
      .setDescription(text)
      .setColor(0x00b0f4);

  return interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
}
// shop
if (
  interaction.commandName ===
  'shop'
) {

  let text = "";

  const buttons =
    new ActionRowBuilder();

  for (
    let i = 0;
    i < shopItems.length;
    i++
  ) {

    const item =
      shopItems[i];

    text +=
`${item.emoji} **${item.name}**
💰 ${item.price} coins\n\n`;

    buttons.addComponents(

      new ButtonBuilder()
        .setCustomId(
          `buy_${i}`
        )
        .setLabel(
          item.name
        )
        .setStyle(
          ButtonStyle.Primary
        )
    );
  }

  const embed =
    new EmbedBuilder()
      .setTitle(
        "🛒 Coin Shop"
      )
      .setDescription(text)
      .setColor(0x00b0f4);

  return interaction.reply({
    embeds: [embed],
    components: [buttons],
    ephemeral: true
  });
}

if (interaction.commandName === "python") {

  if (interaction.user.id !== OWNER_ID) {
    return interaction.reply({
      content: "No permission.",
      ephemeral: true
    });
  }

  await interaction.deferReply({
    ephemeral: true
  });

  const code =
    interaction.options.getString("code");

  const fileName =
    `temp_${Date.now()}.py`;

  try {

    fs.writeFileSync(fileName, code);

    exec(
      `python "${fileName}"`,
      {
        timeout: 5000
      },
      async (error, stdout, stderr) => {

        try {
          fs.unlinkSync(fileName);
        } catch {}

        let output =
          stdout || stderr || "No output.";

        if (error?.killed) {
          output =
            "Execution timed out (5 seconds).";
        }

        if (output.length > 1900) {
          output =
            output.slice(0, 1900) +
            "\n...truncated";
        }

        await interaction.editReply({
          content:
`\`\`\`
${output}
\`\`\``
        });
      }
    );

  } catch (err) {

    try {
      fs.unlinkSync(fileName);
    } catch {}

    await interaction.editReply({
      content:
`Error:

\`\`\`
${err.message}
\`\`\``
    });
  }
}
    
    // 8balll
    //8
if (
  interaction.commandName ===
  '8ball'
) {

  const question =
    interaction.options.getString(
      'question'
    );

  const response =
    eightBallResponses[
      Math.floor(
        Math.random() *
        eightBallResponses.length
      )
    ];

  return interaction.reply({
    embeds: [

      new EmbedBuilder()
        .setTitle("8Ball Response")
        .addFields(
          {
            name: "Question",
            value: question
          },
          {
            name: "Answer",
            value: response
          }
        )
        .setColor(0x000000)
    ]
  });
}

// pong
if (
  interaction.commandName ===
  "pong"
) {

  const game = {

    userId: interaction.user.id,

    player: 2,
    bot: 2,

    playerScore: 0,
    botScore: 0,

    ball: {
      x: 4,
      y: 2,
      dx: -1,
      dy: 1
    }
  };

  await interaction.reply({

    content:
`# 🏓 Pong

Player: ${game.playerScore}
Bot: ${game.botScore}

${renderPong(game)}`,

    components: pongButtons()

  });

  const msg =
    await interaction.fetchReply();

  pongGames.set(
    msg.id,
    game
  );
}

if (interaction.commandName === "tictactoe") {

  const opponent = interaction.options.getUser("user");

  const board = [
    ["⬜","⬜","⬜"],
    ["⬜","⬜","⬜"],
    ["⬜","⬜","⬜"]
  ];

  const gameId = interaction.id;

  tttGames.set(gameId, {
    board,
    players: [interaction.user.id, opponent.id],
    turn: interaction.user.id,
    over: false
  });

  return interaction.reply({
    content: `❌ <@${interaction.user.id}> vs ⭕ <@${opponent.id}>\nTurn: <@${interaction.user.id}>`,
    components: tttButtons(board, gameId)
  });
}

    // userinfo
if (
  interaction.commandName ===
  'userinfo'
) {

  const member =
    interaction.member;

  const user =
    interaction.user;

  const joinedServer =
    `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;

  const createdAccount =
    `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;

  const embed =
    new EmbedBuilder()
      .setTitle(
        `${user.username}'s Info`
      )
      .setThumbnail(
        user.displayAvatarURL()
      )
      .setColor(0x5865F2)
      .addFields(

        {
          name: "Username",
          value: user.tag,
          inline: true
        },

        {
          name: "User ID",
          value: user.id,
          inline: true
        },


        {
          name: "Account Created",
          value: createdAccount,
          inline: false
        },

        {
          name: "Joined Server",
          value: joinedServer,
          inline: false
        }
      );

  return interaction.reply({
    embeds: [embed]
  });
}
    // serverinfo
if (
  interaction.commandName ===
  'serverinfo'
) {

  const guild = interaction.guild;

  const embed = new EmbedBuilder()
    .setTitle(guild.name)
    .setThumbnail(
      guild.iconURL({ dynamic: true })
    )
    .setColor(0x5865F2)

    .addFields(

      {
        name: 'Owner',
        value: `<@${guild.ownerId}>`,
        inline: true
      },

      {
        name: 'Members',
        value: `${guild.memberCount}`,
        inline: true
      },

      {
        name: 'Created',
        value:
          `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
        inline: true
      },

      {
        name: 'Server ID',
        value: guild.id,
        inline: false
      },

      {
        name: 'Boost Level',
        value:
          `Level ${guild.premiumTier}`,
        inline: true
      },

      {
        name: 'Boosts',
        value:
          `${guild.premiumSubscriptionCount}`,
        inline: true
      }
    );

  await interaction.reply({
    embeds: [embed]
  });
}


    // betterbot
if (
  interaction.commandName ===
  'betterbot'
) {

  const embed =
    new EmbedBuilder()
      .setTitle(
        "Whats the better bot"
      )
      .setColor(0x00b0f4)

      .addFields(

        {
          name: "**MangoBot**",
          value:
`
• mango
• owner thinks that i am copying MangoBot
• cool
• is better set up and is actually public compared to The Silly Bot
`,
          inline: true
        },

        {
          name: "The Silly Bot",
          value:
`
• 1 game
• qotd system
• /askai command that actually works
• silly
• made by me
`,
          inline: true
        }
      )

      .setFooter({
        text:
          "unbiased comparison"
      });

  return interaction.reply({
    embeds: [embed]
  });
}
    
    // status
    if (
      interaction.commandName ===
      'status'
    ) {

      // owner check
      if (
        interaction.user.id !==
        OWNER_ID
      ) {

        return interaction.reply({
          content:
            "No permission.",
          ephemeral: true
        });
      }

      const text =
        interaction.options.getString(
          'text'
        );

      client.user.setPresence({
        activities: [
          {
            name: text,
            type: 4
          }
        ],
        status: 'online'
      });

      return interaction.reply({
        content:
          `Status changed to: ${text}`,
        ephemeral: true
      });
    }
   // askai
if (
  interaction.commandName ===
  'askai'
) {

  const question =
    interaction.options.getString(
      'question'
    );

  await interaction.deferReply();

  try {

    // get old convo
    let history =
      aiConversations.get(
        interaction.user.id
      ) || [];

    // add user message
    history.push({
      role: "user",
      content: question
    });

    // warn + reset after 20 messages
    let warning = "";

    if (history.length >= 20) {

      warning =
        "\n\n⚠️ Memory full, conversation was reset after this message.";

      // keep current message only
      history = [
        {
          role: "user",
          content: question
        }
      ];
    }

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "openai/gpt-3.5-turbo",

          messages: history
        },
        {
          headers: {
            Authorization:
              `Bearer ${process.env.OPENROUTER_KEY}`,

            "Content-Type":
              "application/json"
          }
        }
      );

    const reply =
      response.data
        .choices[0]
        .message.content;

    // save ai response too
    history.push({
      role: "assistant",
      content: reply
    });

    // save convo
    aiConversations.set(
      interaction.user.id,
      history
    );

    await interaction.editReply(
      reply + warning
    );

  } catch (err) {

    console.error(err);

    await interaction.editReply(
      "AI exploded 😭"
    );
  }
}
    
    // sendqotd
    if (
      interaction.commandName ===
      'sendqotd'
    ) {

      if (
        interaction.user.id !==
        OWNER_ID
      ) {

        return interaction.reply({
          content:
            "No permission.",
          ephemeral: true
        });
      }

      await interaction.reply(
        "Sending QOTD..."
      );

      await sendQOTD();
    }
  }
);
// ) <- the evil bracket, has caused 1 crime
// test comment

const mem = process.memoryUsage();

console.log({
  rss: (mem.rss / 1024 / 1024).toFixed(1) + " MB",
  heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(1) + " MB",
  heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(1) + " MB",
  external: (mem.external / 1024 / 1024).toFixed(1) + " MB"
});

// =====================
// LOGIN
// =====================
client.login(TOKEN);
