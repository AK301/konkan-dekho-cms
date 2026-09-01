import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
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
        } = body;

        if (!name || !slug || !type || !location) {
            return NextResponse.json(
                {
                    error: "Name, slug, type and location are required.",
                },
                { status: 400 }
            );
        }

        const property = await prisma.property.create({
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

                status: "DRAFT",
            },
        });

        return NextResponse.json(
            {
                success: true,
                property,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create property error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create property.",
            },
            { status: 500 }
        );
    }
}