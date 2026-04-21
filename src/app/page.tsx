export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featured = await prisma.website.findMany({ where: { status: "PUBLISHED" }, take: 6, orderBy: { createdAt: "desc" } });
  return (
    <section>
      <h1>Web Dev Org Marketplace MVP</h1>
      <p>Buy and sell ready-made websites with developer, tester, and admin quality workflow powered by credits.</p>
      <p><strong>1 Credit = ₹15</strong></p>
      <div>
        <Link className="btn" href="/marketplace">Buy Websites</Link>
        <Link className="btn" href="/dashboard/developer">Sell as Developer</Link>
      </div>
      <h2>Featured Websites</h2>
      <div className="grid">
        {featured.map((site) => (
          <article key={site.id} className="card">
            <h3>{site.title}</h3>
            <p>{site.techStack}</p>
            <p>{site.price} credits</p>
            <Link href={`/websites/${site.id}`}>View</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
