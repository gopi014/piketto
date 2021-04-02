import _ from 'lodash';
import User from '../models/User';
import { prepareConditions }  from '../conditions';
import * as ddb from '../dynamodblib';

class Users {
  constructor(conditions) {
    this.conditions = conditions;
    this.items = [];
  }
  /**
   * process the query response
  **/
  _processResponse(response) {
    this.items = response.Items.map((item) => new User(ddb.convert('unmarshall', item)));
  }
  /**
   * fetches the data with a ddb query operation
   **/
  async _queryFetch() {
    const { expression, names, values } = prepareConditions(this.conditions);
    const options = {
      TableName: process.env.userTableName,
      IndexName: Object.keys(this.conditions)[0],
      KeyConditionExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values
    };
    const response = await ddb.call('query', options);
    this._processResponse(response);
    return this;
  }
  /**
   * fetches the data with ddb scan operation
  **/
  async _scanFetch() {
    const options = {
      TableName: process.env.userTableName,
      AttributesToGet: ['name', 'gender', 'avatar'],
      Select: 'SPECIFIC_ATTRIBUTES'
    };
    const response = await ddb.call('scan', options);
    this._processResponse(response);
    return this;
  }
  /**
   * fetches the Users based on query conditions
   *
  **/
  async fetch() {
    if (!(_.isEmpty(this.conditions))) {
      return await this._queryFetch();
    } else {
      return await this._scanFetch();
    }
  }
  /**
   * converts the items to JSON
   *
  **/
  toJSON() {
    return this.items.map((item) => item.toJSON());
  }
}

export default Users;