const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ApplicationCommandOptionType } = require('discord.js');
const Pterodactyl = require('../../../handlers/functions/Pterodactyl');

module.exports = {
    name: 'manage-user',
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

    const user = await Pterodactyl.GetUser(email);
    const user_id = user.attributes.id;

    const modal = new ModalBuilder()
    .setCustomId('panel.manage_user')
    .setTitle(`(${user_id}) Modifier un utilisateur`)

    const input_0 = new TextInputBuilder()
    .setCustomId('field.username')
    .setLabel("Nom d'utilisateur")
    .setValue(`${user.attributes.username}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_1 = new TextInputBuilder()
    .setCustomId('field.email')
    .setLabel("Adresse e-mail")
    .setValue(`${user.attributes.email}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_2 = new TextInputBuilder()
    .setCustomId('field.first_name')
    .setLabel("Prénom")
    .setValue(`${user.attributes.first_name}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_3 = new TextInputBuilder()
    .setCustomId('field.last_name')
    .setLabel("Nom")
    .setValue(`${user.attributes.last_name}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_4 = new TextInputBuilder()
    .setCustomId('field.user_id')
    .setLabel("Identifiant Utilisateur")
    .setValue(`${user.attributes.id}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(input_0),
        new ActionRowBuilder().addComponents(input_1),
        new ActionRowBuilder().addComponents(input_2),
        new ActionRowBuilder().addComponents(input_3),
        new ActionRowBuilder().addComponents(input_4),
    )

    await interaction.showModal(modal);
    }
}