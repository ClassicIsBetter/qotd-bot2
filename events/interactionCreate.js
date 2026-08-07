const fs = require("fs");
const path = require("path");

const commands = new Map();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "../commands"))
  .filter(file =>
    file.endsWith(".js") &&
    file !== "register.js"
  );

for (const file of commandFiles) {
  const command = require(
    path.join(__dirname, "../commands", file)
  );

  if (command.data && command.execute) {
    commands.set(
      command.data.name,
      command
    );
  }
}

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(
      interaction.commandName
    );

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `Error running /${interaction.commandName}:`,
        error
      );

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
    }
  });
};
