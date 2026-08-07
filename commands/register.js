
const { REST, Routes } = require("discord.js");
const config = require("../config/config");
const commands = require("./definitions");

async function registerCommands() {

  const rest = new REST({
    version: "10"
  }).setToken(config.TOKEN);

  try {

    console.log("Registering commands...");

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

