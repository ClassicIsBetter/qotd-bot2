const {
  SlashCommandBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice")
    .addIntegerOption(option =>
      option
        .setName("max")
        .setDescription("Maximum number")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const max = interaction.options.getInteger("max");

    const roll = Math.floor(Math.random() * max) + 1;

    await interaction.reply(
      `🎲 You rolled **${roll}** out of **${max}**!`
    );
  }
};
