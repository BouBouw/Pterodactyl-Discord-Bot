const { ApplicationCommandType, ApplicationCommandOptionType, Colors, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');
const Pterodactyl = require('../../../handlers/functions/Pterodactyl');

module.exports = {
    name: 'delete-server',
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
            const filteredServers = servers.filter(server => server.attributes.user === user_id);

            if (filteredServers.length === 0) {
                return interaction.reply({
                    embeds: [{
                        color: Colors.Blue,
                        description: `Aucun serveur trouvé avec l'adresse e-mail : \`${email}\`.`
                    }],
                    ephemeral: true
                });
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('servers.select_server')
                        .setPlaceholder("Sélectionnez un serveur")
                        .addOptions(
                            filteredServers.map(server => (
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`${server.attributes.id}`)
                                    .setLabel(`${server.attributes.name}`)
                            ))
                        )
                );

            const reply = await interaction.reply({
                embeds: [{
                    color: Colors.Blue,
                    description: `Serveurs associés à \`${email}\` :\n${filteredServers.map(server => `- **${server.attributes.name}** (ID: ${server.attributes.identifier})`).join('\n')}`
                }],
                components: [row],
                fetchReply: true
            });

            // Gestion des interactions
            const filter = (i) => i.user.id === interaction.user.id && i.isStringSelectMenu();
            const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (selectInteraction) => {
                try {
                    await Pterodactyl.DeleteServer(selectInteraction.values[0]);

                    const updatedServers = await Pterodactyl.GetServers();
                    const updatedFilteredServers = updatedServers.filter(server => server.attributes.user === user_id);

                    const updatedRow = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('servers.select_server')
                                .setPlaceholder("Sélectionnez un serveur")
                                .addOptions(
                                    updatedFilteredServers.map(server => (
                                        new StringSelectMenuOptionBuilder()
                                            .setValue(`${server.attributes.id}`)
                                            .setLabel(`${server.attributes.name}`)
                                    ))
                                )
                        );

                    await selectInteraction.update({
                        embeds: [{
                            color: Colors.Blue,
                            description: `Serveurs associés à \`${email}\` :\n${updatedFilteredServers.map(server => `- **${server.attributes.name}** (ID: ${server.attributes.identifier})`).join('\n')}`
                        }],
                        components: updatedFilteredServers.length > 0 ? [updatedRow] : []
                    });
                } catch (error) {
                    console.error(error);
                    await selectInteraction.update({
                        embeds: [{
                            color: Colors.Red,
                            description: `Une erreur est survenue lors de la suppression du serveur.`
                        }],
                        components: []
                    });
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({
                    components: []
                });
            });

        } catch (error) {
            console.error(error);
            interaction.reply({
                embeds: [{
                    color: Colors.Red,
                    description: `Une erreur est survenue lors de la récupération des serveurs.`
                }],
                ephemeral: true
            });
        }
    }
};