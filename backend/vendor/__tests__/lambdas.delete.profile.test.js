const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
import {handler} from "../lambdas/profile/delete/delete_profile";


jest.mock('postgresql-easy', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        deleteById: jest.fn().mockImplementation(()=>Promise.resolve([])),
        disconnect : jest.fn()
      };
    }),
  };
});

const MOCK_SSM_PARAMS = {
  "db":"some_db",
  "host":"some_host",
  "username":"some_username",
  "password":"some_password"
 };

const setupMock = () => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('SSM', 'getParameters', () => Promise.resolve({
    Parameters: [{
      'Value': JSON.stringify(MOCK_SSM_PARAMS)
    }]
  }));

};

const destroyMock = () => {
  AWSMock.restore('SSM');
};

const setup = () =>{
  const event = {
      path: 1
  };
  const context ={};
  return {
      event : event,
      context : context,
      callback : jest.fn()
  }
};

describe('test delete profile function', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env.postgresConnectionString = 'some_postgres_connection_string';
    setupMock();
  });
  afterEach(() => {
    delete process.env.postgresConnectionString;
    destroyMock();
    process.env = OLD_ENV;
  });
  test('should be able to delete profile', () => {
    const { event, context, callback } = setup();
    return handler(event,context,callback).then((response) =>{
      expect(response).toEqual([]);
    });
  });
  test('should be able to handle error', () => {
    const { event, context, callback } = setup();
    AWSMock.remock('SSM', 'getParameters', () => Promise.resolve({
      Parameters: []
    }));
    return handler(event,context,callback).then((response) =>{
      expect(callback).toHaveBeenCalledWith(new Error(`[400] Error: [400] Error: Connection Details Not Found...`));
    });
  });
});