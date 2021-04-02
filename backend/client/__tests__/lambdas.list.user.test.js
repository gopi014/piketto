const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
import {handler} from "../lambdas/users/list/list_users";

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
    AWSMock.mock('DynamoDB', 'query', Promise.resolve({ Items:[data] }));
    };

  const destroyMock = () => {
    AWSMock.restore('DynamoDB');
  };

  const setup = () =>{
    const event = {
        query: {
          id: 'abc@xyz.com'
        },
        cognitoPoolClaims:{
          email:"abc@xyz.com"
        }
    };
    const context ={};
    return {
        event : event,
        context : context,
        callback : jest.fn()
    }
  };

  describe('test list users function', () => {
    const OLD_ENV = process.env;

    beforeAll(() => {
        process.env.userTableName = 'some_user_table_name';
        setupMock();
      });
      afterAll(() => {
        delete process.env.userTableName;
        destroyMock();
        process.env = OLD_ENV;
      });
      test('should be able to list users', () => {
          const { event, context, callback } = setup();
           return handler(event,context,callback).then((response) =>{
            expect(response).toEqual([unmarslledData]);
        })
      });
      test('should be able to handle unauthorized users', () => {
        const { event, context, callback } = setup();
        event.cognitoPoolClaims.email='some_other_user';
         return handler(event,context,callback).then((response) =>{
          expect(callback).toHaveBeenCalledWith(new Error(`[401] Sorry! You are not authorized to view this content`));
      })
    });
      test('should be able to handle error in list users', () => {
        const { context, callback } = setup();
        const event = null;
         return handler(event,context,callback).then((response) =>{
          expect(callback).toHaveBeenCalledWith(new Error(`[400] TypeError: Cannot read property 'query' of null`));
      })
    });
  });