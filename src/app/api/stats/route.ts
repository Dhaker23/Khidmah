import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Returns platform-wide stats for the homepage trust strip.
// Only counts APPROVED freelancers — never pending/rejected.
export async function GET() {
  try {
    const [
      approvedFreelancers,
      completedProjects,
      totalReviews,
      avgRatingAgg,
      countriesAgg,
      citiesAgg,
    ] = await Promise.all([
      db.freelancerProfile.count({
        where: { isPublic: true, verification: { overallStatus: "VERIFIED" } },
      }),
      db.contract.count({ where: { status: "COMPLETED" } }),
      db.review.count({ where: { isPublic: true } }),
      db.review.aggregate({ _avg: { rating: true } }),
      db.user.findMany({
        where: { accountType: "FREELANCER" },
        select: { profile: { select: { country: true } } },
        distinct: ["id"],
      }),
      db.user.findMany({
        where: { accountType: "FREELANCER" },
        select: { profile: { select: { city: true } } },
        distinct: ["id"],
      }),
    ]);

    const countries = new Set(
      countriesAgg.map((u) => u.profile?.country).filter(Boolean) as string[]
    );
    const cities = new Set(
      citiesAgg.map((u) => u.profile?.city).filter(Boolean) as string[]
    );

    return NextResponse.json({
      verifiedFreelancers: approvedFreelancers,
      completedProjects,
      totalReviews,
      avgRating: avgRatingAgg._avg.rating ?? 0,
      countries: countries.size,
      cities: cities.size,
      // NOTE: do NOT expose private user data here.
    });
  } catch (e) {
    console.error("[api/stats] error", e);
    return NextResponse.json(
      { error: "Unable to load platform stats" },
      { status: 500 }
    );
  }
}
