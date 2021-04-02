const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
import Users from "../Users";

const data = {
  id: { S: 'some_id' },
  name: { S: 'some_name' },
  email : { S: 'abc@xyz.com'},
  gender : { S: 'male'},
  address: { L: [{
    M: {
      city: { S: "chennai"},
      contactNo: { S: "1234567890"},
      country: { S: "india"},
      landmark: { S: "some landmark"},
      line1: { S: "someaddress"},
      line2: { S: "area"},
      name: { S : "Home"},
      pincode: { S: "600028"},
      state: { S: "tamilnadu"}
    }
  }]},
  mobile: { S: '1234567890' },
  avatar: {S: 'http://someimage.com'}
};
const unmarslledData={
  id: "some_id",
  name: "some_name",
  email: "abc@xyz.com",
  gender: "male",
  mobile:"1234567890",
  avatar:"http://someimage.com",
  address: [{
    name:"Home",
    line1:"someaddress",
    line2:"area",
    landmark:"some landmark",
    city:"chennai",
    state:"tamilnadu",
    country:"india",
    pincode:"600028",
    contactNo:"1234567890"
  }]
};
const setupMock = () => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB', 'query', Promise.resolve({ Items:[data] }));
  AWSMock.mock('DynamoDB', 'scan', Promise.resolve({ Items:[data] }));
};

const destroyMock = () => {
  AWSMock.restore('DynamoDB');
};

describe('test Users class', () => {
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
  test('testing list users', () => {
    const users =  new Users({ email: 'abc@xyz.com' });
    return users.fetch().then((response) => {
      expect(response.toJSON()).toEqual([unmarslledData]);
    });
  });
  test('testing list users without filter condition', () => {
    const users =  new Users();
    return users.fetch().then((response) => {
      expect(response.toJSON()).toEqual([unmarslledData]);
    });
  });
});