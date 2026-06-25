import crypto from "crypto";

export function generateEsewaSignature(
  totalAmount: string | number,
  transactionUuid: string,
  productCode: string
): string {
  const SECRET_KEY = process.env.ESEWA_SECRET_KEY as string;

  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(message);
  return hmac.digest("base64");
}

export interface EsewaCallbackPayload {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

export function decodeEsewaResponse(encodedData: string): EsewaCallbackPayload {
  const decoded = Buffer.from(encodedData, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

export function verifyEsewaSignature(payload: EsewaCallbackPayload): boolean {
  const SECRET_KEY = process.env.ESEWA_SECRET_KEY as string;

  const fieldNames = payload.signed_field_names.split(",");

  const message = fieldNames
    .map((field) => `${field}=${(payload as unknown as Record<string, string>)[field]}`)
    .join(",");

  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(message);
  const expectedSignature = hmac.digest("base64");

  return expectedSignature === payload.signature;
}