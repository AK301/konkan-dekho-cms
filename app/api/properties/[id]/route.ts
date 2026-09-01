
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const property = await prisma.property.findUnique({
            where: {
                id,
            },
            include: {
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });

        if (!property) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Property not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            property,
        });
    } catch (error) {
        console.error("Fetch property error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch property.",
            },
            {
                status: 500,
            }
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

            amenityIds,
        } = body;

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

        const selectedAmenityIds: string[] =
            Array.isArray(amenityIds)
                ? amenityIds
                : [];

        // Update property and amenities together
        const property = await prisma.$transaction(
            async (transaction) => {

                // 1. Update the property itself
                await transaction.property.update({
                    where: {
                        id,
                    },
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
                            rooms !== null &&
                                rooms !== undefined &&
                                rooms !== ""
                                ? Number(rooms)
                                : null,

                        guests:
                            guests !== null &&
                                guests !== undefined &&
                                guests !== ""
                                ? Number(guests)
                                : null,

                        price:
                            price !== null &&
                                price !== undefined &&
                                price !== ""
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

                        status:
                            status || "DRAFT",
                    },
                });

                // 2. Remove old amenity relationships
                await transaction.propertyAmenity.deleteMany({
                    where: {
                        propertyId: id,
                    },
                });

                // 3. Create the newly selected relationships
                if (selectedAmenityIds.length > 0) {
                    await transaction.propertyAmenity.createMany({
                        data: selectedAmenityIds.map(
                            (amenityId) => ({
                                propertyId: id,
                                amenityId,
                            })
                        ),
                        skipDuplicates: true,
                    });
                }

                // 4. Return updated property with amenities
                return transaction.property.findUnique({
                    where: {
                        id,
                    },
                    include: {
                        amenities: {
                            include: {
                                amenity: true,
                            },
                        },
                    },
                });
            }
        );

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
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const property = await prisma.property.findUnique({
            where: {
                id,
            },
        });

        if (!property) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Property not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await prisma.property.delete({
            where: {
                id,
            },
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
            {
                status: 500,
            }
        );
    }
}

