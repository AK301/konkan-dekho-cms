import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
        mediaId: string;
    }>;
};

// PUT /api/properties/[id]/media/[mediaId]
export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id, mediaId } = await context.params;
        const body = await request.json();

        const existingMedia = await prisma.propertyMedia.findFirst({
            where: {
                id: mediaId,
                propertyId: id,
            },
        });

        if (!existingMedia) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

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

        const media = await prisma.propertyMedia.update({
            where: {
                id: mediaId,
            },
            data: {
                ...(type !== undefined && { type }),
                ...(category !== undefined && { category }),
                ...(url !== undefined && { url }),
                ...(thumbnail !== undefined && { thumbnail }),
                ...(fileName !== undefined && { fileName }),
                ...(altText !== undefined && { altText }),
                ...(sortOrder !== undefined && { sortOrder }),
                ...(isCover !== undefined && { isCover }),
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("Failed to update property media:", error);

        return NextResponse.json(
            { error: "Failed to update property media" },
            { status: 500 }
        );
    }
}

// DELETE /api/properties/[id]/media/[mediaId]
export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        const { id, mediaId } = await context.params;

        const existingMedia = await prisma.propertyMedia.findFirst({
            where: {
                id: mediaId,
                propertyId: id,
            },
        });

        if (!existingMedia) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

        await prisma.propertyMedia.delete({
            where: {
                id: mediaId,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Media deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete property media:", error);

        return NextResponse.json(
            { error: "Failed to delete property media" },
            { status: 500 }
        );
    }
}