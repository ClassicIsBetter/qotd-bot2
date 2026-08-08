const {
  SlashCommandBuilder
} = require("discord.js");

const responses = [
  "Yes.",
  "No.",
  "Maybe.",
  "Definitely.",
  "Probably not.",
  "Ask again later.",
  "Absolutely!",
  "I don't think so.",
  "The signs point to yes.",
  "The signs point to no.",
  "I have no idea.",
  "Absolutely not.",
  "It is possible.",
  "Very likely.",
  "Very unlikely."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the 8ball something")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Your question")
        .setRequired(true)
    ),

  async execute(interaction) {
    const question =
      interaction.options.getString("question");

    const response =
      responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply(
      `🎱 **${question}**\n${response}`
    );
  }
};
