const { ApplicationCommandType } = require('discord.js')

module.exports = {
    name: 'ping',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args) => {
    interaction.reply({ content: `${interaction.member} pong! :ping_pong:` })
    }
}