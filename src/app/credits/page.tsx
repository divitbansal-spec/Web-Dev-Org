export const dynamic = "force-dynamic";

import { CREDIT_VALUE_INR } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ApiForm } from "@/components/api-client";

export default async function CreditPage() {
  const txs = await prisma.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { user: true } });
  return (
    <section>
      <h1>Credit Wallet</h1>
      <p>1 credit = ₹{CREDIT_VALUE_INR}. All payments, rewards, commissions, and penalties run in credits.</p>
      <ApiForm title="Buy Credits" endpoint="/api/transactions" defaultBody={JSON.stringify({ amount: 100 }, null, 2)} />
      <table className="table">
        <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>Note</th></tr></thead>
        <tbody>{txs.map((t) => <tr key={t.id}><td>{t.user.email}</td><td>{t.type}</td><td>{t.amount}</td><td>{t.note}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
