require("dotenv").config();

const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const config = require("./config/config");
const registerCommands = require("./commands/register");

// =====================
// CLIENT
// =====================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

console.log("Bot starting...");

// =====================
// EVENTS
// =====================

require("./events/ready")(client);
require("./events/interactionCreate")(client);

// =====================
// REGISTER COMMANDS
// =====================

registerCommands();

// =====================
// LOGIN
// =====================

client.login(config.TOKEN);
