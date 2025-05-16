const promisePool = require("../../config/database");

const createChat = async (params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO chat (id,user_id) VALUES ('${params.id},'${params.user_id}')`
  );
  return rows;
};

const userChats = async (params) => {
  // const [rows] = await promisePool.query(`SELECT C.*,U.fullname,U.user_image FROM chat AS C JOIN users AS U ON U.id=C.user_id WHERE C.id='${params.user_id}'`)
  const [rows] = await promisePool.query(
    `SELECT CR.id chat_room_id, U.fullname, U.user_image, U.id user_id FROM chat_room CR
    JOIN member_chat_room MCR ON MCR.chat_room_id = CR.id
    JOIN users U ON U.id = MCR.user_id
    WHERE CR.id IN (
      SELECT MCR2.chat_room_id
      FROM member_chat_room MCR2
      WHERE MCR2.user_id = ${params.user_id})
    AND U.id != ${params.user_id};`
  );
  //   SELECT CR.id, U.fullname, U.user_image
  // FROM chat_room CR
  // JOIN member_chat_room MCR ON MCR.chat_room_id = CR.id
  // JOIN users U ON U.id = MCR.user_id
  // WHERE CR.id IN (
  //     SELECT MCR1.chat_room_id
  //     FROM member_chat_room MCR1
  //     WHERE MCR1.user_id = 30
  // )
  // AND U.id != 30;
  return rows;
};

const findChat = async (params) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM chat WHERE user_id='${params.user_id}'`
  );
  return rows;
};

const addNewChatWithAdmin = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT U.id AS user_id, U.fullname, U.user_image
    FROM users U
    WHERE U.role_id = 1
    AND NOT EXISTS (
      SELECT 1
      FROM member_chat_room MCR
      JOIN chat_room CR ON CR.id = MCR.chat_room_id
      WHERE MCR.user_id = U.id
      AND CR.id IN (
          SELECT chat_room_id
          FROM member_chat_room
          WHERE user_id = ${params.user_id}
      )
    );`
  );
  return rows;
}

const getLatestIdChatRoom = async() => {
  const [rows] = await promisePool.query(
    `SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) AS max_id_number FROM chat_room WHERE id LIKE 'C%';`
  );  
  return rows[0];
}

const checkMemberRoomChatAvailable = async(params) => {
  const [rows] = await promisePool.query(
    `SELECT mc1.chat_room_id as idChatRoom
     FROM member_chat_room mc1
     JOIN member_chat_room mc2
     ON mc1.chat_room_id = mc2.chat_room_id
     WHERE mc1.user_id = ? AND mc2.user_id = ?;`,
    [params.user_id, params.target_user_id]
  );
  return rows[0];
}

const createNewChatRoom = async(params) => {
  const [rows] = await promisePool.query(
    `INSERT INTO chat_room (id) VALUES (?)`, [params]
  );  
  return rows[0];
}

const createNewMemberChatRoom = async(params) => {
  return await promisePool.query(
    `INSERT INTO member_chat_room (chat_room_id, user_id) VALUES (?, ?), (?, ?)`,
    [params.idChatRoom, params.user_id, params.idChatRoom, params.target_user_id]
  );
}

const getNewChat = async(params) => {

}

module.exports = { createChat, userChats, findChat, addNewChatWithAdmin, getLatestIdChatRoom
  , createNewChatRoom, createNewMemberChatRoom, checkMemberRoomChatAvailable,
 };
