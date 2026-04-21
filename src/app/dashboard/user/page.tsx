export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ApiForm } from "@/components/api-client";

export default async function UserDashboard() {
  const purchases = await prisma.purchase.findMany({ include: { website: true, user: true }, orderBy: { createdAt: "desc" } });

  return (
    <section>
      <h1>User Dashboard</h1>
      <div className="grid">
        <ApiForm
          title="Buy Credits"
          endpoint="/api/transactions"
          defaultBody={JSON.stringify({ amount: 200 }, null, 2)}
        />
        <ApiForm
          title="Purchase Website + Rate"
          endpoint="/api/purchase"
          defaultBody={JSON.stringify({ websiteId: "<published-website-id>", rating: 5 }, null, 2)}
        />
      </div>
      <h3>Purchased websites</h3>
      <div className="grid">
        {purchases.map((p) => (
          <article className="card" key={p.id}>
            <h3>{p.website.title}</h3>
            <p>Buyer: {p.user.email}</p>
            <p>Rating: {p.rating ?? "Not rated"}</p>
            <p>{p.bonusNote ?? "No reward yet"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
