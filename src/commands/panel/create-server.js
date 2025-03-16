const { ApplicationCommandType, ApplicationCommandOptionType, Colors } = require("discord.js");
const Pterodactyl = require("../../../handlers/functions/Pterodactyl");

const serverMapping = {
    15: 'NodeJS',
    16: 'Python'
}

module.exports = {
    name: 'create-server',
    description: '(💡) Panel',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'email',
            description: "Adresse e-mail",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "offre",
            description: "Choix de l'offre",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "NodeJS",
                    value: "15"
                },
         
                {
                    name: "Python",
                    value: "16"
                }
            ]
        },
        {
            name: 'nom',
            description: "Nom du serveur",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
execute: async (client, interaction, args, con) => {
    const email = interaction.options.getString('email');
    const egg = interaction.options.getString("offre");
    const name = interaction.options.getString('nom');

    await Pterodactyl.CreateServer(email, egg, name).then(async (res) => {
        interaction.reply({
            embeds: [{
                color: Colors.Blue,
                description: `Le serveur de ${email} (${serverMapping[parseInt(egg, 10)]}) vient d'être créer.`
            }]
        })
    })
    }
}