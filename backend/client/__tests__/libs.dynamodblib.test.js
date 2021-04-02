const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
import { call, convert, prepare } from '../libs/dynamodblib';

const setupMock = () => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB', 'getItem', {
    Item : {
      id: { S: 'some_id' },
      group: { S: 'some_group' },
      sub_group : { S: 'some_sub_group'},
      images:{SS:["test array"]}
    }
  });
};

const destroyMock = () => {
  AWSMock.restore('DynamoDB')
}

describe('dynamodb library tests', () => {
  beforeAll(() => {
    setupMock();
  });
  afterAll(() => {
    destroyMock();
  });
  test('call dynamodb actions', () => {
    return call('getItem', {
      TableName: 'some_table_name',
      Key: {
        id: { S: 'some_id' }
      }
    }).then((response) => {
      expect(response.Item.sub_group.S).toEqual('some_sub_group');
    });
  });
  test('convert dynamodb data marshall unmarshall input and output', () => {
    const response =  convert('unmarshall', {
      id: { S: 'some_id' }
    });
    expect(response.id).toEqual('some_id');
  });
  test('convert dynamodb data marshall unmarshall input and output', () => {
    const response =  prepare(
   { id: 'some_id' }
    );
    expect(response.id.S).toEqual('some_id');
  });
});