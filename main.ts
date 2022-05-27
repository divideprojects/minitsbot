import "https://deno.land/x/dotenv/load.ts";
import { Bot, GrammyError, HttpError } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { run } from "https://deno.land/x/grammy_runner@v1.0.3/mod.ts";
import { apiThrottler } from "https://deno.land/x/grammy_transformer_throttler@v1.1.2/mod.ts";

const bot = new Bot(String(Deno.env.get("TOKEN")));
bot.api.config.use(apiThrottler());

bot.command("start", (ctx) => {
    if (ctx.chat.type === "private") {
        return ctx.reply("Welcome! just add me in any chat with ban, delete and invite permission and i will do the rest; By @Memers_Gallery")
    } else {
        return ctx.reply("I'm alive!")
    }
});
bot.on("message", async (ctx) => {
  if (ctx.message.text && ctx.message.text.startsWith("#group") && ctx.chat.type !== "private") {
      return await ctx.deleteMessage()
  };
  if (ctx.from.id === 136817688 && ctx.chat.type === "supergroup") {
      console.log("kk")
      return await ctx.deleteMessage()
}});
bot.on("chat_join_request", (ctx) => ctx.approveChatJoinRequest(ctx.from.id));
bot.catch((err) => {
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

console.log("Started!");
run(bot);
