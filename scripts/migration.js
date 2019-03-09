const axios = require('axios');
const rmdb = require('../credentails');
const mysql = require('serverless-mysql')({
  config: {
    host     : rmdb.host,
    database : rmdb.database,
    user     : rmdb.user,
    password : rmdb.password
  }
});


function schemaConverter(username, data) {
  data = JSON.parse(JSON.stringify(data));
  return {
    id: username,
    name: data.name,
    email: data.email,
    phone: data.phone,
    profileImg: 'asdadad/asdadad'
  };
}

function cognitoConverter(data) {
  data = JSON.parse(JSON.stringify(data));
  console.log('Data', data.email);
  return {
    id: data.id,
    email: data.email,
    userName: data.email,
    name: data.name
  };
}

async function getUserList() {
  try {
    let response = await mysql.query(`SELECT * FROM user_table`);
    await mysql.quit();
    return response;
  } catch (e) {
    console.log('getUserList#Error:', e);
    Promise.reject('Cannot fetch user_table from rmdb!');
  }
}

function invokeLambda(type, endpoint, header, body) {
  switch (type) {
    case 'get':
      return axios.get(endpoint, header);
    case 'post': 
      return axios.post(endpoint, body, header);
    default:
      return Promise.reject(new Error('Unknon function invocation type'));
  }
}

function createUserOnDynamoDb(username, data) {
  data = schemaConverter(username, data);
  return invokeLambda('post', `${process.env.API_SERVICE_BASE_URL}/users`, '', data);
}

function createUserUserPool(data) {
  data = cognitoConverter(data);
  return invokeLambda('post', `${process.env.API_SERVICE_BASE_URL}/admin`, '', data);
}

async function migrateUserList() {
  try {
    let userList = await getUserList();

    for (let i = 19; i < userList.length; i++) {
      let res = await createUserUserPool(userList[i]);
      console.log('Cognito User:', res.data.data.User.Username);
      await createUserOnDynamoDb(res.data.data.User.Username, userList[i]);
    }
  } catch (e) {
    console.error('Migration Error', e);
  }
}


(async function x() {
  migrateUserList();
})();