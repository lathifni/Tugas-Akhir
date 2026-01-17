let _baileysMod;
async function getBaileys() {
  if (!_baileysMod) _baileysMod = await import('@whiskeysockets/baileys');
  return _baileysMod;
}
const path = require('path');
const fs = require('fs-extra'); // Ganti ini
const pino = require('pino');

const { userChats, findChat, createChat, getLatestIdChatRoom, createNewChatRoom, createNewMemberChatRoom, checkMemberRoomChatAvailable } = require("../services/chat");

const AUTH_FOLDER =
  process.env.WA_AUTH_DIR
  // 2) Default: sejajar dgn `src` (2x naik dari controllers -> src -> server)
  || path.resolve(__dirname, '..', '..', 'auth-ta-bot');
fs.mkdirSync(AUTH_FOLDER, { recursive: true });
let sock = null;
let isInitializing = false;
let qrCode = null;  
let isWhatsAppReady = false; // Buat status global
// Configuration
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;
let retryCount = 0;
let selfName = null;
let hasAutoPingSent = false;

const toJid = (phone) =>
  /@s\.whatsapp\.net$/.test(phone) ? phone : `${phone}@s.whatsapp.net`

async function initWhatsAppClient() {
  if (isInitializing) return;
  isInitializing = true;
  retryCount++;

  try {
    // === dynamic import bailey's (ESM) ===
    const {
      default: makeWASocket,
      DisconnectReason,
      useMultiFileAuthState,
      fetchLatestBaileysVersion
    } = await getBaileys();

    // (opsional) kalau mau pakai Boom, load di sini juga:
    // const { Boom } = await getBoom();

    // --- lanjut kode kamu seperti sebelumnya ---
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
    const { version } = await fetchLatestBaileysVersion();

    const logger = pino({
       level: 'info', // <-- Ganti level di sini ('warn', 'error', 'silent')
       // Opsional: pino-pretty untuk format yang lebih bagus
       // transport: {
       //   target: 'pino-pretty',
       //   options: { colorize: true }
       // }
     });

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      keepAliveIntervalMs: 10000,
      logger: logger // <-- Masukkan logger yang sudah dibuat
    });

    // sock.ev.on('creds.update', saveCreds);
    sock.ev.on('creds.update', async (u) => {
          try {
        // update selfName kalau tersedia di update credential
        if (u?.me?.name) selfName = u.me.name;

        // simpan kredensial (useMultiFileAuthState memberikan saveCreds)
        await saveCreds();
      } catch (err) {
        console.error('Failed to save creds:', err);
        // optional: coba tulis ulang setelah delay kecil untuk recover
        setTimeout(() => {
          try { saveCreds(); } catch (e) { console.error('Retry saveCreds failed', e); }
        }, 500);
      }
    });
    
    if (!selfName && state?.creds?.me?.name) {
      selfName = state.creds.me.name;
    }

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      if (lastDisconnect?.error) {
        const err = lastDisconnect.error;
        console.error('Last disconnect error:', err?.message || err);
        if (err?.isBoom) {
          console.error('Boom output:', err.output);
        }
      }
      if (qr) {
        qrCode = qr;
        isWhatsAppReady = false;
      }

      if (connection === 'open') {
        console.log('Baileys: connection open');
        isWhatsAppReady = true;
        qrCode = null;
        retryCount = 0;
        
        const me = sock.authState.creds.me;
        if (me?.name) {
          selfName = me.name;
          console.log(`Nama berhasil didapat saat koneksi terbuka: ${selfName}`);
        }
        if (!hasAutoPingSent) {
          try {
            const targetJid = toJid('6283152073998');
            await sock.sendMessage(targetJid, {
              text: `Halo! (auto-login ping) ${new Date().toLocaleString('id-ID')}`
            });
            hasAutoPingSent = true;
          } catch (e) {
            console.error('Auto-ping failed:', e);
          }
        }
      }

      if (connection === 'close') {
        console.log('Baileys: connection closed');
        isWhatsAppReady = false;

        // Aman tanpa Boom: cek properti isBoom
        const ldErr = lastDisconnect?.error;
        const status = ldErr?.isBoom ? ldErr.output?.statusCode : undefined;

        if (status !== DisconnectReason.loggedOut) {
          scheduleRetry();
        } else {
          console.error('Baileys: Sesi tidak valid (Logged out). Membersihkan folder auth secara otomatis...');
          try {
            // Hapus folder auth secara sinkron
            fs.removeSync(AUTH_FOLDER);
            console.log('Folder auth berhasil dibersihkan. Coba sambungkan ulang...');
            retryCount = 0;
            hasAutoPingSent = false;
            
            initWhatsAppClient();
          } catch (err) {
            console.error('Gagal membersihkan folder auth:', err);
          }
        }
      }
    });
    sock.ev.on('messages.upsert', ({ messages, type }) => {
        if (type !== 'notify') return; 
        for (const m of messages) {
          // LOGGING DETAIL DI SINI
          if (m.key?.fromMe) {
            if (m.pushName) {
              selfName = m.pushName;
            }
          }
        }
    });

    // 2) sinkron nama dari event kontak (kalau WA kirim kontak diri kita)
    sock.ev.on('contacts.upsert', (arr) => {
      const me = sock.user?.id;
      for (const c of arr) {
        if (me && c.id === me) {
          selfName = c.name || c.notify || c.verifiedName || selfName;
        }
      }
    });
    sock.ev.on('contacts.update', (arr) => {
      const me = sock.user?.id;
      for (const c of arr) {
        if (me && c.id === me) {
          selfName = c.name || c.notify || c.verifiedName || selfName;
        }
      }
    });

    console.log('Baileys: initializing...');
  } catch (error) {
    console.error('Initialization error:', error);
    scheduleRetry();
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

const whatsAppClientController = async () => {
  try {
    if (!sock) {
      await initWhatsAppClient()
    }

    if (qrCode) {      
      return {
        status: 'waiting_for_qr',
        qr: qrCode,
        message: 'Silakan scan QR code untuk login',
      }
    }

    if (isWhatsAppReady && sock?.user?.id) {
      const jid = sock.user.id
      const number = jid.replace(/:.*@.*/, '').replace(/@.*/, '') // buang suffix
      const finalName = 
          sock.user?.verifiedName ||  // 1. Paling akurat, biasanya nama profil resmi/bisnis
          sock.user?.name ||          // 2. Nama yang ditampilkan di WhatsApp
          sock.authState?.creds?.me?.name || // 3. Nama dari file sesi/kredensial
          selfName ||                 // 4. Fallback ke variabel global dari event
          null;                       // 5. Jika semua gagal, hasilnya null

      const userInfo = {
          number,
          name: finalName,
      };
      return {
        status: 'connected',
        data: userInfo,
        message: 'WhatsApp client aktif (Baileys)',
      }
    }

    return {
      status: 'initializing',
      message: 'Sedang memulai WhatsApp (Baileys)...',
    }
  } catch (error) {
    console.error('Handler error:', error)
    return { status: 'error', message: error.message }
  }
}

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
  // params.phone = '6283152073998'

  try {
    const {
      phone, request_date, check_in, total_people,
      total_price, deposit, note, id, package_name, user_name
    } = params
    console.log(params, 'ini adalah params sendMessage');
    

    const message = `Hello ${user_name}, your reservation for the ${package_name} Package has been successfully placed. Here are the details:

    - Reservation Reference: ${id}
    - Reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please waiting until admin confirmation your reservation We look forward to having you on the tour! Thank you for your attention.`

    if (!isWhatsAppReady || !sock) {
      console.log('the system is not ready yet')
      return
    }

    const jid = toJid(phone) // ==> 628xx@s.whatsapp.net
    await sock.sendMessage(jid, { text: message })
    console.log(`Message sent to ${jid} di sendMessage`)
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const sendMessageAfterBookingHomestay = async (params, selectedHomestays) => {
  try {
    const homestayDetails = selectedHomestays.map(h => 
      `    - ${h.name}${h.nama_unit}-${h.unit_number} (Capacity: ${h.capacity} people, Price: ${h.price.toLocaleString('id-ID')} IDR)`
    ).join('\n')

    const { phone, package_id, request_date, check_in, total_people, total_price, deposit, note, id, name, user_name } = params

    const message = `Hello ${user_name}, your booking for the ${name} Package (Package ID: ${package_id}) has been successfully updated. Here are the details:

    - Reservation Reference: ${id}
    - Reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    Booked Homestays:
${homestayDetails}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please waiting until admin confirmation your reservation We look forward to having you on the tour!`

    if (!isWhatsAppReady || !sock) {
      console.log('the system is not ready yet')
      return
    }

    const jid = toJid(phone)
    await sock.sendMessage(jid, { text: message })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const sendMessageConfirmationDate = async (params) => {
  // params.phone = '6285274953262';
  params.phone = '6283152073998';

  try {
    const { phone, request_date, check_in, total_people, total_price, deposit, note, id, user_name, name } = params

    const message = `Hello ${user_name}, your reservation for the ${name} Package has been confirmed by Admin! Here are the details:

    - Reservation Reference: ${id}
    - Reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please proceed with the down payment (DP) to continue your reservation.

    We look forward to welcoming you on the tour! Thank you for your attention.`

    if (!isWhatsAppReady || !sock) {
      console.log('the system is not ready yet')
      return
    }

    const jid = toJid(phone)
    await sock.sendMessage(jid, { text: message })
    console.log('di sendMessageConfirmationDate')
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const sendMessageConfirmationDP = async (params) => {
  // params.phone = '6283152073998'; // Tetap biarkan untuk testing jika perlu

  try {
    const { phone, id, total_price, deposit, fullname, package_id, name, request_date, check_in, paymentDate } = params;
    console.log('ini di sendMessageConfirmationDP', params);
    

    // const message = `Hello ${fullname}, we have successfully received your down payment (IDR ${deposit.toLocaleString()}) on ${new Date(transaction_time).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} for the ${name} Package! Here are your booking details:
    const message = `Hello ${fullname}, we have successfully received your down payment (IDR${deposit.toLocaleString()}) on ${paymentDate} for the ${name} Package! Here are your booking details:

    - Reservation Reference: ${id}
    - Package ID: ${package_id}
    - Reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total Package Price: ${total_price.toLocaleString()} IDR

    Please complete the remaining full payment to secure your reservation.

    Thank you for your attention, and we look forward to your visit!`;

    // 1. Ganti pengecekan kesiapan dengan yang konsisten
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return; // Hentikan fungsi jika belum siap
    }

    // 2. Gunakan helper `toJid` untuk format nomor
    const jid = toJid(phone);

    // 3. Kirim pesan menggunakan format Baileys (`sock`)
    await sock.sendMessage(jid, { text: message });
    console.log('Pesan konfirmasi DP berhasil dikirim ke', jid);

  } catch (error) {
    // 4. Sederhanakan penanganan error
    console.error('Error sending DP confirmation message:', error);
  }
};

const sendMessageConfirmationFP = async (params) => {
  // params.phone = '6283152073998'; // Tetap biarkan untuk testing jika perlu

  try {
    const { phone, request_date, check_in, total_people, total_price, deposit, note, id, fullname, name } = params;
    console.log('sendMessageConfirmationFP', params);
    

    const message = `Hello ${fullname}, your reservation is fully paid and confirmed! Here are the final details:

    - reservation Reference: ${id}
    - reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Total Paid: ${total_price.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    We look forward to welcoming you on the tour. Thank you for your attention!`;

    // 1. Ganti pengecekan kesiapan dengan yang konsisten
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return; // Hentikan fungsi jika belum siap
    }

    // 2. Gunakan helper `toJid` untuk format nomor
    const jid = toJid(phone);

    // 3. Kirim pesan menggunakan format Baileys (`sock`)
    await sock.sendMessage(jid, { text: message });
    console.log('Pesan konfirmasi lunas (FP) berhasil dikirim ke', jid);

  } catch (error) {
    // 4. Sederhanakan penanganan error
    console.error('Error sending FP confirmation message:', error);
  }
};

const sendMessagePaymentReferral = async (params) => {
  // params.phone = '6283152073998'; // Tetap biarkan untuk testing jika perlu

  try {
    const { phone } = params;

    const message = `Hello, Admin has uploaded proof of referral payment. Please check your referral account for confirmation.`;

    // 1. Ganti pengecekan kesiapan dengan yang konsisten
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return; // Hentikan fungsi jika belum siap
    }

    // 2. Gunakan helper `toJid` untuk format nomor
    const jid = toJid(phone);

    // 3. Kirim pesan menggunakan format Baileys (`sock`)
    await sock.sendMessage(jid, { text: message });
    console.log('Pesan notifikasi pembayaran referral berhasil dikirim ke', jid);

  } catch (error) {
    // 4. Sederhanakan penanganan error
    console.error('Error sending referral payment message:', error);
  }
};

const adminSendMessageReservation = async (params) => {
  // Pastikan params sudah ada data nomor teleponnya
  if (!params.phone) {
    console.error('Phone number is missing in params for admin notification');
    return;
  }

  try {
    const { phone, package_id, request_date, check_in, total_people, total_price, deposit, note, id, package_name, user_name } = params;
    console.log(params);
    

    // Format pesan secara dinamis menggunakan data dari params
    const message = `Hello Admin, a new reservation has been made for the ${package_name} Package (Package ID: ${package_id}). Please review the details below and confirm the reservation:

    - Reservation Reference: ${id}
    - Username: ${user_name}
    - Reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    - Total Price: ${total_price.toLocaleString()} IDR
    - Deposit Paid: ${deposit.toLocaleString()} IDR
    - Notes: ${note || 'No additional notes'}

    Please confirm the reservation and proceed with the necessary actions. Thank you for your attention. `;

    // 1. Ganti pengecekan kesiapan dengan yang konsisten
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return; // Hentikan fungsi jika belum siap
    }

    // 2. Gunakan helper `toJid` untuk format nomor
    const jid = toJid(phone);

    // 3. Kirim pesan menggunakan format Baileys (`sock`)
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification sent to ${jid}`);

  } catch (error) {
    // 4. Sederhanakan penanganan error
    console.error('Error sending admin notification message:', error);
  }
};

const adminSendMessageDepositReservation = async (params) => {
  try {
    const { phone, transaction_time, order_id, gross_amount } = params;

    const message = `Hello Admin, a new deposit has been successfully paid for a reservation. Here are the details:

    - Reservation Reference: ${order_id}
    - Payment Date: ${new Date(transaction_time).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Paid: ${gross_amount.toLocaleString('id-ID')} IDR

    The customer has made the deposit payment. Please review and proceed with the next steps.`;

    // 1. Ganti pengecekan kesiapan dengan yang konsisten
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    // 2. Gunakan helper `toJid` untuk format nomor
    const jid = toJid(phone);

    // 3. Kirim pesan menggunakan format Baileys (`sock`)
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for deposit sent to ${jid}`);

  } catch (error) {
    // 4. Sederhanakan penanganan error
    console.error('Error sending admin deposit notification:', error);
  }
};

const adminSendMessageAfterBookingHomestay = async (params, selectedHomestays) => {
  try {
    const homestayDetails = selectedHomestays.map(homestay => 
      `    - ${homestay.name}${homestay.nama_unit}-${homestay.unit_number} (Capacity: ${homestay.capacity}, Price: ${homestay.price.toLocaleString('id-ID')} IDR)`
    ).join('\n');
    
    const { phone, id, name, package_id, request_date, check_in, total_people, total_price, deposit, note } = params;

    const message = `Hello Admin, reservation for the ${name} Package (Package ID: ${package_id}) has been successfully updated. Here are the details:

    - Reservation Reference: ${id}
    - Reservation Date: ${new Date(request_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Check-in Date: ${new Date(check_in).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Total People: ${total_people}
    Booked Homestays:
${homestayDetails}
    - Total Price: ${total_price.toLocaleString('id-ID')} IDR
    - Deposit Paid: ${deposit.toLocaleString('id-ID')} IDR
    - Notes: ${note || 'No additional notes'}

    Thank you for your attention!`;

    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for homestay booking sent to ${jid}`);

  } catch (error) {
    console.error('Error sending admin homestay notification:', error);
  }
};

const adminSendMessageFPReservation = async (params) => {
  try {
    const { phone, transaction_time, order_id, gross_amount } = params;

    const message = `Hello Admin, a new full payment has been successfully paid for a reservation. Here are the details:

    - Reservation Reference: ${order_id}
    - Payment Date: ${new Date(transaction_time).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Paid: ${gross_amount.toLocaleString('id-ID')} IDR

    The reservation is now fully paid. Thank you for your attention!`;
    
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for full payment sent to ${jid}`);

  } catch (error) {
    console.error('Error sending admin full payment notification:', error);
  }
};

const adminSendMessageCancelReservation = async (params) => {
  try {
    const { id, phone, date } = params;

    const message = `Hello Admin, a reservation has been canceled. Here are the details:

    - Reservation Reference: ${id}
    - Cancellation Date: ${new Date(date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

    Please take note of this cancellation.`;
    
    // 1. Gunakan pengecekan kesiapan Baileys
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    // 2. Format JID dan kirim pesan
    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for cancellation sent to ${jid}`);

  } catch (error) {
    // 3. Sederhanakan error handling
    console.error('Error sending admin cancellation notification:', error);
  }
};

const adminSendMessageCancelRefundReservation = async (params) => {
  try {
    const { id, refund_date, phone, account_refund, refund_amount } = params;

    const message = `Hello Admin, a customer has canceled their reservation and requires a refund. Here are the details:

    - Reservation Reference: ${id}
    - Refund Request Date: ${new Date(refund_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Account for Refund: ${account_refund}
    - Total Refund Amount: ${refund_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}

    Please process the refund accordingly.`;

    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for refund sent to ${jid}`);

  } catch (error) {
    console.error('Error sending admin refund notification:', error);
  }
};

const customersSendMessageCancelRefundReservation = async (params) => {
  try {
    // params.phone = '6283152073998'; // Tetap biarkan untuk testing jika perlu
    console.log(params);
    
    const { id, refund_date, phone, account_refund, refund_amount, fullname } = params;

    const message = `Hello ${fullname}, your reservation has been successfully canceled. Here are the details for your refund:

    - Reservation Reference: ${id}
    - Cancellation Date: ${new Date(refund_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
    - Refund to Account: ${account_refund}
    - Total Refund: ${refund_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}

    Please wait while our team processes your refund. Thank you!`;

    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Customer notification for refund sent to ${jid}`);

  } catch (error) {
    console.error('Error sending customer refund notification:', error);
  }
};

const customerSendMessageRefundProof = async (params) => {
  try {
    console.log(params);
    
    // params.phone = '6283152073998'; // Tetap biarkan untuk testing jika perlu
    const { id, refund_date, phone } = params;

    const message = `Hello, the admin has uploaded proof of your refund. Please check your account. Here are the details:

    - Reservation Reference: ${id}
    - Refund Process Date: ${new Date(refund_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

    Thank you for your patience!`;

    // 1. Gunakan pengecekan kesiapan Baileys
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    // 2. Format JID dan kirim pesan
    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Customer notification for refund proof sent to ${jid}`);

  } catch (error) {
    // 3. Sederhanakan error handling
    console.error('Error sending customer refund proof notification:', error);
  }
};

const adminSendMessageRefundConfirmation = async (params) => {
  try {
    const { phone, id, status } = params;
    let message = ''; // Gunakan let karena nilainya akan diubah

    if (status == 1) {
      // Jika refund sukses dikonfirmasi customer
      message = `Hello Admin, the customer has successfully confirmed the refund.

      - Reservation Reference: ${id}

      The refund process is now complete.`;
    } else {
      // Jika refund ditolak customer
      message = `Hello Admin, the customer has rejected the refund proof for the following booking:

      - Reservation Reference: ${id}

      Please review the refund proof and take the necessary actions.`;
    }

    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for refund confirmation sent to ${jid}`);

  } catch (error) {
    console.error('Error sending admin refund confirmation:', error);
  }
};

const adminSendMessageReferralConfirmation = async (params) => {
  try {
    const { phone, id, status, datetime } = params;
    let message = ''; // Gunakan let karena nilainya akan diubah

    if (status == 1) {
      // Jika pembayaran referral sukses dikonfirmasi
      message = `Hello Admin, the user has successfully confirmed the referral payment.

      - Reservation Reference: ${id}
      - Confirmation Date: ${new Date(datetime).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

      The referral payment process is complete.`;
    } else {
      // Jika pembayaran referral ditolak
      message = `Hello Admin, the user has rejected the referral payment proof for the following booking:

      - Reservation Reference: ${id}

      Please review the proof and take necessary actions.`;
    }
    
    if (!isWhatsAppReady || !sock) {
      console.log('WhatsApp client (Baileys) is not ready yet');
      return;
    }

    const jid = toJid(phone);
    await sock.sendMessage(jid, { text: message });
    console.log(`Admin notification for referral confirmation sent to ${jid}`);

  } catch (error) {
    console.error('Error sending admin referral confirmation:', error);
  }
};

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

const checkWhatsAppNumber = async (phone) => {
  try {
    
    const jid = toJid(phone);
    const result = await sock.onWhatsApp(jid);
    return result?.[0]?.exists;
  } catch (error) {
    console.log(error);
    
  }
};

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
  whatsAppClientController,
  customersSendMessageCancelRefundReservation,
  sendMessageAfterBookingHomestay,
  adminSendMessageAfterBookingHomestay,
  checkWhatsAppNumber
};
