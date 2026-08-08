const {
  SlashCommandBuilder
} = require("discord.js");

const emojis = [
  "😀",
  "😂",
  "🥹",
  "😭",
  "😎",
  "🤨",
  "😐",
  "🤔",
  "😈",
  "👀",
  "🔥",
  "💀",
  "👍",
  "👎",
  "❤️",
  "💯",
  "🎉",
  "✨",
  "🗿",
  "🐸",
  "🦆",
  "🐱",
  "🐶",
  "🍕",
  "🚀",
  "🌈",
  "⭐",
  "🌳",
  "⚡",
  "🎲"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("something")
    .setDescription("Do something completely random"),

  async execute(interaction) {
    const emoji =
      emojis[Math.floor(Math.random() * emojis.length)];

    await interaction.reply(emoji);
  }
};
