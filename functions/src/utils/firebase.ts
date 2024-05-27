// Import the functions you need from the SDKs you need
import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: 'suimate-spot-trades',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHBG+N+x+dD8pP\nmREpMqqn7YslCGoIDXBlLxtzEArtaOrUc93z60JU5HilgzmqBH8V/nanII6Npr9a\ndnf7IzjQEpz+TR8G81xdpIrtXp0KAP0hCvIYfCBbe8000gCapBJy1F3ZiMXse3dD\nNwWrM2e9Dlm7BasNmO9IJmaJXU9dBJylkRzShSmW2ulw5M+/PrSNtzX2dSEk4M1c\nYFWCu7SxcdIbNh9WsptiVU47Q6fF58MBS4af6n69fm2JXScMsWPgQelJXxEybOE7\nzzb7C/JCzCsd7Gl2lB9/6zJYsOF/Yf6fhV88m/u0xo9TjDa988jOQePLLOYa8pIs\nHlR08ArNAgMBAAECggEABNvW3WCEJRF9nvPdt2PFRtRF0WGjNQ8e71l3EhgSLDmj\nggxSHuJffDMXvvK1NbFmaOMNgocI8+xeP5ck1rzFZk8OBidb2o+WcbLSsXjd3KCp\njWT3BCIDqDgdimyWFzBqQuNsZyMvsdZR0xJE0SkwHy16g1ZgFrTlIp3NYw0kIuEu\n3JxMmpbeYs3SK0Myzyn5j58VJRRTB1FKw2gcHhUec/j9JZucnNuGkiEkNubtf6MR\n4lkFsAk7rQ8FcjvkTsHNSHSvFE1Bgbsw1vhO8si5rSBlMSzo4bFvskYmbYiIu1xO\n3wjTWbCuW5/AtbeAk+nNytyYTIuRqKn4zScHqW9vAQKBgQD64nEJhkAUUVEcw6Ac\n5GZZ+D2dWsbLDEQk70KGnty4YUwOcb77lUDAvvH208L7WbwNn0AhCoBaL6GHiI+j\nP0Ed9PEB5DMXAwMB+DyReEVdTPVh9fHuWcMDhQX1giIOXfPsP9YSFIwSb86qDY1s\nws1itfzGdLLaX0GSpvxLhA8fHwKBgQDLE0Jw6m8qw5XNyJHOowooaJJu+3IotqQB\nRkG5a1prf5jJAan8ACSBadWGweE/2ijnt1bpQRt4BwgEhbVtnmGL9T3HPMxT8oCA\nMr/Hk3fJyLUigT395WftTnClNXGpjCTBMu7reVZNs1nDHkgFmDV8Y2hy6lZ+QYKv\nBSjx05VUkwKBgE+ZMpX8Ay6vEhYXNyCTkqmu6hWXrITVknVJeAjwNEVHkXLvwdFe\nbFn6+xf93doTgWetBBK3mzuB6zTuLex0cDuJ8EFSXqdJbFXepZDd4NwWQ7Bd8PFX\nh1kBhn97V0TJqE9nfYrk/AAJez9W52z/bVyJMvbgJbLFEC/wTRHEh2uvAoGBAILu\nAfJnVBFQVO9+l3OQ7uWqtm7Ts4DIcOlZcNqpenzAobNHXV9agC7oG4Fs01ulvqXX\nMTPmhF1YuzSfOKBacy4XiiNA8cRWH7+H+NomHB9/Rjne9icSl3ULE9mQoZ3c+32M\n5znu21PxhLgmd+0Te7idJySgLe/tMOLDAukXr7n9AoGARDYfi7ITL8ZnNAfyjxrW\nrNlq9V/ROKH3VEBcDj7ZaircW1gKEiVTWRkB/dopWv38WnrqLvrX+oOgx8kpiC+W\nUOObXbvwXwJmDyfKKnimD+/Vc0+g+gmc83vzxxwquqMSWnf9ui41gnrgo0x4wgSL\np7iGb09CmyujMDexgU12970=\n-----END PRIVATE KEY-----\n',
    clientEmail:
      'firebase-adminsdk-nx6mt@suimate-spot-trades.iam.gserviceaccount.com',
  }),
  databaseURL: 'https://suimate-spot-trades-default-rtdb.firebaseio.com',
};

// Initialize Firebase
const adminApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp(firebaseConfig);
const db = getFirestore(adminApp);
const rtdb = getDatabase(adminApp);

export { db, rtdb };

export default adminApp;
