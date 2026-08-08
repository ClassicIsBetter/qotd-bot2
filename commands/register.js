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
      file !== "register.js" &&
      file !== "definitions.js"
    );

  console.log("Found command files:");

  for (const file of commandFiles) {
    try {
      const command = require(
        path.join(__dirname, file)
      );

      if (!command.data) {
        console.warn(`⚠️ ${file} has no "data" property`);
        continue;
      }

      commands.push(command.data.toJSON());

      console.log(`  ✅ ${command.data.name} (${file})`);

    } catch (error) {
      console.error(`❌ Failed to load ${file}:`);
      console.error(error);
    }
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

    console.log("Commands registered successfully.");

  } catch (error) {
    console.error(
      "Failed to register commands:",
      error
    );
  }
}

module.exports = registerCommands;
