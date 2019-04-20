import { bufferToString, parseAuthData, bufToHex } from './helpers';
import CBOR from './cbor'

// Offer user to store username and password for this site
export function storeCredential() {
  var passwordcred = eval(`new PasswordCredential({
      'type': 'password',
      'id': 'alice',
      'password': 'VeryRandomPassword123456'
  })`)

  navigator.credentials.store(passwordcred)
}

// Get credentials for this site (will list all if more than one)
export function getCredential() {
  navigator.credentials.get({ 'password': true })
    .then((credential) => {
      if (!credential)
        throw new Error('No credential found')
      console.log(credential);
      // sendServer(credential) // PasswordCredential {iconURL: "", name: "", password: "VeryRandomPassword123456", id: "alice", type: "password"}
    })
}

// Request credential from the authentication (register) 
export function makeCredential() {
  return new Promise((res, rej) => {
    var challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    var userID = this.state.email;
    var id = Uint8Array.from(window.atob(userID), c => c.charCodeAt(0))

    var publicKey = {
      'challenge': challenge,

      'rp': {
        'name': 'Example Inc.'
      },

      'user': {
        'id': id,
        'name': this.state.email,
        'displayName': 'John Doe'
      },

      'pubKeyCredParams': [
        { 'type': 'public-key', 'alg': -7 },
        { 'type': 'public-key', 'alg': -257 }
      ]
    }

    navigator.credentials.create({ 'publicKey': publicKey })
      .then((newCredentialInfo) => {
        console.log('SUCCESS', newCredentialInfo)
        console.log('ClientDataJSON: ', bufferToString(newCredentialInfo.response.clientDataJSON))
        let attestationObject = CBOR.decode(newCredentialInfo.response.attestationObject);
        console.log('AttestationObject: ', attestationObject)
        let authData = parseAuthData(attestationObject.authData);
        console.log('AuthData: ', authData);
        console.log('CredID: ', bufToHex(authData.credID));
        console.log('AAGUID: ', bufToHex(authData.aaguid));
        console.log('PublicKey', CBOR.decode(authData.COSEPublicKey.buffer));

        res(authData.credID)
        //localStorage.setItem('CredID', base64url.encode(authData.credID));
      })
      .catch((error) => {
        console.log('FAIL', error)
      })
  })
}

export function getAssertion() {

  this.makeCredential().then((credentialId) => {

    //let credentialId = new Uint8Array(base64url.decode(localStorage.getItem('CredID')))

    console.log(`CREDENTIAL ID`)
    console.log(credentialId)

    var challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    var publicKey = {
      challenge: challenge,
      allowCredentials: [
        { type: "public-key", id: credentialId }
      ]
    }

    navigator.credentials.get({ 'publicKey': publicKey })
      .then((getAssertionResponse) => {
        alert('SUCCESSFULLY GOT AN ASSERTION! Open your browser console!')
        console.log('SUCCESSFULLY GOT AN ASSERTION!', getAssertionResponse)
      })
      .catch((error) => {
        alert('Open your browser console!')
        console.log('FAIL', error)

      })

  })
}