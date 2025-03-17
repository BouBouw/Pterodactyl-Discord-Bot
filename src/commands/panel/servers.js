const { ApplicationCommandType, ApplicationCommandOptionType, Colors } = require('discord.js');
const Pterodactyl = require('../../../handlers/functions/Pterodactyl');

module.exports = {
    name: 'servers',
    description: '(💡) Panel',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'email',
            description: "Adresse e-mail",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
execute: async (client, interaction, args) => {
    const email = interaction.options.getString('email');
    
    try {
        const user = await Pterodactyl.GetUser(email);
        const user_id = user.attributes.id;

        const servers = await Pterodactyl.GetServers();
        if(servers.length === 0) return interaction.reply({
            color: Colors.Blue,
            description: `Aucun serveur trouvé avec l'adresse e-mail : \`${email}\`.`
        });

        const filteredServers = servers.filter(server => server.attributes.user === user_id);
        const serverList = filteredServers.map(server => `- **${server.attributes.name}** (ID: ${server.attributes.identifier})`).join('\n');
        interaction.reply({
            embeds: [{
                color: Colors.Blue,
                description: `${serverList}`
            }]
        })
    } catch(err) {
        interaction.reply({
            embeds: [{
                color: Colors.Red,
                description: `Une erreur est survenu lors de la récupération des serveurs.`
            }],
            ephemeral: true
        })
    }
    }
}