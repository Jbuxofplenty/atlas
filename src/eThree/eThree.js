import { functions } from '../firebase';
import { EThree, KeyPairType } from '@virgilsecurity/e3kit-browser'; // or 'e3kit-native'

const getToken = functions.httpsCallable('getVirgilJwt');
const initializeFunction = () => getToken().then(result => result.data.token);
EThree.initialize(initializeFunction, {
  keyPairType: KeyPairType.CURVE25519_ROUND5_ED25519_FALCON,
}).then(async eThree => {
    console.log(eThree);
    // or
    eThree.register()
        .then(() => console.log('success'))
        .catch(e => console.error('error: ', e));
}).catch(error => {
    // Error handling
    const code = error.code;
    console.log(code, error)
    // code === 'unauthenticated' if user not authenticated
});