import { useEffect, useRef } from "react";
import type { PaymentInitiateResponse } from "../services/api";

interface Props {
  paymentUrl: string;
  paymentData: NonNullable<PaymentInitiateResponse["paymentData"]>;
}

export default function EsewaRedirectForm({ paymentUrl, paymentData }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Auto-submit the instant this component mounts
    formRef.current?.submit();
  }, []);

  return (
    <form ref={formRef} action={paymentUrl} method="POST" style={{ display: "none" }}>
      <input type="hidden" name="amount" value={paymentData.amount} />
      <input type="hidden" name="tax_amount" value={paymentData.tax_amount} />
      <input type="hidden" name="total_amount" value={paymentData.total_amount} />
      <input type="hidden" name="transaction_uuid" value={paymentData.transaction_uuid} />
      <input type="hidden" name="product_code" value={paymentData.product_code} />
      <input type="hidden" name="product_service_charge" value={paymentData.product_service_charge} />
      <input type="hidden" name="product_delivery_charge" value={paymentData.product_delivery_charge} />
      <input type="hidden" name="success_url" value={paymentData.success_url} />
      <input type="hidden" name="failure_url" value={paymentData.failure_url} />
      <input type="hidden" name="signed_field_names" value={paymentData.signed_field_names} />
      <input type="hidden" name="signature" value={paymentData.signature} />
    </form>
  );
}