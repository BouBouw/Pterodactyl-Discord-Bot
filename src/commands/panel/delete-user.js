const { ApplicationCommandType, ApplicationCommandOptionType, Colors } = require("discord.js");
const Pterodactyl = require("../../../handlers/functions/Pterodactyl");

module.exports = {
    name: 'delete-user',
    description: '(💡) Panel',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'email',
            description: "Adresse e-mail",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
execute: async (client, interaction, args) => {
    const email = interaction.options.getString('email');

    const user = await Pterodactyl.GetUser(email);
    await Pterodactyl.DeleteUser(user.attributes.id).then(async (res) => {
        interaction.reply({
            embeds: [{
                color: Colors.Blue,
                description: `L'utilisateur avec l'adresse e-mail \`${email}\` vient d'être supprimé.`
            }]
        })
    })
    }
}