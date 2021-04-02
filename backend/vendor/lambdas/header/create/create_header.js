import {postgresCrud} from "../../../libs/dbcrud";
/**
 * handler to create header api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context, callback) { // eslint-disable-line no-unused-vars

  try {
    const response = await postgresCrud("insert","pik_heading_detail",event.body);
    return response;
  } catch (err) {
      callback(new Error(`[400] ${err}`));
  }
}