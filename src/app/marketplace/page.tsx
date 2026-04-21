export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ tech?: string; maxPrice?: string }> }) {
  const params = await searchParams;
  const websites = await prisma.website.findMany({
    where: {
      status: "PUBLISHED",
      techStack: params.tech ? { contains: params.tech, mode: "insensitive" } : undefined,
      price: params.maxPrice ? { lte: Number(params.maxPrice) } : undefined
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section>
      <h1>Marketplace</h1>
      <form>
        <label>Tech stack filter</label>
        <input name="tech" defaultValue={params.tech} />
        <label>Max credits</label>
        <input type="number" name="maxPrice" defaultValue={params.maxPrice} />
        <button className="btn" type="submit">Apply</button>
      </form>
      <div className="grid">
        {websites.map((site) => (
          <article className="card" key={site.id}>
            <h3>{site.title}</h3>
            <p>{site.description}</p>
            <p>Rating: {site.avgRating.toFixed(1)}</p>
            <p>{site.price} credits</p>
            <a href={site.previewLink} target="_blank">Preview</a>
            <Link href={`/websites/${site.id}`}>Buy</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
