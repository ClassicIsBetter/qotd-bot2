const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const config = require("../config/config");

async function registerCommands() {
  const commands = [];

  const commandFiles = fs
    .readdirSync(__dirname)
    .filter(file =>
      file.endsWith(".js") &&
      file !== "register.js"
    );

  for (const file of commandFiles) {
    const command = require(path.join(__dirname, file));

    if (!command.data) {
      console.warn(
        `⚠️ ${file} does not have command data`
      );
      continue;
    }

    commands.push(command.data.toJSON());
  }

  const rest = new REST({
    version: "10"
  }).setToken(config.TOKEN);

  try {
    console.log(
      `Registering ${commands.length} command(s)...`
    );

    await rest.put(
      Routes.applicationCommands(config.CLIENT_ID),
      {
        body: commands
      }
    );

    console.log("Commands ready.");
  } catch (error) {
    console.error(
      "Failed to register commands:",
      error
    );
  }
}

module.exports = registerCommands;
