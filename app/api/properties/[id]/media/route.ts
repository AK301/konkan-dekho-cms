import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET /api/properties/[id]/media
export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const media = await prisma.propertyMedia.findMany({
            where: {
                propertyId: id,
            },
            orderBy: [
                { sortOrder: "asc" },
                { createdAt: "asc" },
            ],
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("Failed to fetch property media:", error);

        return NextResponse.json(
            { error: "Failed to fetch property media" },
            { status: 500 }
        );
    }
}

// POST /api/properties/[id]/media
export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const {
            type,
            category,
            url,
            thumbnail,
            fileName,
            altText,
            sortOrder,
            isCover,
        } = body;

        if (!type || !category || !url) {
            return NextResponse.json(
                {
                    error: "type, category and url are required",
                },
                { status: 400 }
            );
        }

        const property = await prisma.property.findUnique({
            where: {
                id,
            },
        });

        if (!property) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }

        const media = await prisma.propertyMedia.create({
            data: {
                propertyId: id,
                type,
                category,
                url,
                thumbnail: thumbnail || null,
                fileName: fileName || null,
                altText: altText || null,
                sortOrder: sortOrder ?? 0,
                isCover: isCover ?? false,
            },
        });

        return NextResponse.json(media, { status: 201 });
    } catch (error) {
        console.error("Failed to create property media:", error);

        return NextResponse.json(
            { error: "Failed to create property media" },
            { status: 500 }
        );
    }
}