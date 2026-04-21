import { CREDIT_VALUE_INR } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function CreditPage() {
  const txs = await prisma.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { user: true } });
  return (
    <section>
      <h1>Credit System</h1>
      <p>1 credit = ₹{CREDIT_VALUE_INR}. Buy credits via POST /api/transactions</p>
      <table className="table">
        <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>Note</th></tr></thead>
        <tbody>{txs.map((t) => <tr key={t.id}><td>{t.user.email}</td><td>{t.type}</td><td>{t.amount}</td><td>{t.note}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
