const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_TOKEN
const clientID = process.env.CLIENT_ID

client.once('clientReady', () => console.log('Silenced MC is online!'));

const cmd = (n, d, cfAdv) => {
  const c = new SlashCommandBuilder()
  c.setName(n)
  c.setDescription(d)
  if(cfAdv){
    const format = {
      user: "addUserOption",
      channel: "addChannelOption",
      role: "addRoleOption",
      string: "addStringOption",
      int: "addIntegerOption",
      bool: "addBooleanOption"
    }
    Object.keys(cfAdv).forEach(syn => {
      const method = format[syn]
      c[method](opt => {
        opt.setName(cfAdv[syn].name)
          .setDescription(cfAdv[syn].desc)
          .setRequired(cfAdv[syn].req);
        if(syn === "channel" && cfAdv[syn].types){
          opt.addChannelTypes(...cfAdv[syn].types)
        }
        return opt
      })
    })
  }
  return c.toJSON();
}

const commands = [
  cmd("ping", "replies with Pong!"),
  cmd("hey", "replies with random greetings"),
  cmd("test", "example arguments", {
    user: {
      name: "user_opt",
      desc: "Select a user",
      req: true
    },
    role: {
      name: "role_opt",
      desc: "Select a role",
      req: true
    },
    channel: {
      name: "ch_opt",
      desc: "Select a channel",
      req: true,
      types: [0,2,4,5]
    },
    int: {
      name: "int_opt",
      desc: "Type an integer",
      req: true
    },
    string: {
      name: "str_opt",
      desc: "Type a string",
      req: true
    },
    bool: {
      name: "bool_opt",
      desc: "Select a boolean",
      req: true
    }
  })
];

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  await rest.put(
    Routes.applicationCommands(clientID),
    { body: commands },
  );
})();

// Command handling
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmdname = interaction.commandName
  if (cmdname === 'ping') {
    await interaction.reply('Pong!');
  }else
  if (cmdname === "hey") {
    const greetings = ["Heyy wazzup", "Sheesh helloo", "Hii"]
    await interaction.reply(greetings[Math.floor(Math.random() * greetings.length)])
  }else
  if (cmdname === "test") {
    const opt = interaction.options
    const user = opt.getUser("user_opt")
    const channel = opt.getChannel("ch_opt")
    const role = opt.getRole("role_opt")
    const string = opt.getString("str_opt")
    const int = opt.getInteger("int_opt")
    const bool = opt.getBoolean("bool_opt")
    await interaction.reply(`User: ${user}\nChannel: ${channel}\nRole: ${role}\nString: ${string}\nInteger: ${int}\nBoolean: ${bool}`)
  }
});

client.login(token);