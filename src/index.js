const { Client, IntentsBitField, EmbedBuilder } = require('discord.js')
const axios = require('axios');
require('dotenv').config()

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

const config = {
  headers: {
    "X-API-KEY": process.env.OPENSEA_KEY,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
    "referrer": "https://api.opensea.io/api/v1/assets"
  }
};


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,

  ]
})

client.on('ready', (c) => {
  console.log('Beep! Boop! Online')
  console.log(`${c.user.tag} is online`)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  console.log(interaction.commandName)

  // Real Commands
  if (interaction.commandName === 'collection-stats') {
    const slug = interaction.options.get('collection').value


    try {
      const response = await axios.get(`https://api.opensea.io/collection/${slug}`, config)
      const rounded = roundToTwo(response.data.collection.stats.total_volume)

      const statsEmbed = new EmbedBuilder()
        .setTitle(`${response.data.collection.name}`)
        .setDescription(`${response.data.collection.description}`)
        .setColor('Random')
        .setImage(`${response.data.collection.image_url}`)
        .addFields(
          {
            name: 'Total Volume',
            value: `${rounded}`,
            inline: true,
          },
          {
            name: 'Floor Price',
            value: `${response.data.collection.stats.floor_price}`,
            inline: true,
          }
        )

      interaction.reply({ embeds: [statsEmbed] })
    } catch (error) {
      console.log(error)
      interaction.reply(`Oh No! Something went wrong! Please double check that the collection slug is correct: ${slug}`)
    }

  }

  if (interaction.commandName === 'asset-traits') {
    const slug = interaction.options.get('collection').value
    const tokenId = interaction.options.get('token-id').value

    try {
      const response = await axios.get(`https://api.opensea.io/collection/${slug}`, config)
      const contractAddress = response.data.collection.primary_asset_contracts[0].address
      const tokenTraitsData = await axios.get(`https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`, config)
      // console.log(tokenTraitsData.data.traits)
      let fieldsArr = []

      for (const val of tokenTraitsData.data.traits) {
        let newObj = {}
        newObj.name = val.trait_type
        newObj.value = val.value
        newObj.inline = true
        fieldsArr.push(newObj)
      }

      console.log(...fieldsArr)
      // interaction.reply('Testing...')

      const statsEmbed = new EmbedBuilder()
        .setTitle(`${tokenTraitsData.data.name}`)
        .setDescription(`${response.data.collection.description}`)
        .setColor('Random')
        .setImage(`${tokenTraitsData.data.image_url}`)
        .addFields(
          ...fieldsArr
        )

      interaction.reply({ embeds: [statsEmbed] })
    } catch (error) {
      console.log(error)
      interaction.reply(`Oh No! Something went wrong! Please double check that the collection slug and token ID are correct: Collection Slug=${slug} Token ID=${tokenId}`)
    }

  }

  if (interaction.commandName === 'floor') {
    const slug = interaction.options.get('collection').value

    try {
      const response = await axios.get(`https://api.opensea.io/collection/${slug}`, config)
      console.log(response)
      // console.log(response.data.collection.stats.floor_price)
      const floorEmbed = new EmbedBuilder()
        .setTitle(`${response.data.collection.name}`)
        .setDescription(`${response.data.collection.description}`)
        .setColor('Random')
        .setImage(`${response.data.collection.image_url}`)
        .addFields(
          {
            name: 'Floor Price',
            value: `${response.data.collection.stats.floor_price}`,
            inline: true
          },

        )

      interaction.reply({ embeds: [floorEmbed] })
    } catch (error) {
      console.log(error)
      interaction.reply(`Oh No! Something went wrong! Please double check that the collection slug is correct: ${slug}`)
    }

  }
})

client.login(process.env.TOKEN)

