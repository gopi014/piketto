const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
import {handler} from "../lambdas/users/delete/delete_users";

const setupMock = () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB', 'deleteItem', Promise.resolve("success"));
  };

  const destroyMock = () => {
    AWSMock.restore('DynamoDB');
  };

  const setup = () =>{
    const event = {
        path: {
            key : "some_key"
        },
        cognitoPoolClaims:{
          email:"some_key"
        }
    };
    const context ={};
    return {
        event : event,
        context : context,
        callback : jest.fn()
    }
  };

  describe('test delete users function', () => {
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
      test('should be able to delete users', () => {
          const { event, context, callback } = setup();
           return handler(event,context,callback).then((response) =>{
            expect(response).toEqual("success");
        })
      });
      test('should be able to handle unauthorized user from update', () => {
        const { event, context, callback } = setup();
        event.cognitoPoolClaims.email='some_other_user';
         return handler(event,context,callback).then((response) =>{
          expect(callback).toHaveBeenCalledWith(new Error(`[401] Sorry! You are not authorized to view this content`));
      })
    });
      test('should be able to handle error in delete users', () => {
        const { context, callback } = setup();
        const event={};
         return handler(event,context,callback).then((response) =>{
          expect(callback).toHaveBeenCalledWith(new Error(`[400] TypeError: Cannot read property 'key' of undefined`));
      })
    });
  });