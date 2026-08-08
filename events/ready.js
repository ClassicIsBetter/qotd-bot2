
const config = require("../config/config");

module.exports = (client) => {

  client.once("clientReady", () => {

    // =====================
    // BOT STATUS
    // =====================

    client.user.setPresence({
      activities: [
        {
          name: "very cool test, wow",
          type: 4
        }
      ],
      status: "online"
    });

    // =====================
    // SERVER LIST
    // =====================

    console.log("\n=================================");
    console.log(`🤖 Bot is online as: ${client.user.tag}`);
    console.log(`📡 Connected to ${client.guilds.cache.size} server(s):`);
    console.log("=================================");

    client.guilds.cache.forEach(guild => {
      console.log(
        `🏠 Name: "${guild.name}" | 👥 Members: ${guild.memberCount} | 🆔 ID: ${guild.id}`
      );
    });

    console.log("=================================\n");

    console.log(`Logged in as ${client.user.tag}`);

    // =====================
    // REMINDER CHECKER
    // =====================

    // We'll move checkReminders() into
    // utils/reminders.js shortly.

    // =====================
    // QOTD SCHEDULE
    // =====================

    // We'll move sendQOTD() and scheduleQOTD()
    // into commands/qotd.js shortly.

  });

};

