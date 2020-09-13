const { JwtGenerator } = require('virgil-sdk');
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner } = require('virgil-crypto');
const functions = require('firebase-functions');

async function getJwtGenerator() {
  await initCrypto();
  
  const crypto = new VirgilCrypto();
  
  const { app_id, app_key_id, app_key } = functions.config().virgil;
  return new JwtGenerator({
    appId: app_id,
    apiKeyId: app_key_id,
    apiKey: crypto.importPrivateKey(app_key),
    accessTokenSigner: new VirgilAccessTokenSigner(crypto),
  });
}
/**
 * Submit an issue using Github's API
 *
 * All params are referenced from req.body
 * @param {string} identity - Firebase Auth UID for generating a personalized JWT token
 * @return {string} JWT token for user to encrypt/decrypt data for E2EE
 */
async function generateVirgilJwt(identity) {
  const generator = await getJwtGenerator();
  return generator.generateToken(identity);
}

const getVirgilJwt = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called ' +
      'while authenticated.');
  }
  
  // You can use context.auth.token.email, context.auth.token.phone_number or any unique value for identity
  const identity = context.auth.token.uid;
  const token = await generateVirgilJwt(identity);
  return {
    token: token.toString()
  };
});

module.exports = {
  getVirgilJwt,
}
