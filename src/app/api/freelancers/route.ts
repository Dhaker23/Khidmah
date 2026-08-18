import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Lists APPROVED freelancers only.
// Pending/rejected freelancers MUST NEVER appear in this list.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const minRate = Number(searchParams.get("minRate") ?? 0);
    const maxRate = Number(searchParams.get("maxRate") ?? 1000);
    const verifiedOnly = searchParams.get("verified") === "true";
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const where = {
      isPublic: true,
      verification: verifiedOnly
        ? { overallStatus: "VERIFIED" }
        : { overallStatus: { not: "UNVERIFIED" } }, // hide fully unverified
      hourlyRate: { gte: minRate, lte: maxRate },
      ...(category ? { primaryCategoryId: category } : {}),
      ...(search
        ? {
            OR: [
              { professionalTitle: { contains: search } },
              { professionalBio: { contains: search } },
              { user: { fullName: { contains: search } } },
              { user: { username: { contains: search } } },
            ],
          }
        : {}),
    };

    const freelancers = await db.freelancerProfile.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [{ isFeatured: "desc" }, { completionScore: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            emailVerified: true,
            phoneVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      count: freelancers.length,
      results: freelancers,
    });
  } catch (e) {
    console.error("[api/freelancers] error", e);
    return NextResponse.json(
      { error: "Unable to fetch freelancers" },
      { status: 500 }
    );
  }
}
