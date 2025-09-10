const { Client, LocalAuth } = require("whatsapp-web.js");

const { userChats, findChat, createChat, getLatestIdChatRoom, createNewChatRoom, createNewMemberChatRoom, checkMemberRoomChatAvailable } = require("../services/chat");

let client = null;
let isInitializing = false;
let qrCode = null;
let isWhatsAppReady = false; // Buat status global
// Configuration
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;
let retryCount = 0;

async function initWhatsAppClient() {
  if (isInitializing) return;
  isInitializing = true;
  retryCount++;

  try {
    // Hancurkan client lama jika ada
    if (client) {
      console.log('Destroying previous client instance');
      await client.destroy().catch(err => console.error('Error destroying client:', err))
      client = null;
    }

    // Buat client baru
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true  ,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',       // Mengurangi penggunaan shared memory
          '--disable-accelerated-2d-canvas', // Non-aktifkan hardware acceleration
          '--no-first-run',                // Lewati first-run Chrome
          '--no-zygote',                   // Matikan zygote process
          '--single-process'               // Mode single process
        ]
      }
    });

    // Setup event handlers
    client.on('qr', (qr) => {
      qrCode = qr;
      // qrcode.generate(qr);
    });

    client.on('ready', () => {
      console.log('Client is ready!');
      isWhatsAppReady = true; // Set status jadi ready
      qrCode = null; // Reset QR setelah ready
    });

    client.on('authenticated', () => {
      console.log('Authenticated!');
    });

    client.on('disconnected', async (reason) => {
      console.log('Client disconnected:', reason);
      isWhatsAppReady = false;
      await initWhatsAppClient(); // Auto-reconnect
    });

    client.on('auth_failure', (msg) => {
      console.error('Auth failure:', msg);
      isWhatsAppReady = false;
      setTimeout(initWhatsAppClient, 5000); // Retry setelah 5 detik
    });

    client.on('error', (err) => {
      isWhatsAppReady = false;
      console.error('Client error:', err);
      if (err.message.includes('WidFactory') || 
          err.message.includes('onQRChangedEvent')) {
        scheduleRetry();
      }
      scheduleRetry();
    });

    await client.initialize();
  } catch (error) {
    console.error('Initialization error:', error);
    setTimeout(initWhatsAppClient, 5000); // Retry setelah 5 detik
  } finally {
    isInitializing = false;
  }
}

function scheduleRetry() {
  if (retryCount >= MAX_RETRY_ATTEMPTS) {
    console.error(`Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached. Please check your connection.`);
    return;
  }

  const delay = RETRY_DELAY_MS * Math.pow(2, retryCount - 1); // Exponential backoff
  console.log(`Scheduling retry in ${delay/1000} seconds... (Attempt ${retryCount}/${MAX_RETRY_ATTEMPTS})`);
  
  setTimeout(() => {
    initWhatsAppClient();
  }, delay);
}

const whatsAppClientControllerTestBaru = async () => {
  try {
    if (!client) {
      await initWhatsAppClient(); // Inisialisasi jika belum
    }

    if (qrCode) {
      return {
        status: "waiting_for_qr",
        qr: qrCode,
        message: "Silakan scan QR code untuk login",
      };
    }

    if (client && client.info && client.info.wid) {
      const userInfo = {
        number: client.info.wid.user,
        name: client.info.pushname || null,
      };

      return {
        status: "connected",
        data: userInfo,
        message: "WhatsApp client aktif",
      };
    }

    return {
      status: "initializing",
      message: "Sedang memulai WhatsApp client...",
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

const createChatController = async (params) => {
  return await createChat(params);
};

const userChatsController = async (params) => {
  return await userChats(params);
};

const findChatController = async (params) => {
  return await findChat(params);
};

const sendMessage = async (params) => {
  // params.phone = '6285274953262'
  params.phone = '6283152073998';
  
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

    Please waiting until admin confirmation your reservation We look forward to having you on the tour!`;
  
  if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      await client.sendMessage(`${phone}@c.us`, message);
      console.log(`Message sent to ${phone}@c.us di sendMessage`);
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
};

const sendMessageAfterBookingHomestay = async(params, selectedHomestays) => {  
  try {
    const homestayDetails = selectedHomestays.map(homestay => {
        // Format string untuk setiap unit homestay
        return `    - ${homestay.name}${homestay.nama_unit}-${homestay.unit_number} (Capacity: ${homestay.capacity} people, Price: ${homestay.price.toLocaleString('id-ID')} IDR)`;
    }).join('\n');
    
    const { phone, package_id, request_date, check_in, total_people, total_price, deposit, note, id, name, user_name } = params;

  // Format pesan secara dinamis menggunakan data dari params
    const message = `Hello ${user_name}, your booking for the ${name} Package (Package ID: ${package_id}) has been successfully updated. Here are the details:

    - Booking Reference: ${id}
    - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    Booked Homestays:
      ${homestayDetails}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please waiting until admin confirmation your reservation We look forward to having you on the tour!`;
  
  if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      await client.sendMessage(`${phone}@c.us`, message);
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
}

const sendMessageConfirmationDate = async (params) => {
  // params.phone = '6285274953262';
  params.phone = '6283152073998';

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

    Please proceed with the down payment (DP) to continue your reservation.

    We look forward to welcoming you on the tour!`;

    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
      console.log('di sendMessageConfirmationDate');
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

    Please complete the remaining payment within the next 24 hours to secure your reservation.

    Thank you, and we look forward to your visit!`;
    console.log('ini di client info',client.info);
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
      console.log('di ');
      
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

    We look forward to welcoming you on the tour. Thank you!`;
    console.log('ini di client info',client.info);
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
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

  try {
    // const { phone, request_date, check_in, total_people, total_price, deposit, note, id, user_name, name } = params;

    // Dynamically format the message using data from params
    const message = `Hello, Admin have been put the proof of referral please check you referral account
    for confirmation`;
    if (client.info == undefined || client.info == null){
      console.log('the system is not ready yet');
      }
      else{
        // client.sendMessage(phn, msg);
        await client.sendMessage(`${phone}@c.us`, message);
        // Send message to the provided phone number
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

    Please confirm the reservation and proceed with the necessary actions.`;

    // Mengecek jika client WhatsApp sudah siap    
    if (client.info == undefined || client.info == null) {
      console.log('The system is not ready yet, retrying...');
      // Bisa tambahkan retry di sini jika perlu menunggu client siap
      return;
    } else {
      // Kirim pesan ke nomor admin
      await client.sendMessage(`${phone}@c.us`, message);
      console.log(`Message sent to ${phone}@c.us di adminSendMessageReservation`);
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

    Thank you for your attention!`;
    console.log('ini di client info',client.info);
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const adminSendMessageAfterBookingHomestay = async(params, selectedHomestays) => {
  try {
    const homestayDetails = selectedHomestays.map(homestay => {
      // Format string untuk setiap unit homestay
      return `    - ${homestay.name}${homestay.nama_unit}-${homestay.unit_number} (Capacity: ${homestay.capacity} people, Price: ${homestay.price.toLocaleString('id-ID')} IDR)`;
    }).join('\n');
    
    const { phone,id, name, package_id, request_date, check_in, total_people, total_price, deposit, note } = params;

    // Format pesan secara dinamis menggunakan data dari params
    const message = `Hello Admin, booking for the ${name} Package (Package ID: ${package_id}) has been successfully updated. Here are the details:

    - Booking Reference: ${id}
    - Booking Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    Booked Homestays:
      ${homestayDetails}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Thank you for your attention!`;
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
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
    
    console.log('ini di client info',client.info);
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
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
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const adminSendMessageCancelRefundReservation = async(params) => {
  try {
    console.log('di adminSendMessageCancelRefundReservation', params);
    
    const { id, refund_date, phone, account_refund, refund_amount } = params

    const message = `Hello Admin, customer have been cancel the reservation here are the details for refund:

    - Booking Reference: ${id}
    - Booking Date: ${refund_date}
    - Account Refund: ${account_refund}
    - Total Refund: Rp${refund_amount}

    Thank you for your attention!`;
    const clientState = await client.getState();

    if (clientState !== 'CONNECTED') {
      console.log(`Client not connected. Current state: ${clientState}`);
      return;
    }

    // ✅ Kirim pesan
    await client.sendMessage(`${phone}@c.us`, message);
  } catch (error) {
    console.error('Error:', error);
    if (error.message && error.message.includes('WidFactory')) {
      console.error("Error due to Puppeteer WidFactory issue. Restarting client.");
      // Implementasi untuk restart client WhatsApp jika diperlukan
    } else {
      console.error("Other error encountered:", error);
    }
  }
}

const customersSendMessageCancelRefundReservation = async(params) => {
  try {
    console.log('di customersSendMessageCancelRefundReservation', params);
    
    params.phone = '6283152073998';
    const { id, refund_date, phone, account_refund, refund_amount, fullname } = params

    const message = `Hello ${fullname}, you have been cancel the reservation here are the details for refund:

    - Booking Reference: ${id}
    - Booking Date: ${refund_date}
    - Account Refund: ${account_refund}
    - Total Refund: Rp${refund_amount}

    Thank you for your attention!`;
    const clientState = await client.getState();

    if (clientState !== 'CONNECTED') {
      console.log(`Client not connected. Current state: ${clientState}`);
      return;
    }

    // ✅ Kirim pesan
    await client.sendMessage(`${phone}@c.us`, message);
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
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
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
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
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
    if (client.info == undefined || client.info == null){
    console.log('the system is not ready yet');
    }
    else{
      // client.sendMessage(phn, msg);
      await client.sendMessage(`${phone}@c.us`, message);
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
  sendMessage,
  createRoomChatController,
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
  whatsAppClientControllerTestBaru,
  customersSendMessageCancelRefundReservation,
  sendMessageAfterBookingHomestay,
  adminSendMessageAfterBookingHomestay
};
