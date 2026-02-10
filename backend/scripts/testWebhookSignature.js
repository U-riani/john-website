import crypto from "crypto";

const body = JSON.stringify({
  reference: "REF-6946629b5c84d1507d89d33b",
  status: "success",
});

const secret = "super-secret-string-from-unipay";

const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

console.log("Signature:", signature);
console.log("Body:", body);
