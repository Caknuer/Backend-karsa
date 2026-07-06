const admin = require("firebase-admin");

const serviceAccountKey = require("../../firebase-servis-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

module.exports = admin;