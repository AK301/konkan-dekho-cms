"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Property = {
    id: string;
    name: string;
    slug: string;
    type: string;
    location: string;
    rooms: number | null;
    guests: number | null;
    price: number | null;
    status: string;
};

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProperties() {
            try {
                const response = await fetch("/api/properties");
                const data = await response.json();

                if (data.success) {
                    setProperties(data.properties);
                }
            } catch (error) {
                console.error("Failed to load properties:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProperties();
    }, []);

    return (
        <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">

            {/* Header */}
            <header className="border-b border-[#dedbd3] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7650]">
                            KonkanDekho CMS
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold">
                            Properties
                        </h1>
                    </div>

                    <Link
                        href="/admin/properties/new"
                        className="rounded-xl bg-[#1f2933] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111827]"
                    >
                        + Add Property
                    </Link>

                </div>
            </header>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Stats */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-6">
                        <p className="text-sm text-gray-500">
                            Total Properties
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {properties.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-6">
                        <p className="text-sm text-gray-500">
                            Published
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {
                                properties.filter(
                                    (property) => property.status === "PUBLISHED"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-6">
                        <p className="text-sm text-gray-500">
                            Drafts
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {
                                properties.filter(
                                    (property) => property.status === "DRAFT"
                                ).length
                            }
                        </p>
                    </div>

                </div>

                {/* Property List */}
                <div className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-white">

                    <div className="border-b border-[#dedbd3] px-6 py-5">
                        <h2 className="font-semibold">
                            All Properties
                        </h2>
                    </div>

                    {loading ? (

                        <div className="px-6 py-12 text-center text-sm text-gray-500">
                            Loading properties...
                        </div>

                    ) : properties.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <p className="text-lg font-medium">
                                No properties yet
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Add your first property to get started.
                            </p>

                            <Link
                                href="/admin/properties/new"
                                className="mt-6 inline-block rounded-xl bg-[#1f2933] px-5 py-3 text-sm font-semibold text-white"
                            >
                                Add Property
                            </Link>

                        </div>

                    ) : (

                        <div className="divide-y divide-[#eeeae2]">

                            {properties.map((property) => (

                                <div
                                    key={property.id}
                                    className="flex flex-col gap-5 px-6 py-6 transition hover:bg-[#faf9f6] md:flex-row md:items-center md:justify-between"
                                >

                                    {/* Property info */}
                                    <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <h3 className="text-lg font-semibold">
                                                {property.name}
                                            </h3>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${property.status === "PUBLISHED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {property.status}
                                            </span>

                                        </div>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {property.type} · {property.location}
                                        </p>

                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-wrap gap-8 text-sm">

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Rooms
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {property.rooms ?? "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Guests
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {property.guests ?? "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Price
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {property.price
                                                    ? `₹${property.price.toLocaleString()}`
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Slug
                                            </p>

                                            <p className="mt-1 max-w-[150px] truncate font-medium">
                                                {property.slug}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Action */}
                                    <Link
                                        href={`/admin/properties/${property.id}`}
                                        className="rounded-lg border border-[#dedbd3] px-4 py-2 text-sm font-medium transition hover:bg-white"
                                    >
                                        Edit
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </main>
    );
}