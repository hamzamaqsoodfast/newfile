const admin = require('firebase-admin');

const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://airo-email-extractor-default-rtdb.firebaseio.com"
});

const database = admin.database();

const purchasekey = "mianmannan98@gmail.com";
const email = "mianmannan98@gmail.com";

database.ref('users').push({
  purchasekey: purchasekey,
  email: email
})
  .then(() => {
    console.log("Data pushed successfully.");
  })
  .catch((error) => {
    console.error("Error pushing data:", error);
  });
