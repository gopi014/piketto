import _ from 'lodash';
import { generate } from '../uuid.gen';
import * as ddb from '../dynamodblib';

class User {
  /**
   * constructs User model
   **/
  constructor(params) {
    const {
      id, name, email, gender,
      address, mobile, avatar
    } = params;
    this.id = id || generate();
    this.name = name;
    this.gender = gender;
    this.address = address;
    this.mobile = mobile;
    this.avatar = avatar;
    this.email = email;
  }
  /**
   * fetches the model info
   *  @param {object} id
  **/
  static async fetch(id) {
    const options = {
      TableName: process.env.userTableName,
      Key: ddb.prepare(id)
    };
    const params = await ddb.call('getItem', options);
    if (!(_.isEmpty(params))) {
      return new User(ddb.convert('unmarshall', params.Item));
    } else {
      throw new Error(`[404] Not Found`);
    }
  }
  /**
   * saves model do ddb
   *
  **/
  async save() {
    const options = {
      TableName: process.env.userTableName,
      Item: ddb.prepare(this.toJSON())
    };
    await ddb.call('putItem', options);
    return this.toJSON();
  }
  /**
   * deletes the model from ddb
   *
  **/
  async remove() {
    const { id } = this;
    const options = {
      TableName: process.env.userTableName,
      Key: ddb.prepare({ id })
    };
    return ddb.call('deleteItem', options);
  }
  /**
   * converts the model into json of attributes
   *
  **/
  toJSON() {
    const {
      id, name, email, gender,
      address, mobile, avatar
    } = this;
    return {
      id, name, email, gender,
      address, mobile, avatar
    };
  }
}

export default User;