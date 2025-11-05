const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({}, { collection: "bulkmail" });

module.exports = mongoose.model("Credential", credentialSchema);
