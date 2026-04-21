export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function WebsiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const website = await prisma.website.findUnique({ where: { id }, include: { developer: true, bugReports: true } });
  if (!website) return <p>Website not found.</p>;

  return (
    <section>
      <h1>{website.title}</h1>
      <p>{website.description}</p>
      <p>Tech stack: {website.techStack}</p>
      <p>Price: {website.price} credits</p>
      <p>Status: {website.status}</p>
      <a className="btn" href={website.previewLink} target="_blank">Open Demo</a>
      <h3>Buy Website</h3>
      <p>POST /api/purchase with userId + websiteId to complete purchase and release locked commission.</p>
    </section>
  );
}
