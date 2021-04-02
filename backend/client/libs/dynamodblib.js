import AWS from "aws-sdk";
/**
 * invokes dynamo db sdk methods
 * @param {string} action dynamo db method to be invoked
 * @param {object} params dynamo db params to be passed
 */
export const call = (action, params) => {
  const dynamoDb = new AWS.DynamoDB(); //uncomment when pushing to server
  /*code to run dynamodb locally*/
//   const dynamoDb = new AWS.DynamoDB({
//     region: 'localhost',
//     endpoint: 'http://localhost:8000',
//     accessKeyId: "MOCK_ACCESS_KEY_ID",
//     secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
// });
/*dynamodb local ends here */
  return dynamoDb[action](params).promise();
};
/**
 * marshalls json data into ddb map/list
 * unmarshalls ddb map/list to json data
 * @param {Object} data data to be marshalled
 */
export const convert = (action, data) => {
  return AWS.DynamoDB.Converter[action](data);
};
/**
 * prepares json data into ddb map/list
 * @param {Object} data data to be marshalled
 */
export const prepare = (data) => {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = convert('input', data[key]);
    return acc;
  }, {});
};