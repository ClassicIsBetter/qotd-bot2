const {
  SlashCommandBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
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
    ),

  async execute(interaction) {
    const timezone =
      interaction.options.getString("area");

    const now = new Date();

    const formatted = new Intl.DateTimeFormat("en-AU", {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "long"
    }).format(now);

    await interaction.reply(
      `🕐 **Current time**\n${formatted}`
    );
  }
};
