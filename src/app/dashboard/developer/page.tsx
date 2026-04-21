export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ApiForm } from "@/components/api-client";

export default async function DeveloperDashboard() {
  const websites = await prisma.website.findMany({ include: { bugReports: true, purchases: true }, orderBy: { createdAt: "desc" } });
  return (
    <section>
      <h1>Developer Dashboard</h1>
      <div className="grid">
        <ApiForm
          title="Upload Website"
          endpoint="/api/websites"
          defaultBody={JSON.stringify({
            title: "SaaS Landing Page",
            description: "Production-ready landing page with CMS integration",
            techStack: "Next.js, Tailwind, Prisma",
            price: 120,
            previewLink: "https://github.com/example/repo",
            images: []
          }, null, 2)}
        />
      </div>
      <h3>Your submissions</h3>
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
