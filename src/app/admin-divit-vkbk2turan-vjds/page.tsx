import { prisma } from "@/lib/prisma";

export default async function AdminPanelPage() {
  const websites = await prisma.website.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  const bugs = await prisma.bugReport.findMany({ where: { status: "PENDING" }, take: 20 });
  const users = await prisma.user.findMany({ take: 20, orderBy: { createdAt: "desc" } });

  return (
    <section>
      <h1>Admin Control Panel</h1>
      <p>Admin auth endpoint: POST /api/auth/admin-login with email, password, and pin sequence [1426,6241,7777]</p>
      <h3>Website moderation</h3>
      <ul>{websites.map((w) => <li key={w.id}>{w.title} - {w.status}</li>)}</ul>
      <h3>Pending bug reports</h3>
      <ul>{bugs.map((b) => <li key={b.id}>{b.severity} - {b.description}</li>)}</ul>
      <h3>Users</h3>
      <ul>{users.map((u) => <li key={u.id}>{u.email} ({u.role}) approved:{String(u.approved)} banned:{String(u.banned)}</li>)}</ul>
    </section>
  );
}
