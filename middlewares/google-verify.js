const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

async function googleVerify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,
    });
    const payload = ticket.getPayload();
    console.log({payload})
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
    return payload
}


module.exports = googleVerify;