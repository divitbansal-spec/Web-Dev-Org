import { prisma } from "@/lib/prisma";

export default async function TesterDashboard() {
  const websites = await prisma.website.findMany({ where: { status: "TESTING" }, include: { developer: true } });
  const bugs = await prisma.bugReport.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <section>
      <h1>Tester Dashboard</h1>
      <p>Submit bugs via POST /api/bug-reports</p>
      <h3>Assigned websites in testing phase</h3>
      <div className="grid">{websites.map((site) => <div className="card" key={site.id}>{site.title} ({site.developer.email})</div>)}</div>
      <h3>Your bug rewards</h3>
      <table className="table"><thead><tr><th>Severity</th><th>Status</th><th>Reward (credits)</th></tr></thead><tbody>
        {bugs.map((b) => <tr key={b.id}><td>{b.severity}</td><td>{b.status}</td><td>{b.reward}</td></tr>)}
      </tbody></table>
    </section>
  );
}
