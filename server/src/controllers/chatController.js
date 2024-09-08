const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");

const { userChats, findChat, createChat, getLatestIdChatRoom, createNewChatRoom, createNewMemberChatRoom } = require("../services/chat");

const createChatController = async (params) => {
  return await createChat(params);
};

const userChatsController = async (params) => {
  return await userChats(params);
};

const findChatController = async (params) => {
  return await findChat(params);
};

// const clients = {};
const clients = new Client({
  // webVersion: '2.2306.7',
  // webVersionCache: { type: 'none' },
  authStrategy: new LocalAuth({
    clientId: 0,
  }),
  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html",
  },
  // puppeteer: { 
  //   // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
  //   headless: true,
  // }
  // puppeteer: {
  //   args: [
  //     '--no-sandbox',
  //     '--disable-setuid-sandbox'
  //   ],
  //   headless: true,
  // }
});

const whatsAppClientControllerLamaaa = async () => {
  console.log('di controller lamaaa');
  
  // clients[0] = new Client({
  //   authStrategy: new LocalAuth({
  //     clientId: 0
  // }),
  //   webVersionCache: {
  //     type: "remote",
  //     remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.3.html`,
  //   },
  // });

  clients.initialize().catch((err) => console.log(err));

  clients.on("qr", (qr) => {
    console.log(qr);
    qrcode.generate(qr, { small: true });
  });

  clients.on("ready", () => console.log("Client is ready!"));

  // clients.on("message", async (msg) => {
  //   try {
  //     if (msg.from != "status@broadcast") {
  //       const contact = await msg.getContact();
  //       console.log(contact, msg.from);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
};

const whatsAppClientController = async () => {
  return new Promise((resolve, reject) => {
    clients.initialize().catch((err) => reject(err));

    clients.on("qr", (qr) => {
      console.log(qr);
      resolve(qr);  // Mengirimkan QR code ke handler
    });

    clients.on("ready", () => console.log("Client is ready!"));

    clients.on("message", async (msg) => {
      try {
        if (msg.from != "status@broadcast") {
          const contact = await msg.getContact();
          console.log(contact, msg.from);
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const sendMessage = async (phoneNumber, message) => {
  const messages = [
    "test",
    // Tambahkan pesan lain sesuai kebutuhan
  ];
  try {
    clients.sendMessage(`6281270429177@c.us`, 'test message');
    // for (let i = 0; i < 50; i++) {
    //   const randomIndex = Math.floor(Math.random() * messages.length);
    //   const randomMessage = messages[randomIndex];
    //   clients.sendMessage(`6281270429177@c.us`, randomMessage);
    //   // console.log(`Message ${i+1} sent.`);
    //   // Tambahkan penundaan untuk menghindari pemblokiran atau penundaan antar pesan
    //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Tunggu 1 detik sebelum mengirim pesan berikutnya
    // }
  } catch (error) {
    await whatsAppClientController();
  }

  // if (file) {
  //   const messageFile = new MessageMedia(
  //     file.mimetype,
  //     file.buffer.toString("base64")
  //   );
  //   clients[Number(clientId)].sendMessage(phoneNumber, messageFile);
  // } else {
  //   clients[0].sendMessage(phoneNumber, message);
  // }
};

const createRoomChatController = async(params) => {
  const { max_id_number } = await getLatestIdChatRoom()
  const id = max_id_number+1
  const idChatRoom = `C${id.toString().padStart(4, '0')}`;

  const data = {
    idChatRoom: idChatRoom,
    user_id: params.user_id,
    target_user_id: params.target_user_id,
  }

  await createNewChatRoom(idChatRoom)
  await createNewMemberChatRoom(data)
  return idChatRoom;
}

module.exports = {
  createChatController,
  userChatsController,
  findChatController,
  whatsAppClientController,
  sendMessage,
  createRoomChatController,
  whatsAppClientControllerLamaaa
};
