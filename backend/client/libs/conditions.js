
import * as ddb from './dynamodblib';
/**
 * prepares the object based conditions into expression and values for ddb query
 *
 **/
export const prepareConditions = (conditions) => {
  // creates condition expression
  const expression = Object.keys(conditions).reduce((acc, key) => {
    acc.push(`#${key} = :${key}`);
    return acc;
  }, []).join(' and ');
  // creates list of names in the condition
  const names = Object.keys(conditions).reduce((acc, key) => {
    acc[`#${key}`] = key;
    return acc;
  }, {});
  // creates list of values in the condition
  const values = Object.keys(conditions).reduce((acc, key) => {
    acc[`:${key}`] = ddb.convert('input', conditions[key]);
    return acc;
  }, {});
  return {
    expression,
    values,
    names
  };
};