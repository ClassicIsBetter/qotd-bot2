const {
  SlashCommandBuilder
} = require("discord.js");

const simpleCommands = {
  ping: {
    message: "Pong!",
    description: "check if the bot is alive"
  },

  help: {
    embed: true,
    title: "List Of Commands",
    color: 0xA9A9A9,

    message: `
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

const commands = [

  // Simple commands
  ...Object.keys(simpleCommands).map(cmd =>
    new SlashCommandBuilder()
      .setName(cmd)
      .setDescription(
        simpleCommands[cmd].description
      )
      .toJSON()
  ),

  // QOTD
  new SlashCommandBuilder()
    .setName("suggestqotd")
    .setDescription("Suggest a QOTD")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("sendqotd")
    .setDescription("Force send oldest QOTD")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the richest users (balance)")
    .toJSON(),

  // Games
  new SlashCommandBuilder()
    .setName("pong")
    .setDescription("Play Pong")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("snake")
    .setDescription("Play Snake")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play Tic Tac Toe")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The person to play against")
        .setRequired(true)
    )
    .toJSON(),

  // Embed
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create a custom embed")
    .addStringOption(option =>
      option
        .setName("title")
        .setDescription("Embed title")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("Embed description")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("colour")
        .setDescription("Embed colour")
        .setRequired(false)
        .addChoices(
          { name: "🔴 Red", value: "FF0000" },
          { name: "🟠 Orange", value: "FFA500" },
          { name: "🟡 Yellow", value: "FFFF00" },
          { name: "🟢 Green", value: "00FF00" },
          { name: "🔵 Blue", value: "0099FF" },
          { name: "🟣 Purple", value: "8000FF" },
          { name: "🟣 Pink", value: "FF69B4" },
          { name: "⚫ Black", value: "000000" },
          { name: "⚪ White", value: "FFFFFF" },
          { name: "🌈 Random", value: "RANDOM" }
        )
    )
    .addStringOption(option =>
      option
        .setName("footer")
        .setDescription("Footer text")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("image")
        .setDescription("Image URL")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("thumbnail")
        .setDescription("Thumbnail URL")
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName("timestamp")
        .setDescription("Add timestamp")
        .setRequired(false)
    )
    .toJSON(),

  // Countdown
  new SlashCommandBuilder()
    .setName("countdown")
    .setDescription("Create a countdown")
    .addStringOption(option =>
      option
        .setName("until")
        .setDescription("DD/MM/YYYY or DD/MM/YYYY HH:MM")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("title")
        .setDescription("Countdown title")
        .setRequired(false)
    )
    .toJSON(),

  // QR
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

  // Time
  new SlashCommandBuilder()
    .setName("time")
    .setDescription("Show the current time")
    .addStringOption(option =>
      option
        .setName("area")
        .setDescription("Timezone")
        .setRequired(true)
        .addChoices(
          { name: "Adelaide", value: "Australia/Adelaide" },
          { name: "Sydney", value: "Australia/Sydney" },
          { name: "Melbourne", value: "Australia/Melbourne" },
          { name: "Brisbane", value: "Australia/Brisbane" },
          { name: "Perth", value: "Australia/Perth" },
          { name: "London", value: "Europe/London" },
          { name: "New York", value: "America/New_York" },
          { name: "Los Angeles", value: "America/Los_Angeles" },
          { name: "Tokyo", value: "Asia/Tokyo" }
        )
    )
    .toJSON(),

  // Translate
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
        .setDescription("Target language")
        .setRequired(true)
    )
    .toJSON(),

  // Reminder
  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Set a reminder")
    .addStringOption(option =>
      option
        .setName("time")
        .setDescription("Examples: 10m, 2h, 1d")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reminder")
        .setDescription("What should I remind you about?")
        .setRequired(true)
    )
    .toJSON(),

  // Maths
  new SlashCommandBuilder()
    .setName("maths")
    .setDescription("Calculate a maths equation")
    .addStringOption(option =>
      option
        .setName("equation")
        .setDescription("Equation to calculate")
        .setRequired(true)
    )
    .toJSON(),

  // Dice
  new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice")
    .addIntegerOption(option =>
      option
        .setName("max")
        .setDescription("Maximum number")
        .setRequired(true)
    )
    .toJSON(),

  // 8ball
  new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the 8ball something")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Your question")
        .setRequired(true)
    )
    .toJSON(),

  // User info
  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("View user information")
    .toJSON(),

  // Server info
  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View server information")
    .toJSON(),

  // Better bot
  new SlashCommandBuilder()
    .setName("betterbot")
    .setDescription("Compare The Silly Bot and MangoBot")
    .toJSON(),

  // Status
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Set bot status")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("Status text")
        .setRequired(true)
    )
    .toJSON(),

  // AI
  new SlashCommandBuilder()
    .setName("askai")
    .setDescription("Ask the AI something")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("What to ask")
        .setRequired(true)
    )
    .toJSON(),

  // Python
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

  // Economy
  new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work for coins")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim daily coins")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your inventory")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View the shop")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("setcoins")
    .setDescription("Set a user's coins")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Amount of coins")
        .setRequired(true)
    )
    .toJSON(),

  // QOTD queue
  new SlashCommandBuilder()
    .setName("qotdqueue")
    .setDescription("View the QOTD queue")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("forceqotd")
    .setDescription("Force send a QOTD")
    .addIntegerOption(option =>
      option
        .setName("number")
        .setDescription("Queue number")
        .setRequired(true)
    )
    .toJSON()
];

module.exports = commands;
module.exports.simpleCommands = simpleCommands;
