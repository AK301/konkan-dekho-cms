import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    _request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json(
                { error: "Property not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            property,
        });
    } catch (error) {
        console.error("Fetch property error:", error);

        return NextResponse.json(
            { error: "Failed to fetch property." },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const {
            name,
            slug,
            type,
            location,
            shortDescription,
            description,
            rooms,
            guests,
            price,
            phone,
            whatsapp,
            mapUrl,
            latitude,
            longitude,
            status,
        } = body;

        if (!name || !slug || !type || !location) {
            return NextResponse.json(
                {
                    error: "Name, slug, type and location are required.",
                },
                { status: 400 }
            );
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                name,
                slug,
                type,
                location,

                shortDescription: shortDescription || null,
                description: description || null,

                rooms: rooms ? Number(rooms) : null,
                guests: guests ? Number(guests) : null,
                price: price ? Number(price) : null,

                phone: phone || null,
                whatsapp: whatsapp || null,
                mapUrl: mapUrl || null,

                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,

                status: status || "DRAFT",
            },
        });

        return NextResponse.json({
            success: true,
            property,
        });
    } catch (error) {
        console.error("Update property error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to update property.",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        await prisma.property.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Property deleted successfully.",
        });
    } catch (error) {
        console.error("Delete property error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete property.",
            },
            { status: 500 }
        );
    }
}