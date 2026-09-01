import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const amenities = await prisma.amenity.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            amenities,
        });
    } catch (error) {
        console.error("Fetch amenities error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch amenities.",
            },
            { status: 500 }
        );
    }
}