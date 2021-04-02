const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
import User from "../../models/User";

const data ={
        id: { S: 'some_id' },
        name: { S: 'some_name' },
        email : { S: 'abc@xyz.com'},
        gender : { S: 'male'},
        address: {"L": [{"M": {"city": {"S": "chennai"}, "contactNo": {"S": "1234567890"}, "country": {"S": "india"}, "landmark": {"S": "some landmark"}, "line1": {"S": "someaddress"}, "line2": {"S": "area"}, "name": {"S": "Home"}, "pincode": {"S": "600028"}, "state": {"S": "tamilnadu"}}}]},
        mobile: { S: '1234567890' },
        avatar: {S: 'http://someimage.com'}
      };
const unmarslledData={
  "id": "some_id",
  "name": "some_name",
  "email": "abc@xyz.com",
  "gender": "male",
  "mobile":"1234567890",
  "avatar":"http://someimage.com",
  "address": [{"name":"Home","line1":"someaddress","line2":"area","landmark":"some landmark","city":"chennai","state":"tamilnadu","country":"india","pincode":"600028","contactNo":"1234567890"}]

};
const setupMock = () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB', 'getItem', Promise.resolve({Item:data}));
    AWSMock.mock('DynamoDB', 'putItem', Promise.resolve("success"));
    AWSMock.mock('DynamoDB', 'deleteItem', Promise.resolve("Deleted"));
  };

  const destroyMock = () => {
    AWSMock.restore('DynamoDB');
  };

  describe('test user class', () => {
    const OLD_ENV = process.env;

    beforeAll(() => {
        process.env.userTableName = 'some_user_table_name';
        setupMock();
      });
      afterAll(() => {
        delete process.env.process.env.userTableName;
        destroyMock();
        process.env = OLD_ENV;
      });
      test('testing fetch user', () => {
        return User.fetch({id:"some_id"}).then((response) =>{
            expect(response).toEqual(unmarslledData);
        })
      });
      test('testing put user', () => {
          const user = new User(unmarslledData);
        return user.save().then((response) =>{
            expect(response).toEqual(unmarslledData);
        })
      });
      test('testing put user without id', () => {
        delete unmarslledData.id;
        const user = new User(unmarslledData);
      return user.save().then((response) =>{
        expect(response).toBeTruthy();
      })
    });
      test('testing delete user', () => {
          const user = new User(unmarslledData);
        return user.remove().then((response) =>{
            expect(response).toEqual("Deleted");
        })
      });
  });