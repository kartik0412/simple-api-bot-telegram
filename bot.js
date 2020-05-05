const dogbreeds = require("./dogbreeds");
const axios = require("axios");
const { Telegraf } = require("telegraf");
const bot = new Telegraf("1210345734:AAFHKnovA8xRixyUezp-r4OhYxOhuHSc7Zw");

const startMessage = `/fortune - _get fortune cookie quote_
/cat - _get random cat pic_
/cat \`<text>\` - _get cat image with text_
/dogbreeds - _get list of dogbreeds_
/dog \`<breed>\` - _get image of dog breed_`;

bot.start((ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "*Simple API Bot*\n" + startMessage, {
        parse_mode: "Markdown",
    });
});

bot.help((ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        parse_mode: "Markdown",
    });
});

bot.command("fortune", (ctx) => {
    axios
        .get("http://yerkee.com/api/fortune")
        .then((res) => res.data.fortune)
        .then((res) => ctx.reply(res))
        .catch((e) => console.log(e));
});

bot.command("cat", (ctx) => {
    let input = ctx.message.text.split(" ");
    if (input.length === 1) {
        bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
        axios
            .get("http://aws.random.cat/meow")
            .then((res) => ctx.replyWithPhoto(res.data.file))
            .catch((e) => console.log(e));
    } else {
        input.shift();
        input = input.join(" ");
        bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
        ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
    }
});

bot.command("dogbreeds", (ctx) => {
    let res = "Dog Breeds : \n";
    dogbreeds.map((breed) => {
        res += `- ${breed}\n`;
    });
    ctx.reply(res);
});

bot.command("dog", (ctx) => {
    let input = ctx.message.text.split(" ");
    if (input.length !== 2) {
        ctx.reply("You must provide breed name.");
        return;
    }
    let breedname = input[1].toLowerCase();
    if (dogbreeds.includes(breedname)) {
        bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
        axios
            .get(`https://dog.ceo/api/breed/${breedname}/images/random`)
            .then((res) => ctx.replyWithPhoto(res.data.message))
            .catch((e) => console.log(e));
    } else {
        let item = dogbreeds.filter((breed) => {
            return breed.startsWith(breedname);
        });
        if (item.length === 0) {
            ctx.reply("Cannot find breed");
        } else {
            let res = "Did you mean :\n";
            item.map((i) => {
                res += `- ${i}\n`;
            });
            ctx.reply(res);
        }
    }
});

bot.launch();
