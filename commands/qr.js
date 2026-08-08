const {
  SlashCommandBuilder,
  AttachmentBuilder
} = require("discord.js");

const QRCode = require("qrcode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("Generate a QR code")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("Text or URL")
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString("text");

    try {
      const buffer = await QRCode.toBuffer(text, {
        width: 500,
        margin: 2
      });

      const attachment = new AttachmentBuilder(buffer, {
        name: "qrcode.png"
      });

      await interaction.reply({
        content: `🔲 QR code for: \`${text}\``,
        files: [attachment]
      });

    } catch (error) {
      console.error("QR code error:", error);

      await interaction.reply(
        "❌ I couldn't generate that QR code."
      );
    }
  }
};
