const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
// const { MessageMedia } = require("whatsapp-web.js");

const { userChats, findChat, createChat, getLatestIdChatRoom, createNewChatRoom, createNewMemberChatRoom, checkMemberRoomChatAvailable } = require("../services/chat");
const fs = require('fs');
const path = require('path');

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
  // authStrategy: new LocalAuth(),
  // authStrategy: new LocalAuth({
  //   clientId: "main", // Optional ID to separate sessions for multiple clients
  //   // dataPath: './session.json'
  // }),
  // webVersion: '2.2410.1',
  // webVersionCache: {
  //   type: 'remote',
  //   remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
  // },
  // webVersionCache: {
  //   type: "remote",
  //   remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html",
  // },
  // di bawah ni pupperter yang terakhir 
  // puppeteer: { headless: true, args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process','--disable-gpu', ], },
  puppeteer: {
    // headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  }
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

const whatsAppClientControllerLama = async () => {
  console.log('test di controller wa client');
  
  return new Promise((resolve, reject) => {
    clients.initialize().catch((err) => reject(err));

    clients.on("qr", (qr) => {
      // console.log(qr);
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

const whatsAppClientController = async () => {

  return new Promise((resolve, reject) => {
    // Check if the client is already authenticated
    if (clients && clients.info && clients.info.wid) {
      console.log("Client is already active, skipping re-initialization.");
      return resolve("Client is already active");
    }

    // If not authenticated, proceed with initialization
    clients.initialize().catch((err) => reject(err));

    clients.on("qr", (qr) => {
      console.log("Please scan the QR code to authenticate.");
      resolve(qr);  // Send the QR code to the handler if needed
    });

    clients.on('loading_screen', async (percent, message) => {
      console.log(`Loading: ${percent}% - ${message}`);
    });

    clients.on("ready", () => {
      console.log("Client is ready!");
      resolve("Client is ready");
    });

    clients.on('authenticated', () => {
      console.log('Authenticated!');
    });

    clients.on('auth_failure', (msg) => {
      console.error('Auth failure:', msg);
      setTimeout(startClient, 5000); // Restart dalam 5 detik
    });

    clients.on('disconnected', (reason) => {
      console.log('Disconnected:', reason);
      setTimeout(startClient, 5000); // Restart dalam 5 detik
    });

    // clients.on("message", async (msg) => {
    //   try {
    //     if (msg.from !== "status@broadcast") {
    //       const contact = await msg.getContact();
    //       console.log("Message from:", contact, msg.from);
    //     }
    //   } catch (error) {
    //     console.error("Error handling message:", error);
    //   }
    // });
  });
};


const sendMessage = async (params) => {
  // params.phone = '6285274953262'
  params.phone = '6283152073998';
  console.log(params);
  
  try {
    const { phone, package_id, request_date, check_in, total_people, total_price, deposit, note, id, package_name, user_name } = params;

  // Format pesan secara dinamis menggunakan data dari params
  const message = `Hello ${user_name}, your booking for the ${package_name} Package (Package ID: ${package_id}) has been successfully placed. Here are the details:

  - Booking Reference: ${id}
  - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
  - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
  - Total People: ${total_people}
  - Total Price: ${total_price.toLocaleString()} IDR
  - Deposit Paid: ${deposit.toLocaleString()} IDR
  - Notes: ${note || 'No additional notes'}

  Please waiting until admin confirmation your reservation We look forward to having you on the tour!

  For any inquiries, feel free to contact us or visit http://localhost:3001/reservation/${id} .`;

  // Kirim pesan ke nomor yang ada di params 6281270429177
  // clients.sendMessage(`${phone}@c.us`, message);
  console.log('ini di client info',clients.info);
  
  if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      // clients.on('ready', () => {
      //   clients.sendMessage(`${phone}@c.us`, message);
      // })
    }
  } catch (error) {
    console.error('Error sending message:', error);

    // Periksa apakah error berasal dari Puppeteer dengan WidFactory
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // await whatsAppClientController(); // Restart WA client
    } else {
      console.error("Other error encountered:", error);
    }
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

const sendMessageConfirmationDate = async (params) => {
  // params.phone = '6285274953262';
  params.phone = '6283152073998';
  console.log(params);

  try {
    const { phone, request_date, check_in, total_people, total_price, deposit, note, id, user_name, name } = params;

    // Dynamically format the message using data from params
    const message = `Hello, your booking for the ${name} Package has been confirmed by Admin! Here are the details:

    - Booking Reference: ${id}
    - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please proceed with the down payment (DP) to continue your reservation. For any inquiries, feel free to contact us or visit http://localhost:3001/reservation/${id}.

    We look forward to welcoming you on the tour!`;

    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }

  } catch (error) {
    console.error('Error sending message:', error);

    // Check if error is from Puppeteer with WidFactory
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // await whatsAppClientController(); // Restart WA client
    } else {
      console.error("Other error encountered:", error);
    }
  }
};

const sendMessageConfirmationDP = async (params) => {
  // params.phone = '6285274953262';
  params.phone = '6283152073998';
  console.log(params);

  try {
    const { phone, id, total_price, deposit, fullname, email, package_id, name, request_date, check_in, transaction_time } = params;

    // Dynamically format the message using data from params
    const message = `Hello ${fullname}, we have successfully received your down payment (IDR ${deposit.toLocaleString()}) on ${transaction_time} for the ${name} Package! Here are your booking details:

    - Booking Reference: ${id}
    - Package ID: ${package_id}
    - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total Package Price: ${total_price.toLocaleString()} IDR

    Please complete the remaining payment within the next 24 hours to secure your reservation. For any inquiries, feel free to reach us or view your reservation details at http://localhost:3001/reservation/${id}.

    Thank you, and we look forward to your visit!`;
    // console.log('ini di client info',clients.info);
    // clients.sendMessage(`${phone}@c.us`, message);
    // Send message to the provided phone number
    // clients.on('ready', async () => {
    //   clients.sendMessage(`${phone}@c.us`, message);
    // })
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }
  } catch (error) {
    console.error('Error sending message:', error);

    // Check if error is from Puppeteer with WidFactory
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // await whatsAppClientController(); // Restart WA client
    } else {
      console.error("Other error encountered:", error);
    }
  }
};

const sendMessageConfirmationFP = async (params) => {
  // params.phone = '6285274953262';
  params.phone = '6283152073998';
  console.log(params);

  try {
    const { phone, request_date, check_in, total_people, total_price, deposit, note, id, user_name, name } = params;

    // Dynamically format the message using data from params
    const message = `Hello ${user_name}, the reservation process is done, here the details:

    - Booking Reference: ${id}
    - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    For any inquiries, feel free to contact us or visit http://localhost:3001/reservation/${id}.

    We look forward to welcoming you on the tour. Thank you!`;
    // clients.sendMessage(`${phone}@c.us`, message);

    // Send message to the provided phone number
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   // clients.sendMessage(`${phone}@c.us`, message);
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // await sendMessageConfirmationDP(params);
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }
  } catch (error) {
    console.error('Error sending message:', error);

    // Check if error is from Puppeteer with WidFactory
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // await whatsAppClientController(); // Restart WA client
    } else {
      console.error("Other error encountered:", error);
    }
  }
};

const sendMessagePaymentReferral = async (params) => {
  // phone = '6285274953262';
  params.phone = '6283152073998';
  // console.log(params);

  try {
    // const { phone, request_date, check_in, total_people, total_price, deposit, note, id, user_name, name } = params;

    // Dynamically format the message using data from params
    const message = `Hello, Admin have been put the proof of referral please check you referral account
    for confirmation`;
    // clients.sendMessage(`${phone}@c.us`, message);

    // Send message to the provided phone number
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   // clients.sendMessage(`${phone}@c.us`, message);
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // await sendMessageConfirmationDP(params);
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    if (clients.info === undefined){
      console.log('the system is not ready yet');
      }
      else{
        // client.sendMessage(phn, msg);
        clients.sendMessage(`${phone}@c.us`, message);
        // Send message to the provided phone number
        clients.on('ready', () => {
          clients.sendMessage(`${phone}@c.us`, message);
        })
      }
  } catch (error) {
    console.error('Error sending message:', error);

    // Check if error is from Puppeteer with WidFactory
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // await whatsAppClientController(); // Restart WA client
    } else {
      console.error("Other error encountered:", error);
    }
  }
};

const adminSendMessageReservation = async(params) => {
  // Pastikan params sudah ada data nomor teleponnya
  if (!params.phone) {
    console.error('Phone number is missing');
    return;
  }

  console.log(params);

  try {
    const { phone, package_id, request_date, check_in, total_people, total_price, deposit, note, id } = params;

    // Format pesan secara dinamis menggunakan data dari params
    const message = `Hello Admin, a new booking has been placed for the Jelajah Talao Tour Package (Package ID: ${package_id}). Please review the details below and confirm the reservation:

    - Booking Reference: ${id}
    - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please confirm the reservation and proceed with the necessary actions.

    For any inquiries, please visit the reservation page: http://localhost:3001/reservation/${id}`;

    // Mengecek jika client WhatsApp sudah siap
    if (clients.info === undefined) {
      console.log('The system is not ready yet, retrying...');
      // Bisa tambahkan retry di sini jika perlu menunggu client siap
      return;
    } else {
      // Kirim pesan ke nomor admin
      clients.sendMessage(`${phone}@c.us`, message);
      console.log(`Message sent to ${phone}@c.us`);
    }
  } catch (error) {
    console.error('Error sending message:', error);

    // Periksa apakah error berasal dari Puppeteer dengan WidFactory
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // Implementasi untuk restart client WhatsApp jika diperlukan
    } else {
      console.error("Other error encountered:", error);
    }
  }
};

const adminSendMessageDepositReservation = async(params) => {
  try {
    console.log('di adminSendMessageDepositReservation', params);
    
    const { phone, transaction_time, order_id, gross_amount } = params;

    // Format pesan secara dinamis menggunakan data dari params
    const message = `Hello Admin, a new deposit has been successfully paid for a reservation. Here are the details:

    - Booking Reference: ${order_id}
    - Payment Date: ${transaction_time}
    - Paid: ${gross_amount} IDR

    The customer has made the deposit payment. Please review and proceed with the next steps.

    For further inquiries, visit the reservation page: http://localhost:3001/reservation/${order_id}

    Thank you for your attention!`;
    // const message = `Hello Admin, a new deposit has been successfully paid for a reservation. Here are the details:

    // The customer has made the deposit payment. Please review and proceed with the next steps.

    // Thank you for your attention!`;

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const adminSendMessageFPReservation = async(params) => {
  try {
    console.log('di adminSendMessageFPReservation', params);    
    
    // const { phone, request_date, check_in, total_people, total_price, deposit, note, order_id, user_name, name } = params;
    const { phone, transaction_time, order_id, gross_amount } = params;

    // Format pesan secara dinamis menggunakan data dari params
    const message = `Hello Admin, a new full payment has been successfully paid for a reservation. Here are the details:

    - Booking Reference: ${order_id}
    - Payment Date: ${transaction_time}
    - Paid: ${gross_amount} IDR

    Thank you for your attention!`;
    // const message = `Hello Admin, a new full payment has been successfully paid for a reservation. Here are the details:

    // Thank you for your attention!`;

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const adminSendMessageCancelReservation = async(params) => {
  try {
    console.log('di adminSendMessageCancelReservation');
    
    const { id, phone, date } = params

    const message = `Hello Admin, a new cancel reservation here are the details:

    - Booking Reference: ${id}
    - Booking Date: ${date}

    Thank you for your attention!`;

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const adminSendMessageCancelRefundReservation = async(params) => {
  try {
    console.log('di adminSendMessageCancelRefundReservation', params);
    
    const { id, refund_date, phone, account_refund, totalRefund } = params

    const message = `Hello Admin, customer have been cancel the reservataion here are the details for refund:

    - Booking Reference: ${id}
    - Booking Date: ${refund_date}
    - Account Refund: ${account_refund}
    - Total Refund: ${totalRefund}

    Thank you for your attention!`;

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      // clients.on('ready', () => {
      //   clients.sendMessage(`${phone}@c.us`, message);
      // })
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const customerSendMessageRefundProof = async(params) => {
  try {
    // params.phone = '6285274953262';
    params.phone = '6283152073998';
    const { id, refund_date, phone } = params

    const message = `Hello, Admin have been upload refund proof for your reservation. Please
    check to your refund account here are the details:

    - Booking Reference: ${id}
    - Refund Date: ${refund_date}

    Thank you for your attention!`;

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const adminSendMessageRefundConfirmation = async(params) => {
  try {
    const { phone, id, status } = params

    if (status == 1) {
      // Jika refund sukses
      message = `Hello Admin, the customer has successfully confirmed the refund. Here are the details:

      - Booking Reference: ${id}

      The refund process has been successfully completed.

      Thank you for your attention!`;
    } else {
      // Jika refund tidak berhasil (misalnya bukti refund salah)
      message = `Hello Admin, the customer attempted to confirm a refund, but the proof of refund is incorrect. Please check the details again. Here are the details:

      - Booking Reference: ${id}

      Please review the refund proof and take the necessary actions.

      Thank you for your attention!`;
    }

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const adminSendMessageReferralConfirmation = async(params) => {
  try {
    const { phone, id, status, datetime } = params

    if (status == 1) {
      // Jika refund sukses
      message = `Hello Admin, the customer has successfully confirmed the referral payment. Here are the details:

      - Booking Reference: ${id}
      - Date Confirmation: ${datetime}

      The referral payment process has been successfully completed.

      Thank you for your attention!`;
    } else {
      // Jika refund tidak berhasil (misalnya bukti refund salah)
      message = `Hello Admin, the customer attempted to confirm a refund, but the proof of referral is incorrect. Please check the details again. Here are the details:

      - Booking Reference: ${id}

      Please review the referral proof and take the necessary actions.

      Thank you for your attention!`;
    }

    // Kirim pesan ke nomor admin jika client WhatsApp sudah siap
    // clients.on('ready', async () => {
    //   console.log('Client is ready!');
    //   setTimeout(async () => {
    //     if (clients.isReady()) {
    //       try {
    //         // Send the message to the provided phone number
    //         clients.sendMessage(`${phone}@c.us`, message);
    //         console.log("Message sent successfully.");
    //       } catch (error) {
    //         console.error('Failed to send message:', error);
    //       }
    //     } else {
    //       console.log("Client still synchronizing messages. Retrying...");
    //     }
    //   }, 3000); // Delay for 3 seconds
    // });
    console.log('ini di client info',clients.info);
    if (clients.info === undefined){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      clients.sendMessage(`${phone}@c.us`, message);
      // Send message to the provided phone number
      clients.on('ready', () => {
        clients.sendMessage(`${phone}@c.us`, message);
      })
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const createRoomChatController = async(params) => {
  const check = await checkMemberRoomChatAvailable(params)
  console.log(check, 'di check mah');
  
  if (check) {
    return check
  }
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
  whatsAppClientControllerLamaaa,
  sendMessageConfirmationDate,
  sendMessageConfirmationDP,
  sendMessageConfirmationFP,
  sendMessagePaymentReferral,
  adminSendMessageReservation,
  adminSendMessageDepositReservation,
  adminSendMessageFPReservation,
  adminSendMessageCancelReservation,
  adminSendMessageCancelRefundReservation,
  customerSendMessageRefundProof,
  adminSendMessageRefundConfirmation,
  adminSendMessageReferralConfirmation,
};
