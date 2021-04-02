const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
import {handler} from "../lambdas/users/create/create_users";

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
    AWSMock.mock('DynamoDB', 'putItem', Promise.resolve("success"));
    AWSMock.mock('SNS', 'publish', 'success');
  };

  const destroyMock = () => {
    AWSMock.restore('DynamoDB');
  };

  const setup = () =>{
    const event = {
        body: unmarslledData,
        cognitoPoolClaims:{
          email:"some_id"
        }
    };
    const context ={};
    return {
        event : event,
        context : context,
        callback : jest.fn()
    }
  };

  describe('test create users function', () => {
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
      test('should be able to create users', () => {
          const { event, context, callback } = setup();
           return handler(event,context,callback).then((response) =>{
            expect(response).toEqual(unmarslledData);
        })
      });
      test('should be able to exception in send  email', () => {
        const { event, context, callback } = setup();
        AWSMock.restore('SNS');
         return handler(event,context,callback).then((response) =>{
          expect(response).toEqual(unmarslledData);
      })
    });
      test('should be able to handle unauthorized user from update', () => {
        const { event, context, callback } = setup();
        event.cognitoPoolClaims.email='some_other_user';
         return handler(event,context,callback).then((response) =>{
          expect(callback).toHaveBeenCalledWith(new Error(`[401] Sorry! You are not authorized to view this content`));
      })
    });
      test('should be able to handle error in creating users', () => {
        const { context, callback } = setup();
        const event={};
         return handler(event,context,callback).then((response) =>{
          expect(callback).toHaveBeenCalledWith(new Error(`[400] TypeError: Cannot read property 'id' of undefined`));
      })
    });
  });