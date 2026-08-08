const {
  SlashCommandBuilder
} = require("discord.js");

const { evaluate } = require("mathjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maths")
    .setDescription("Calculate a maths equation")
    .addStringOption(option =>
      option
        .setName("equation")
        .setDescription("Equation to calculate")
        .setRequired(true)
    ),

  async execute(interaction) {
    const equation =
      interaction.options.getString("equation");

    try {
      const result = evaluate(equation);

      await interaction.reply(
        `🧮 **${equation}** = **${result}**`
      );
    } catch (error) {
      await interaction.reply(
        "❌ I couldn't calculate that equation."
      );
    }
  }
};
