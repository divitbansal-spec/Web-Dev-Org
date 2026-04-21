import { prisma } from "@/lib/prisma";

export default async function DeveloperDashboard() {
  const websites = await prisma.website.findMany({ include: { bugReports: true, purchases: true }, orderBy: { createdAt: "desc" } });
  return (
    <section>
      <h1>Developer Dashboard</h1>
      <p>Upload website using POST /api/websites</p>
      <div className="grid">
        {websites.map((w) => (
          <article className="card" key={w.id}>
            <h3>{w.title}</h3>
            <p>Status: {w.status}</p>
            <p>Bug reports: {w.bugReports.length}</p>
            <p>Sales: {w.purchases.length}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
