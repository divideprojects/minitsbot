import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import {
    Bot,
    GrammyError,
    HttpError,
    webhookCallback,
} from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { apiThrottler } from "https://deno.land/x/grammy_transformer_throttler@v1.1.2/mod.ts";

const TOKEN = String(Deno.env.get("TOKEN"));
const vport = Number(Deno.env.get("PORT"));
const bot = new Bot(TOKEN);
bot.api.config.use(apiThrottler());
const handleUpdate = webhookCallback(bot, "std/http");

bot.command("start", async (ctx) => {
    if (ctx.chat.type === "private") {
        return await ctx.reply(
            "Welcome! just add me in any chat with delete and invite permission and i will do the rest.",
        );
    } else {
        return await ctx.reply("I'm alive!");
    }
});
bot.on("message", async (ctx) => {
    if (ctx.from.id === 136817688 && ctx.chat.type === "supergroup") {
        return await ctx.deleteMessage();
    }
});
bot.on(
    "chat_join_request",
    async (ctx) => await ctx.approveChatJoinRequest(ctx.from.id),
);
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
serve({
    ["/" + TOKEN]: async (req) => {
        if (req.method == "POST") {
            try {
                return await handleUpdate(req);
            } catch (err) {
                console.error(err);
            }
        }
        return new Response();
    },
    "/": () => {
        return new Response("Ok!");
    },
}, { port: vport });
