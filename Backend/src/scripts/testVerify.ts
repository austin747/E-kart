import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";

const SECRET_KEY = process.env.ESEWA_SECRET_KEY as string;

// 👇 CHANGE these two values to match a REAL pending transaction from your DB
const totalAmount = "9996";
const transactionUuid = "f124f1eb-5d4f-4c7f-b1a4-5eca5203ec74";

const productCode = "EPAYTEST";

const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
const signature = crypto.createHmac("sha256", SECRET_KEY).update(message).digest("base64");

const fakePayload = {
  transaction_code: "TEST123",
  status: "COMPLETE",
  total_amount: totalAmount,
  transaction_uuid: transactionUuid,
  product_code: productCode,
  signed_field_names: "total_amount,transaction_uuid,product_code",
  signature,
};

const encoded = Buffer.from(JSON.stringify(fakePayload)).toString("base64");

console.log("\n✅ Fake base64 payload (paste this in Postman as ?data=):\n");
console.log(encoded);
console.log("\n");