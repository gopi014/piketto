import AWS from "aws-sdk";

/**
 * get secret values from SSM store
 * @param {Array} keys keys for which the values need to be retrieved
 * @return {object} data containing values of the keys passed
 */
export const getKeyValues = async (keys) => {
  const ssm = new AWS.SSM();
  const params = {
    Names: keys,
    WithDecryption: true
  };
  return await ssm.getParameters(params).promise();
};
