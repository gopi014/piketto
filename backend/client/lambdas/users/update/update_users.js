import User from '../../../libs/models/User';

/**
 * handler to update users api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context,callback) {
  try {
    if(event.body.id=== event.cognitoPoolClaims.email){
    const users = new User(event.body);
    const response = await users.save();
    return response;
    }
    else{
      throw new Error(`[401] Sorry! You are not authorized to view this content`);
  }
  } catch (err) {
    const regex = RegExp('\\[...]');
    const response = regex.test(err) ? err.toString().replace(/^Error:/,'').trim() : `[400] ${err.toString()}`;
    callback(new Error(response));
  }
}