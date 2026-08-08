const {
  SlashCommandBuilder
} = require("discord.js");

const { createEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands"),

  async execute(interaction) {
    const embed = createEmbed({
      title: "List Of Commands",

      description: `
**-----QOTD-----**
/suggestqotd
Suggest a QOTD

/qotdqueue
View your queued QOTDs + statuses (Currently down)

/sendqotd
Force send oldest QOTD (Owner only)

/forceqotd
Force send a specific queued QOTD (Owner only)

**-----Games/Fun-----**
/snake
Play snake

/askai
Ask ChatGPT 3.5 Turbo anything
(has proper chat memory, resets after 20 messages)

**-----Economy/Coins-----**
/work
Get a random amount of coins

/daily
Claim daily coins
(24H after last claimed, not actually daily)

/leaderboard
View balance leaderboard

**-----Other-----**
/help
Shows this command list

/ping
Check if the bot is alive

NOTE TO SELF: update this list
`,

      color: 0xA9A9A9
    });

    await interaction.reply({
      embeds: [embed]
    });
  }
};
