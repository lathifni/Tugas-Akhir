const moment = require('moment');
const PDFDocument = require('pdfkit');

const {
  getListReservationByUserId,
  getReservationById,
  getServiceByReservationId,
  getActivityByReservationId,
  getLatestIdReservation,
  createReservation,
  callbackRedirect,
  updateReservationInformation,
  getReservationAfterDeposit,
  updateAfterFullPaymentReservationInformation,
  allReservation,
  getReservationAndUserById,
  updateReservationConfirmation,
  newTotalByIdReservation,
  createReview,
  updateReservationStatusTimeout,
  updateManyReservationStatusTimeout,
  updatReservationConfirmationTimeout,
  refund,
  refundAdminProof,
  refundConfirmation,
  cancel,
  homestayUnitByReservationId,
  createReviewPackage,
  createReviewHomestay,
  deleteReservationById,
  deleteDetailReservationById,
} = require("../services/reservation");
const crypto = require("crypto");
const { bookingHomestay, bookedHomestay } = require('../services/homestay');
const { checkCodeReferralAfterDP, makeNewCodeReferralAfterDP } = require('../services/referral');
const { sendMessage, sendMessageConfirmationDate, sendMessageConfirmationDP, sendMessageConfirmationFP, adminSendMessageReservation, adminSendMessageDepositReservation, adminSendMessageFPReservation, adminSendMessageCancelReservation, customerSendMessageRefundProof, adminSendMessageRefundConfirmation, adminSendMessageCancelRefundReservation } = require('./chatController');
const { allPhoneAdmin } = require('../services/users');

const createReservationController = async (params) => {    
  const latestIdReservation = await getLatestIdReservation();
  let lastIdNumber = latestIdReservation.lastIdNumber;

  let idReservation, idDownPayment;
  lastIdNumber++;
  const idNumberString = lastIdNumber.toString().padStart(4, "0");
  idReservation = `RTeestt${idNumberString}`;
  idDownPayment = `DPTeestt${idNumberString}`;

  params.id = idReservation
  params.dp_id = idDownPayment
  
  const reservation = await createReservation(params);
  if (reservation == 1) {
    await sendMessage(params)
    const phoneAdminList = await allPhoneAdmin(); 
    for (const adminPhone of phoneAdminList) {
      // Pastikan nomor telepon admin valid
      if (adminPhone && adminPhone.phone) {
        // Tambahkan nomor telepon admin pada params
        params.phone = adminPhone.phone;
        // Kirim pesan ke admin
        await adminSendMessageReservation(params);
      }
    }
    return { status: 201, idReservation: idReservation }
  } 
  return { status:500 }
  // idRepayment = `RP${idNumberString}`
  // return `P${idNumberString}`;

  // const createReservation = await

  // const paramter = {
  //   transaction_details: {
  //     order_id: idDownPayment,
  //     // gross_amount: params.total,
  //     gross_amount: 800000,
  //   },
  //   customer_details: {
  //     first_name: params.name,
  //     email: params.email,
  //   },
  //   usage_limit: 1,
  //   expiry: {
  //     duration: 1,
  //     unit: "days",
  //   },
  //   item_details: [
  //     {
  //       id: "P0090",
  //       name: "Family and Community Gathering",
  //       price: 1000000,
  //       quantity: 1,
  //     },
  //     {
  //       name: "down payment",
  //       price: -200000,
  //       quantity: 1,
  //     },
  //   ],
  // };

  // const response = await fetch(`${process.env.MIDTRANS_APP_URL}`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //     Authorization: `Basic ${authString}`,
  //   },
  //   body: JSON.stringify(paramter),
  // });

  // if (response.status == 201) {
  //   const dataResponse = await response.json();
  //   const token = dataResponse.token;
  //   const status = 201;
  //   const data = {
  //     id: idReservation,
  //     user_id: params.user_id,
  //     package_id: params.package_id,
  //     dp_id: idDownPayment,
  //     request_date: params.request_date,
  //     check_in: params.check_in,
  //     total_people: params.total_people,
  //     token_midtrans: token,
  //     note: "ini sebuah note",
  //     rating: 0,
  //     status: 1,
  //     deposit: 160000,
  //     total_price: 800000,
  //   };
  //   await createReservation(data);
  //   return { token, status };
  // }
  // const status = response.status;
  // const dataResponse = await response.json();
  // const { error_messages } = dataResponse;
  // return { error_messages, status };
};

const confirmationDateController = async(params) => {
  if (params.confirmation === 'decline') {
    const data = {
      id: params.id,
      status_id: 5,
      confirmation_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    await updateReservationConfirmation(data);
    return 200;
  }
  const reservation = await getReservationAndUserById(params)
  const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);
  console.log(reservation.deposit);
  
  const paramter = {
    transaction_details: {
      order_id: reservation.dp_id,
      gross_amount: reservation.deposit,
    },
    customer_details: {
      first_name: reservation.user_name,
      email: reservation.email,
    },
    usage_limit: 1,
    expiry: {
      duration: 1,
      unit: "days",
    },
    item_details: [
      {
        name: reservation.name.length + 25 > 50 
          ? `Down Payment Package ${reservation.name.slice(0, 25)}...` 
          : `Down Payment Package ${reservation.name}`,
        price: reservation.deposit,
        quantity: 1,
      },
    ],
  };

  const response = await fetch(`${process.env.MIDTRANS_APP_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(paramter),
  });

  if (response.status == 201) {
    const dataResponse = await response.json();
    const status = 201;
    const data = {
      id: reservation.id,
      token_midtrans: dataResponse.token,
      status_id: 2,
      confirmation_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    await updateReservationConfirmation(data);
    await sendMessageConfirmationDate(reservation)
    return { status };
  }
  const status = response.status;
  const dataResponse = await response.json();
  console.log(dataResponse);
  const { error_messages } = dataResponse;
  return { error_messages, status };
}

const homestayUnitByReservationIdController = async(params) => {
  return await homestayUnitByReservationId(params)
}

const getListReservationByUserIdController = async (params) => {
  await updateReservationStatusTimeout(params)
  return await getListReservationByUserId(params);
};

const getReservationByIdController = async (params) => {
  const listService = await getServiceByReservationId(params);
  const listActivity = await getActivityByReservationId(params);
  const dataReservation = await getReservationById(params);

  return {
    reservation: dataReservation[0],
    service: listService,
    activity: listActivity,
  };
};

const callbackNotificationController = async (params) => {
  console.log('ini di callbank' ,params);
  
  const { order_id, status_code, transaction_status } = params;
  const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
  const hash = crypto
    .createHash("sha512")
    .update(
      `${params.order_id}${params.status_code}${params.gross_amount}${SERVER_KEY}`
    )
    .digest("hex");
  if (hash == params.signature_key) {
    if (
      params.transaction_status == "settlement" ||
      params.transaction_status == "capture"
    ) {
      if (order_id.startsWith("DP")) {
        const itemDetails = [];
        let id = order_id;
        id = id.replace(/^DP/, "R");
        const dataReservation = await getReservationAfterDeposit(id);
        const listBookedHomestayByReservationId = await bookedHomestay({ id })
        // console.log(listBookedHomestayByReservationId, 'ini data homestay');
        // console.log(dataReservation);
        const totalPriceHomestay = listBookedHomestayByReservationId.reduce((total, homestay) => total + homestay.price, 0);
        // console.log(totalPriceHomestay, 'ini total biaya homestay nya');

        listBookedHomestayByReservationId.forEach(homestay => {
          itemDetails.push({
              id: homestay.id, // Ganti dengan ID unik dari homestay jika ada
              name: `${homestay.name} ${homestay.nama_unit}-${homestay.unit_number}`, // Sesuaikan dengan format yang diinginkan
              price: homestay.price, // Harga homestay
              quantity: 1, // Satu unit homestay
          });
        });

        const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);
        const parameterAskPayment = {
          transaction_details: {
            order_id: dataReservation.id,
            // gross_amount: params.total,
            gross_amount: dataReservation.total_price + totalPriceHomestay - dataReservation.deposit,
          },
          customer_details: {
            first_name: dataReservation.fullname,
            email: dataReservation.email,
          },
          usage_limit: 1,
          expiry: {
            duration: 1,
            unit: "days",
          },
          item_details: [
          ],
        };
        // Tambahkan semua detail homestay ke dalam parameter pembayaran
        const firstItemDetails = [
          {
            id: dataReservation.package_id,
            // name: dataReservation.name,
            name: dataReservation.name.length > 50
              ? `${dataReservation.name.slice(0,47)}...`
              : dataReservation.name,
            price: dataReservation.total_price,
            quantity: 1,
          },
          {
            name: "Down Payment Applied",
            price: -dataReservation.deposit,
            quantity: 1,
          },
        ]
        parameterAskPayment.item_details.push(...firstItemDetails, ...itemDetails);
        // console.log(parameterAskPayment);
        const responseAskPayment = await fetch(
          `${process.env.MIDTRANS_APP_URL}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Basic ${authString}`,
            },
            body: JSON.stringify(parameterAskPayment),
          }
        );
        if (responseAskPayment.status == 201) {
          const dataResponse = await responseAskPayment.json();
          const token = dataResponse.token;
          console.log(token, "ini token barunya");
          const dataUpdate = {
            paymentDate: params.transaction_time,
            token: token,
            status_id:'3',
            id: id,
          };
          dataReservation.paymentDate = params.transaction_time
          await sendMessageConfirmationDP(dataReservation)
          const phoneAdminList = await allPhoneAdmin(); 
          for (const adminPhone of phoneAdminList) {
            // Pastikan nomor telepon admin valid
            if (adminPhone && adminPhone.phone) {
              // Tambahkan nomor telepon admin pada params
              params.phone = adminPhone.phone;
              // Kirim pesan ke admin
              await adminSendMessageDepositReservation(params);
            }
          }
          await updateReservationInformation(dataUpdate);
        }
      }
      else {
        // console.log('ini di bagian reservation, id R depannya');
        let id = order_id;
        id = id.replace(/^DP/, "R");
        const dataReservation = await getReservationAfterDeposit(id);
        const dataUpdate = {
          paymentDate: params.transaction_time,
          // token:token,
          status_id:'4',
          id: order_id,
        };
        const codeReferral = await checkCodeReferralAfterDP({ id: order_id })
        if (!codeReferral.code_referral || codeReferral.code_referral==null) {
          await makeNewCodeReferralAfterDP({ id: codeReferral.id })
        }
        dataReservation.paymentDate = params.transaction_time
        await sendMessageConfirmationFP(dataReservation)
        const phoneAdminList = await allPhoneAdmin(); 
        for (const adminPhone of phoneAdminList) {
          // Pastikan nomor telepon admin valid
          if (adminPhone && adminPhone.phone) {
            // Tambahkan nomor telepon admin pada params
            params.phone = adminPhone.phone;
            // Kirim pesan ke admin
            await adminSendMessageFPReservation(params);
          }
        }
        await updateAfterFullPaymentReservationInformation(dataUpdate);
      }
    } else if (params.transaction_status == "pending")
      console.log("waiting for payment");
    else if (params.transaction_status == "deny")
      console.log("payment is deny");
    else if (params.transaction_status == "cancel")
      console.log("payment is canceled");
    else if (params.transaction_status == "expire")
      console.log("payment is timeout");
    else if (params.transaction_status == "refund")
      console.log("payment has refund");
    else console.log("transactions is fail");
  }
};

const callbackRedirectController = async (params) => {
  return await callbackRedirect(params);
};

const getAllReservationController = async() => {
  await updateManyReservationStatusTimeout()
  await updatReservationConfirmationTimeout()
  return await allReservation()
}

const bookingHomestayByReservationIdController = async(params) => {
  const { detailReservation, selectedHomestays, totalPriceHomestay } = params 
  const { id, total_price } =  detailReservation
  const check_in = moment(detailReservation.check_in).utc().format('YYYY-MM-DD')
  
  for (let i=1; i<detailReservation.max_day; i++) {
    const date = moment(check_in).utc().add(i, 'days').format('YYYY-MM-DD');
    for (const homestay of selectedHomestays) {
      await bookingHomestay({ homestay, date, id })
    }
  }

  const new_total_price = total_price + totalPriceHomestay
  const new_deposit = 0.2 * new_total_price
  return await newTotalByIdReservation({ id, new_deposit })
}

const createReviewPackageController = async(params) => {
  return await createReviewPackage(params)
}

const createReviewHomestayController = async(params) => {
  for (const homestay of params) {
    await createReviewHomestay(homestay)
  }
  
  // return await createReviewPackage(params)
}

// const createInvoiceController = async (params) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument();
//     const buffers = [];

//     doc.on('data', (chunk) => buffers.push(chunk));
//     doc.on('end', () => {
//       const pdfData = Buffer.concat(buffers);
//       resolve(pdfData);
//     });
//     doc.on('error', (error) => reject(error));

//     // User and reservation details
//     const { reservation } = params.dataReservationById;

//     // Basic PDF content for testing
//     doc.fontSize(12).text(`Name: ${reservation.fullname}`);
//     doc.text(`Phone: ${reservation.phone}`);
//     doc.text(`Reservation No: ${reservation.id}`);
//     doc.text(`Request Date: ${new Date(reservation.request_date).toLocaleDateString()}`);
//     doc.moveDown();

//     doc.fontSize(14).text('Booking Details', { underline: true });
//     doc.moveDown();

//     const table = {
//       headers: ['Package Name', 'Total People', 'Total Price'],
//       rows: [
//         [reservation.name, reservation.total_people, `Rp ${reservation.total_price.toLocaleString()}`]
//       ],
//     };

//     const tableX = 50; // Starting X position
//     const tableY = doc.y; // Starting Y position
//     const rowHeight = 30; // Row height
//     const columnWidths = [200, 100, 100]; // Widths for each column

//     // Draw header row
//     doc.fontSize(14);
//     table.headers.forEach((header, index) => {
//       doc.rect(tableX + index * columnWidths[index], tableY, columnWidths[index], rowHeight).stroke();
//       doc.text(header, tableX + index * columnWidths[index] + 5, tableY + 5);
//     });
    
//     doc.moveDown();
//     // Finalize the PDF
//     doc.end();
//   });
// };
const createInvoiceController = async (params) => {
  console.log(params.dataReservationById);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', (error) => reject(error));

    // User and reservation details
    const { reservation, service } = params.dataReservationById;

    const imagePath = '../server/public/talao.png'; // Replace with your image path
    doc.image(imagePath, 50, 50, { width: 50 });
    doc
      .fontSize(14)
      .text('Desa Wisata Green Talao Park', 110, 50, { align: 'left' })  // Adjust alignment and position as needed
      .moveDown(0.5)
      .fontSize(12)
      .text(
        'Jl. Syeikh Burhanuddin, Ulakan, Kec Ulakan Tapakis Kab Padang Pariaman, Sumatera Barat',
        { align: 'left' }
      );

    doc.moveTo(50, doc.y + 10)   // Start position (left margin + current y position)
      .lineTo(600, doc.y + 10)  // End position (right margin + same y position)
      .strokeColor('#000000')   // Line color
      .lineWidth(1)             // Line thickness
      .stroke()                // Draw the line
      .moveDown(1);

    doc
      .fontSize(16)
      .text('RESERVATION INVOICE', { align: 'center' });

    // User Details
    const leftMargin = 50;
    const rightMargin = 300;
    
    doc.fontSize(12)
      .text(`Kepada Yth`, leftMargin, doc.y, { align: 'left' });
    
    // Kolom kiri dengan teks isi tebal
    doc.font('Helvetica')
      .text(`Name     :`, leftMargin, doc.y, { align: 'left', continued: true })
      .font('Helvetica-Bold')
      .text(` ${reservation.fullname}`, { align: 'left' });
    
    doc.font('Helvetica')
      .text(`Phone    :`, leftMargin, doc.y, { align: 'left', continued: true })
      .font('Helvetica-Bold')
      .text(` ${reservation.phone}`, { align: 'left' });
    
    doc.font('Helvetica')
      .text(`Address  :`, leftMargin, doc.y, { align: 'left', continued: true })
      .font('Helvetica-Bold')
      .text(` ${reservation.address}`, { align: 'left' });
    
    // Simpan posisi Y saat ini untuk kolom kanan
    const currentY = doc.y;
    
    // Kolom kanan dengan teks isi tebal
    doc.font('Helvetica')
      .text(`No           :`, rightMargin, currentY - 50, { align: 'left', continued: true })
      .font('Helvetica-Bold')
      .text(` ${reservation.id}`, { align: 'left' });
    
    doc.font('Helvetica')
      .text(`Request  :`, rightMargin, doc.y, { align: 'left', continued: true })
      .font('Helvetica-Bold')
      .text(` ${new Date(reservation.request_date).toLocaleDateString()}`, { align: 'left' });
    
    // Tambahkan jarak setelah kedua kolom selesai
    doc.moveDown(3);
    
    let qty;
    if (reservation.total_people <= reservation.min_capacity) {
      qty = 1;
    } else {
      const remainder = reservation.total_people % reservation.min_capacity;
      let additionalPacks = 0;
      if (remainder > 0) {
        additionalPacks = remainder < reservation.min_capacity / 2 ? 0.5 : 1;
      }
      qty = Math.floor(reservation.total_people / reservation.min_capacity) + additionalPacks;
    }

    // Table header and content
    const table = {
      headers: ['Package Name', 'Capacity', 'Total People', 'Qty', 'Package Price', 'Total Price'],
      rows: [
        [reservation.name, reservation.min_capacity, reservation.total_people, qty, `Rp${reservation.price}`, `Rp${reservation.total_price.toLocaleString()}`],
      ],
    };

    const tableX = 50;        // Starting X position for the table
    const startY = doc.y;      // Starting Y position for the table
    const rowHeight = 35;      // Row height
    const colWidths = [200, 70, 50, 35, 80, 100];  // Column widths

    // Draw table header
    doc.fontSize(12).fillColor('black').font('Helvetica-Bold');
    table.headers.forEach((header, i) => {
      doc
        .rect(tableX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, colWidths[i], rowHeight)
        .stroke()
        .text(header, tableX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, startY + 5, {
          width: colWidths[i] - 10,
          align: 'center',
        });
    });

    // Draw table rows
    doc.fontSize(12).font('Helvetica').fillColor('black');
    table.rows.forEach((row, rowIndex) => {
      row.forEach((cell, i) => {
        const cellX = tableX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        const cellY = startY + rowHeight * (rowIndex + 1);

        doc
          .rect(cellX, cellY, colWidths[i], rowHeight)
          .stroke()
          .text(cell, cellX + 5, cellY + 5, {
            width: colWidths[i] - 10,
            align: 'center',
          });
      });
    });

    const drawTable = (doc, table, startX, startY, rowHeight, colWidths) => {
      // Draw headers
      table.headers.forEach((header, i) => {
        const cellX = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(cellX, startY, colWidths[i], rowHeight).stroke();
        doc.text(header, cellX + 5, startY + 5, { width: colWidths[i] - 10, align: 'center' });
      });

      // Draw rows
      table.rows.forEach((row, rowIndex) => {
        const rowY = startY + rowHeight * (rowIndex + 1);
        row.forEach((cell, i) => {
          const cellX = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.rect(cellX, rowY, colWidths[i], rowHeight).stroke();
          doc.text(String(cell), cellX + 5, rowY + 5, { width: colWidths[i] - 10, align: 'center' });
        });
      });
    };

    const startX = 50;

    const homestays = params.dataBookedHomestay;
    if (homestays.length > 0) {
      doc.y += rowHeight * 0.7;
      const homestayTable = {
        headers: ['Homestay Name', 'Unit', 'Capacity', 'Days', 'Price', 'Total Price'],
        rows: homestays.map((homestay) => {
          const days = 1; // Modify if days calculation is dynamic
          const totalPrice = homestay.price * days;
          return [
            homestay.name,
            `${homestay.nama_unit}-${homestay.unit_number}`,
            homestay.capacity,
            days,
            `Rp${homestay.price.toLocaleString()}`,
            `Rp${totalPrice.toLocaleString()}`
          ];
        }),
      };

      const colWidthsHomestay = [175, 70, 70, 40, 80, 100];
      const homestayStartY = doc.y;
      drawTable(doc, homestayTable, startX, homestayStartY, rowHeight, colWidthsHomestay);

      // Calculate Grand Total for all homestays
      const homestayTotal = homestays.reduce((acc, homestay) => acc + homestay.price, 0);
      const grandTotal = homestayTotal + reservation.total_price

      // Grand Total row with merged cells
      const grandTotalY = homestayStartY + rowHeight * (homestayTable.rows.length + 1);

      // Draw the merged cell for "Grand Total" label
      const mergedCellWidth = colWidthsHomestay.slice(0, 5).reduce((a, b) => a + b, 0); // Merged width through Price column
      doc
        .rect(startX, grandTotalY, mergedCellWidth, 25)
        .stroke()
        .text('Grand Total:', startX + 5, grandTotalY + 5, {
          width: mergedCellWidth - 10,
          align: 'right'
        });

      // Draw the cell for the grand total amount aligned with Total Price column
      const grandTotalX = startX + mergedCellWidth;
      doc
        .rect(grandTotalX, grandTotalY, colWidthsHomestay[5], 25)
        .stroke()
        .text(`Rp${grandTotal.toLocaleString()}`, grandTotalX + 5, grandTotalY + 5, {
          width: colWidthsHomestay[5] - 10,
          align: 'center'
        });
    } else {
      // Case where no homestays, display Grand Total in the Package table
      const grandTotalY = startY + rowHeight * (table.rows.length + 1);
      
      // Draw the merged cell for "Grand Total" label
      const mergedCellWidth = colWidths.slice(0, 5).reduce((a, b) => a + b, 0); // Merged width through Price column
      doc
        .rect(startX, grandTotalY, mergedCellWidth, 25)
        .stroke()
        .text('Grand Total:', startX + 5, grandTotalY + 5, {
          width: mergedCellWidth - 10,
          align: 'right'
        });

      // Draw the cell for the grand total amount aligned with Total Price column
      const grandTotalX = startX + mergedCellWidth;
      doc
        .rect(grandTotalX, grandTotalY, colWidths[5], 25)
        .stroke()
        .text(`Rp${reservation.total_price.toLocaleString()}`, grandTotalX + 5, grandTotalY + 5, {
          width: colWidths[5] - 10,
          align: 'center'
        });
    }

    doc.moveDown(1)
    doc.font('Helvetica')
      .text(`Check-In   :`, leftMargin, doc.y, { align: 'left', continued: true })
      .text(` ${moment(reservation.check_in).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}`, { align: 'left' });
  
    const checkOutFormatted = calculateCheckOutDate(reservation.check_in, reservation.max_day);
    doc.font('Helvetica')
      .text(`Check-Out  :`, leftMargin, doc.y, { align: 'left', continued: true })
      .text(` ${checkOutFormatted}`, { align: 'left' });

      doc.moveDown(1);

    // Define a starting Y position for Service Include and Service Exclude headers
    const startYService = doc.y;  // Set start Y position for headers

    const middle = doc.page.width / 2;  // Calculate the middle of the page
    const indentRight = middle + 50;  // Set margin for Service Exclude section

    // Header for Service Include
    doc.font('Helvetica-Bold')
      .text('Service Include', leftMargin, startYService, { underline: true, align: 'left' });

    // Header for Service Exclude
    doc.font('Helvetica-Bold')
      .text('Service Exclude', indentRight, startYService, { underline: true, align: 'left' });

    // Move down after headers to separate the content
    doc.moveDown(1);

    // Set a new Y position for Service Include content
    let currentYLeft = startYService + 12;  // Position for Service Include items
    service.forEach(service => {
      if (service.status === 1) {
        doc.font('Helvetica').text(`- ${service.name}`, leftMargin, currentYLeft, { align: 'left' });
        currentYLeft += 12;  // Increase Y position for the next service
      }
    });

    // Set a new Y position for Service Exclude content
    let currentYRight = startYService + 12;  // Position for Service Exclude items
    service.forEach(service => {
      if (service.status === 0) {
        doc.font('Helvetica').text(`- ${service.name}`, indentRight, currentYRight, { align: 'left' });
        currentYRight += 12;  // Increase Y position for the next service
      }
    });

    doc.moveDown(3)
    doc.font('Helvetica')
      .text(`Deposit Payment  :`, leftMargin, doc.y, { align: 'left', continued: true })
      .text(` ${moment(reservation.deposit_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}`, { align: 'left' });
    doc.font('Helvetica')
      .text(`Full Payment         :`, leftMargin, doc.y, { align: 'left', continued: true })
      .text(` ${moment(reservation.payment_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}`, { align: 'left' });
    const statusText = reservation.status_id === 4 ? 'Acceptance' : reservation.status;
    doc.font('Helvetica')
      .text(`Status                   :`, leftMargin, doc.y, { align: 'left', continued: true })
      .text(` ${statusText}`, { align: 'left' });

    doc.end();
  });
};

const calculateCheckOutDate = (checkIn, maxDays) => {
  const checkInDate = moment(checkIn);
  const checkOutDate = checkInDate.clone(); // Clone checkInDate to prevent mutation

  if (maxDays > 1) {
    checkOutDate.add(maxDays - 1, 'days').set({ hour: 12, minute: 0, second: 0 }); // Set checkout time to 12:00 PM
  } else {
    checkOutDate.set({ hour: 18, minute: 0, second: 0 }); // Set checkout time to 6:00 PM
  }
  return `${checkOutDate.format('dddd, Do MMMM YYYY')}, ${checkOutDate.format('HH:mm')}`;
};


const refundController = async(params) => {
  const account_refund = `${params.bank} (${params.accountNumber}) a/n ${params.owner}`
  const data = {
    account_refund,
    refund_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    id: params.id,
    refund_amount: params.totalRefund
  }
  await refund(data)
  const phoneAdminList = await allPhoneAdmin(); 
  for (const adminPhone of phoneAdminList) {
    // Pastikan nomor telepon admin valid
    if (adminPhone && adminPhone.phone) {
      // Tambahkan nomor telepon admin pada params
      params.phone = adminPhone.phone;
      // Kirim pesan ke admin
      await adminSendMessageCancelRefundReservation(params);
    }
  }
  return console.log(account_refund);
}

const cancelController = async(params) => {
  const data = {
    cancel_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    id: params.id,
  }
  await cancel(data)
  const phoneAdminList = await allPhoneAdmin(); 
  for (const adminPhone of phoneAdminList) {
    // Pastikan nomor telepon admin valid
    if (adminPhone && adminPhone.phone) {
      // Tambahkan nomor telepon admin pada params
      params.phone = adminPhone.phone;
      // Kirim pesan ke admin
      await adminSendMessageCancelReservation(params);
    }
  }
  return console.log(data);
}

const refundAdminProofController = async(params) => {
  const data = {
    proof_refund: params.url[0],
    admin_refund: params.admin_refund,
    refund_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    id:params.id
  }
  await refundAdminProof(data)
  await customerSendMessageRefundProof(data)
  return console.log(params.url[0]);
}

const refundConfirmationController = async(params) => {
  if (params.status == '1') {
    params.status_id = 10
    const phoneAdminList = await allPhoneAdmin(); 
    for (const adminPhone of phoneAdminList) {
      // Pastikan nomor telepon admin valid
      if (adminPhone && adminPhone.phone) {
        // Tambahkan nomor telepon admin pada params
        params.phone = adminPhone.phone;
        // Kirim pesan ke admin
        await adminSendMessageRefundConfirmation(params);
      }
    }
    return await refundConfirmation(params)
  }
  params.status_id = 8
  const phoneAdminList = await allPhoneAdmin();
  for (const adminPhone of phoneAdminList) {
    // Pastikan nomor telepon admin valid
    if (adminPhone && adminPhone.phone) {
      // Tambahkan nomor telepon admin pada params
      params.phone = adminPhone.phone;
      // Kirim pesan ke admin
      await adminSendMessageRefundConfirmation(params);
    }
  }
  return await refundConfirmation(params)
}

const deleteReservationByIdController = async(params) => {
  await deleteDetailReservationById(params)
  return await deleteReservationById(params)
}

module.exports = {
  createReservationController,
  confirmationDateController,
  getListReservationByUserIdController,
  getReservationByIdController,
  callbackNotificationController,
  callbackRedirectController,
  getAllReservationController,
  bookingHomestayByReservationIdController,
  createReviewPackageController, 
  createInvoiceController, 
  refundController, 
  refundAdminProofController,
  refundConfirmationController,
  cancelController,
  homestayUnitByReservationIdController,
  createReviewHomestayController,
  deleteReservationByIdController,
};
