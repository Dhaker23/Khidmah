import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Lists PUBLISHED services from APPROVED freelancers.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const where = {
      status: "PUBLISHED",
      ...(category ? { categoryId: category } : {}),
    };

    const services = await db.service.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [{ ordersCount: "desc" }, { rating: "desc" }],
      include: {
        freelancer: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            freelancerProfile: {
              select: { isPublic: true, verification: { select: { overallStatus: true } } },
            },
          },
        },
        packages: true,
      },
    });

    // Filter out services from non-public / unverified freelancers server-side
    const filtered = services.filter(
      (s) =>
        s.freelancer.freelancerProfile?.isPublic &&
        s.freelancer.freelancerProfile?.verification?.overallStatus === "VERIFIED"
    );

    return NextResponse.json({ count: filtered.length, results: filtered });
  } catch (e) {
    console.error("[api/services] error", e);
    return NextResponse.json(
      { error: "Unable to fetch services" },
      { status: 500 }
    );
  }
}
