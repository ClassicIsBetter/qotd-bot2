js
module.exports = (client) => {

  client.on("interactionCreate", async (interaction) => {

    try {

      // =====================
      // SLASH COMMANDS
      // =====================

      if (interaction.isChatInputCommand()) {

        console.log(
          `📥 /${interaction.commandName} used by ${interaction.user.tag}`
        );

        // Commands will be connected here
        // as we move them into /commands.
        //
        // Example:
        //
        // const command =
        //   require("../commands/ping");
        //
        // await command.execute(interaction);

        return;
      }

      // =====================
      // BUTTONS
      // =====================

      if (interaction.isButton()) {

        console.log(
          `🔘 Button ${interaction.customId} used by ${interaction.user.tag}`
        );

        // Game buttons and QOTD buttons
        // will be moved here later.

        return;
      }

      // =====================
      // MODALS
      // =====================

      if (interaction.isModalSubmit()) {

        console.log(
          `📝 Modal ${interaction.customId} submitted by ${interaction.user.tag}`
        );

        // QOTD modal will be moved here later.

        return;
      }

    } catch (error) {

      console.error(
        "❌ Interaction error:",
        error
      );

      if (interaction.replied || interaction.deferred) {

        await interaction.followUp({
          content: "❌ Something went wrong.",
          ephemeral: true
        }).catch(() => {});

      } else {

        await interaction.reply({
          content: "❌ Something went wrong.",
          ephemeral: true
        }).catch(() => {});

      }

    }

  });

};

