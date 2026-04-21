import { prisma } from "@/lib/prisma";

export default async function UserDashboard() {
  const purchases = await prisma.purchase.findMany({ include: { website: true, user: true }, orderBy: { createdAt: "desc" } });

  return (
    <section>
      <h1>User Dashboard</h1>
      <p>Purchased websites, ratings, and credits history.</p>
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
