import User from "../../../libs/models/User";
/**
 * handler to delete users api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context,callback) {
    try{
        const { key } = event.path;
        if(key === event.cognitoPoolClaims.email){
        const users = new User({id:key});
        const response = await users.remove();
        return response;
        }
        else{
            throw new Error(`[401] Sorry! You are not authorized to view this content`);
        }

    }catch(err){
        console.log(err);
        const regex = RegExp('\\[...]');
        const response = regex.test(err) ? err.toString().replace(/^Error:/,'').trim() : `[400] ${err.toString()}`;
        callback(new Error(response));
    }
}