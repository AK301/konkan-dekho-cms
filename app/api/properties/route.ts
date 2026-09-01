
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            properties,
        });
    } catch (error) {
        console.error("Fetch properties error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch properties.",
            },
            {
                status: 500,
            }
        );
    }
}

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

            amenityIds,
        } = body;

        // Basic validation
        if (!name || !slug || !type || !location) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Name, slug, type and location are required.",
                },
                {
                    status: 400,
                }
            );
        }

        // Make sure amenityIds is always an array
        const selectedAmenityIds: string[] = Array.isArray(amenityIds)
            ? amenityIds
            : [];

        // Create property + amenities together
        const property = await prisma.property.create({
            data: {
                name,
                slug,
                type,
                location,

                shortDescription:
                    shortDescription || null,

                description:
                    description || null,

                rooms:
                    rooms !== null && rooms !== undefined && rooms !== ""
                        ? Number(rooms)
                        : null,

                guests:
                    guests !== null && guests !== undefined && guests !== ""
                        ? Number(guests)
                        : null,

                price:
                    price !== null && price !== undefined && price !== ""
                        ? Number(price)
                        : null,

                phone:
                    phone || null,

                whatsapp:
                    whatsapp || null,

                mapUrl:
                    mapUrl || null,

                latitude:
                    latitude !== null &&
                        latitude !== undefined &&
                        latitude !== ""
                        ? Number(latitude)
                        : null,

                longitude:
                    longitude !== null &&
                        longitude !== undefined &&
                        longitude !== ""
                        ? Number(longitude)
                        : null,

                status: "DRAFT",

                amenities: {
                    create: selectedAmenityIds.map(
                        (amenityId) => ({
                            amenity: {
                                connect: {
                                    id: amenityId,
                                },
                            },
                        })
                    ),
                },
            },

            include: {
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                property,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Create property error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create property.",
            },
            {
                status: 500,
            }
        );
    }
}

