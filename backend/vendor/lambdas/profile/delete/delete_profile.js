import {postgresCrud} from "../../../libs/dbcrud";
/**
 * handler to delete profile api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context, callback) { // eslint-disable-line no-unused-vars

  try {
    const { id } = event.path;
    const response = await postgresCrud("deleteById","pik_vendor_branch_details",id);
    return response;
  } catch (err) {
      callback(new Error(`[400] ${err}`));
  }
}