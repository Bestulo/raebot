// Import the required libraries
import { Bot } from "grammy";
import { RAE } from "rae-api";

// Initialize the RAE API
const rae = new RAE();

if (!process.env.BOT_TOKEN) {
  console.error("Please provide a BOT_TOKEN in the .env file");
  process.exit(1);
}
// Create a new bot instance with the token from the .env variable
const bot = new Bot(process.env.BOT_TOKEN);

// Helper function to get the definition of a word from RAE
async function getDefinition(word: string) {
  try {
    const search = await rae.searchWord(word);
    if (search.results.length === 0) {
      return `No encontré ${word} en el diccionario RAE`;
    } else {
      const wordIds = search.results.map((result) => result.id);
      const results = await Promise.all(
        wordIds.map((wordId) => rae.fetchWord(wordId))
      );
      const definitions = results.map((result) =>
        result.definitions.map((definition) => definition.content)
      );
      //   console.log(results.map((r) => r.definitions.map((d) => d.content)));
      return definitions.map((d) => d.join("\n")).join("\n\n");
    }
  } catch (error) {
    return `Error al buscar la palabra: ${error}`;
  }
}

// Configure the bot to respond to text messages
bot.on("message:text", async (ctx) => {
  const definition = await getDefinition(ctx.message.text);
  if (definition.length > 4096) {
    return ctx.reply(
      "La definición es demasiado larga para ser mostrada en un solo mensaje"
    );
  }
  if (definition.length === 0) {
    return ctx.reply(
      "La definición de la palabra no se encontró o hubo un error (redirección?)"
    );
  }
  if (typeof definition !== "string") {
    return ctx.reply(
      "No se encontró la definición de la palabra o hubo un error"
    );
  }
  const wordUrl = `https://dle.rae.es/${ctx.message.text}`;
  const definitionWithLink = `<a href="${wordUrl}">${ctx.message.text}</a>\n\n${definition}`;
  ctx.reply(definitionWithLink, {
    parse_mode: "HTML",
    link_preview_options: {
      is_disabled: true,
    },
  });
});

// Start the bot
bot.start();

console.log("Bot is running...");
