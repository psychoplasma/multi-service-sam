const { dynamodbInstace } = require('/opt/libs/dynamodb');

exports.create = async (event, context, callback) => {
  try {
      let params = {
          TableName: process.env.userTable,
          Key: 'asadadasd'
      };

      let res = await dynamodbInstace('put', params);

      callback(200, res.Item);
  } catch (e) {
      callback(500, null, 'Something went wrong');
  }
}

exports.get = async (event, context, callback) => {
  try {
      let params = {
          TableName: process.env.userTable,
          Key: event.id || null
      };
      let res = await dynamodbInstace('get', params);

      if (!res.Item) {
          callback(404, null, 'Not found');
          return;
      }

      callback(200, res.Item);
  } catch (e) {
      callback(500, null, 'Something went wrong');
  }
}

exports.delete = async (event, context, callback) => {
    try {
        let params = {
            TableName: process.env.userTable,
            Key: event.id || null
        };
        let res = await dynamodbInstace('get', params);

        if (!res.Item) {
            callback(404, null, 'Not found');
            return;
        }

        await dynamodbInstace('delete', params);

        callback(200, res.Item);
    } catch (e) {
        callback(500, null, 'Something went wrong');
    }
}