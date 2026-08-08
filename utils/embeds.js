const { EmbedBuilder } = require("discord.js");

function createEmbed({
  title,
  description,
  color = 0x00b0f4,
  fields = [],
  footer,
  thumbnail,
  image,
  timestamp = false
} = {}) {
  const embed = new EmbedBuilder()
    .setColor(color);

  if (title) {
    embed.setTitle(title);
  }

  if (description) {
    embed.setDescription(description);
  }

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  if (footer) {
    embed.setFooter({
      text: footer
    });
  }

  if (thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  if (image) {
    embed.setImage(image);
  }

  if (timestamp) {
    embed.setTimestamp();
  }

  return embed;
}

module.exports = {
  createEmbed
};
