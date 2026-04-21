export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ApiForm } from "@/components/api-client";

export default async function AdminPanelPage() {
  const websites = await prisma.website.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  const bugs = await prisma.bugReport.findMany({ where: { status: "PENDING" }, take: 20 });
  const users = await prisma.user.findMany({ take: 20, orderBy: { createdAt: "desc" } });

  return (
    <section>
      <h1>Admin Control Panel</h1>
      <p>Login with POST /api/auth/admin-login first, then use returned JWT for admin actions below.</p>
      <div className="grid">
        <ApiForm title="Website Review" endpoint="/api/admin/website-review" defaultBody={JSON.stringify({ websiteId: "<id>", action: "APPROVE", price: 150 }, null, 2)} />
        <ApiForm title="Bug Review" endpoint="/api/admin/bug-review" defaultBody={JSON.stringify({ bugId: "<id>", action: "APPROVE", adminNote: "Valid issue" }, null, 2)} />
        <ApiForm title="Unlock Credits" endpoint="/api/admin/unlock-credits" defaultBody={JSON.stringify({ userId: "<id>", amount: 20 }, null, 2)} />
        <ApiForm title="Manage Users" endpoint="/api/admin/users" defaultBody={JSON.stringify({ userId: "<id>", action: "APPROVE" }, null, 2)} />
      </div>
      <h3>Website moderation queue</h3>
      <ul>{websites.map((w) => <li key={w.id}>{w.title} - {w.status}</li>)}</ul>
      <h3>Pending bug reports</h3>
      <ul>{bugs.map((b) => <li key={b.id}>{b.severity} - {b.description}</li>)}</ul>
      <h3>Users</h3>
      <ul>{users.map((u) => <li key={u.id}>{u.email} ({u.role}) approved:{String(u.approved)} banned:{String(u.banned)}</li>)}</ul>
    </section>
  );
}
