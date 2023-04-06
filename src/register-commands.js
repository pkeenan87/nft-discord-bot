const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')
require('dotenv').config()

const commands = [
  {
    name: 'floor',
    description: 'Returns the floor price for a collection',
    options: [
      {
        name: 'collection',
        description: 'The opensea slug for the collection.',
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },
  {
    name: 'collection-stats',
    description: 'Returns key trading statistics for a collection',
    options: [
      {
        name: 'collection',
        description: 'The opensea slug for the collection.',
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },
  {
    name: 'asset-traits',
    description: 'Returns key trading statistics for a collection',
    options: [
      {
        name: 'collection',
        description: 'The opensea slug for the collection.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'token-id',
        description: 'The Token ID of the asset.',
        type: ApplicationCommandOptionType.Number,
        required: true,
      }
    ]
  },
  // {
  //   name: 'add',
  //   description: 'Adds two numbers',
  //   options: [
  //     {
  //       name: 'first-number',
  //       description: 'The first number.',
  //       type: ApplicationCommandOptionType.Number,
  //       choices: [
  //         {
  //           name: 'one',
  //           value: 1
  //         },
  //         {
  //           name: 'two',
  //           value: 2
  //         },
  //         {
  //           name: 'three',
  //           value: 3
  //         }
  //       ],
  //       required: true,
  //     },
  //     {
  //       name: 'second-number',
  //       description: 'The second number.',
  //       type: ApplicationCommandOptionType.Number,
  //       required: true,
  //     }
  //   ]
  // },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...')
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    )

    console.log('Slash commands registered successfully')
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
})()