const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("View user information"),

  async execute(interaction) {
    const user = interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0xA9A9A9)
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Username",
          value: user.username,
          inline: true
        },
        {
          name: "User ID",
          value: user.id,
          inline: true
        },
        {
          name: "Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: false
        }
      );

    await interaction.reply({
      embeds: [embed]
    });
  }
};
