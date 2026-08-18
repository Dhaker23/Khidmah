import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Lists OPEN jobs from verified clients.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type"); // FIXED | HOURLY
    const level = searchParams.get("level"); // Entry | Intermediate | Expert
    const verifiedOnly = searchParams.get("verified") === "true";
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const where = {
      status: "OPEN",
      ...(category ? { categoryId: category } : {}),
      ...(type ? { type } : {}),
      ...(level ? { experienceLevel: level } : {}),
      ...(verifiedOnly ? { verifiedClientOnly: true } : {}),
    };

    const jobs = await db.job.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            clientProfile: { select: { isVerified: true } },
          },
        },
      },
    });

    return NextResponse.json({ count: jobs.length, results: jobs });
  } catch (e) {
    console.error("[api/jobs] error", e);
    return NextResponse.json(
      { error: "Unable to fetch jobs" },
      { status: 500 }
    );
  }
}
