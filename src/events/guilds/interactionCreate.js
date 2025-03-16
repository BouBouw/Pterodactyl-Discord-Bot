const { Colors } = require('discord.js');

const Pterodactyl = require("../../../handlers/functions/Pterodactyl");

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    await Modals();

    async function Modals() {
        if(!interaction.isModalSubmit()) return;

        switch(interaction.customId) {
            case 'panel.create_user': {
                const username = interaction.fields.getTextInputValue('field.username');
                const email = interaction.fields.getTextInputValue('field.email');
                const first_name = interaction.fields.getTextInputValue('field.first_name');
                const last_name = interaction.fields.getTextInputValue('field.last_name');
                const password = interaction.fields.getTextInputValue('field.password');

                await Pterodactyl.CreateUser(username, email, first_name, last_name, password).then(async (res) => {
                    interaction.reply({
                        embeds: [{
                            color: Colors.Green,
                            description: `L'utilisateur à bien été créer : ${email}`
                        }],
                        ephemeral: true
                    })
                })
                break;
            };

            case 'panel.manage_user': {
                const username = interaction.fields.getTextInputValue('field.username');
                const email = interaction.fields.getTextInputValue('field.email');
                const first_name = interaction.fields.getTextInputValue('field.first_name');
                const last_name = interaction.fields.getTextInputValue('field.last_name');
                const user_id = interaction.fields.getTextInputValue('field.user_id');

                await Pterodactyl.ManageUser(user_id, username, email, first_name, last_name).then(async (res) => {
                    interaction.reply({
                        embeds: [{
                            color: Colors.Green,
                            description: `L'utilisateur à bien été modifié : ${email}`
                        }],
                        ephemeral: true
                    })
                })
                break;
            }
        }
    }
    }
}