import PaymentForm from "./payment-form";

type Institution = {
  name: string;
  code: string;
  type: string;
};

async function fetchInstitutions(): Promise<Institution[]> {
  const headers = {
    "API-Key": process.env.CLIENT_ID!,
    "Content-Type": "application/json",
  };
  const res = await fetch("https://api.paycrest.io/v1/institutions/NGN", {
    headers,
  });
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const institutions = await fetchInstitutions();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PaymentForm institutions={institutions} />
    </div>
  );
}
