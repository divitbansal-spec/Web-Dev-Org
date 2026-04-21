export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ApiForm } from "@/components/api-client";

export default async function TesterDashboard() {
  const websites = await prisma.website.findMany({ where: { status: "TESTING" }, include: { developer: true } });
  const bugs = await prisma.bugReport.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <section>
      <h1>Tester Dashboard</h1>
      <ApiForm
        title="Submit Bug Report"
        endpoint="/api/bug-reports"
        defaultBody={JSON.stringify({ websiteId: "<website-id>", severity: "MEDIUM", description: "Login form allows empty payload under edge path." }, null, 2)}
      />
      <h3>Websites in testing phase</h3>
      <div className="grid">{websites.map((site) => <div className="card" key={site.id}>{site.title} ({site.developer.email})</div>)}</div>
      <h3>Bug reward history</h3>
      <table className="table"><thead><tr><th>Severity</th><th>Status</th><th>Reward</th></tr></thead><tbody>
        {bugs.map((b) => <tr key={b.id}><td>{b.severity}</td><td>{b.status}</td><td>{b.reward}</td></tr>)}
      </tbody></table>
    </section>
  );
}
