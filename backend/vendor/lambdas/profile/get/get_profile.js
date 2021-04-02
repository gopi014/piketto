import {postgresCrud} from "../../../libs/dbcrud";
/**
 * handler to get profile api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context, callback) { // eslint-disable-line no-unused-vars

  try {
    const { id } = event.path;
    if(event.cognitoPoolClaims.email===id){
    const response = await postgresCrud("getById","pik_vendor_branch_details",id);
    return response;
    }else{
      throw new Error(`[401] Sorry! You are not authorized to view this content`);
    }
  } catch (err) {
    const regex = RegExp('\\[...]');
    const response = regex.test(err) ? err.toString().replace(/^Error:/,'').trim() : `[400] ${err.toString()}`;
      callback(new Error(response));
  }
}