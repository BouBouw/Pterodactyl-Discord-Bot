const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
    name: 'create-user',
    description: '(💡) Panel',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args) => {
    const modal = new ModalBuilder()
    .setCustomId('panel.create_user')
    .setTitle("Créer un utilisateur")

    const input_0 = new TextInputBuilder()
    .setCustomId('field.username')
    .setLabel("Nom d'utilisateur")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_1 = new TextInputBuilder()
    .setCustomId('field.email')
    .setLabel("Adresse e-mail")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_2 = new TextInputBuilder()
    .setCustomId('field.first_name')
    .setLabel("Prénom")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_3 = new TextInputBuilder()
    .setCustomId('field.last_name')
    .setLabel("Nom")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const input_4 = new TextInputBuilder()
    .setCustomId('field.password')
    .setLabel("Mot de passe")
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