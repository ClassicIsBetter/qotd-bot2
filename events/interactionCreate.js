module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    try {
      // Commands and interactions will be moved here
      // from old/bot.js one section at a time.

      if (interaction.isChatInputCommand()) {
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
    return;
  }
}

      console.log(
        `Interaction received: ${interaction.type}`
      );

    } catch (error) {
      console.error(
        "Interaction error:",
        error
      );

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "❌ Something went wrong.",
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: "❌ Something went wrong.",
            ephemeral: true
          });
        }
      } catch {}
    }
  });
};
