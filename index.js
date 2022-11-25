const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./WPTagAll",
  }),
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});

client.on("qr", (qr) => {
  console.log("Generating QR Code...");
  console.log("QR RECEIVED", qr);
  console.log(qrcode.generate(qr, { small: true }));
  client.new = true;
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  console.log("AUTHENTICATED.");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// Mention everyone
client.on("message_create", async (msg) => {
  if (msg.body === "!everyone") {
    const chat = await msg.getChat();

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
    await msg.delete();
    
  }
});

client.initialize();
