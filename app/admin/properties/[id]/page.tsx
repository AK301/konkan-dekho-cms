
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Amenity = {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
};

type PropertyAmenity = {
    amenity: Amenity;
};

type Property = {
    id: string;
    name: string;
    slug: string;
    type: string;
    location: string;
    shortDescription: string | null;
    description: string | null;
    rooms: number | null;
    guests: number | null;
    price: number | null;
    phone: string | null;
    whatsapp: string | null;
    mapUrl: string | null;
    latitude: number | null;
    longitude: number | null;
    status: string;
    amenities?: PropertyAmenity[];
};

export default function EditPropertyPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState("");

    // Load property and amenities
    useEffect(() => {
        async function loadData() {
            try {
                const [propertyResponse, amenitiesResponse] =
                    await Promise.all([
                        fetch(`/api/properties/${id}`),
                        fetch("/api/amenities"),
                    ]);

                const propertyData = await propertyResponse.json();
                const amenitiesData = await amenitiesResponse.json();

                if (!propertyResponse.ok) {
                    throw new Error(
                        propertyData.error || "Property not found"
                    );
                }

                if (!amenitiesResponse.ok || !amenitiesData.success) {
                    throw new Error("Failed to load amenities.");
                }

                const loadedProperty = propertyData.property;

                setProperty(loadedProperty);
                setAmenities(amenitiesData.amenities);

                // Pre-select amenities already attached to property
                const existingAmenityIds =
                    loadedProperty.amenities?.map(
                        (item: PropertyAmenity) => item.amenity.id
                    ) ?? [];

                setSelectedAmenities(existingAmenityIds);
            } catch (error) {
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Failed to load property."
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setProperty((prev) =>
            prev
                ? {
                    ...prev,
                    [name]:
                        name === "rooms" ||
                            name === "guests" ||
                            name === "price"
                            ? value === ""
                                ? null
                                : Number(value)
                            : name === "latitude" ||
                                name === "longitude"
                                ? value === ""
                                    ? null
                                    : Number(value)
                                : value,
                }
                : prev
        );
    }

    function toggleAmenity(amenityId: string) {
        setSelectedAmenities((current) =>
            current.includes(amenityId)
                ? current.filter((id) => id !== amenityId)
                : [...current, amenityId]
        );
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!property) return;

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...property,
                    amenityIds: selectedAmenities,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Failed to update property."
                );
            }

            setProperty(data.property);

            const updatedAmenityIds =
                data.property.amenities?.map(
                    (item: PropertyAmenity) => item.amenity.id
                ) ?? [];

            setSelectedAmenities(updatedAmenityIds);

            setMessage("Property updated successfully.");
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to update property."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!property) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${property.name}"?`
        );

        if (!confirmed) return;

        setDeleting(true);

        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to delete property."
                );
            }

            router.push("/admin/properties");
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to delete property."
            );

            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
                <p className="text-sm text-gray-500">
                    Loading property...
                </p>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">
                        Property not found
                    </h1>

                    <button
                        onClick={() =>
                            router.push("/admin/properties")
                        }
                        className="mt-5 rounded-xl bg-[#1f2933] px-5 py-3 text-sm font-semibold text-white"
                    >
                        Back to Properties
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">

            {/* Header */}
            <header className="border-b border-[#dedbd3] bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7650]">
                            KonkanDekho CMS
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold">
                            Edit Property
                        </h1>
                    </div>

                    <button
                        onClick={() =>
                            router.push("/admin/properties")
                        }
                        className="rounded-xl border border-[#dedbd3] bg-white px-4 py-2 text-sm font-medium hover:bg-[#faf9f6]"
                    >
                        ← Back
                    </button>

                </div>
            </header>

            <div className="mx-auto max-w-6xl px-6 py-10">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* Basic Information */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                01
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Basic Information
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Property Name *
                                </label>

                                <input
                                    name="name"
                                    value={property.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Property Type *
                                </label>

                                <select
                                    name="type"
                                    value={property.type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#9a7650]"
                                >
                                    <option value="Homestay">
                                        Homestay
                                    </option>
                                    <option value="Villa">
                                        Villa
                                    </option>
                                    <option value="Resort">
                                        Resort
                                    </option>
                                    <option value="Hotel">
                                        Hotel
                                    </option>
                                    <option value="Apartment">
                                        Apartment
                                    </option>
                                    <option value="Guest House">
                                        Guest House
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Location *
                                </label>

                                <input
                                    name="location"
                                    value={property.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    URL Slug *
                                </label>

                                <input
                                    name="slug"
                                    value={property.slug}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Description */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                02
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Description
                            </h2>
                        </div>

                        <div className="space-y-6">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Short Description
                                </label>

                                <textarea
                                    name="shortDescription"
                                    value={property.shortDescription ?? ""}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Full Description
                                </label>

                                <textarea
                                    name="description"
                                    value={property.description ?? ""}
                                    onChange={handleChange}
                                    rows={7}
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Capacity */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                03
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Capacity & Pricing
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Rooms
                                </label>

                                <input
                                    name="rooms"
                                    type="number"
                                    value={property.rooms ?? ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Maximum Guests
                                </label>

                                <input
                                    name="guests"
                                    type="number"
                                    value={property.guests ?? ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Price / Night (₹)
                                </label>

                                <input
                                    name="price"
                                    type="number"
                                    value={property.price ?? ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Amenities */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                04
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Amenities
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Select all amenities available at this property.
                            </p>
                        </div>

                        {amenities.length === 0 ? (

                            <div className="rounded-xl border border-dashed border-[#dedbd3] px-5 py-8 text-center text-sm text-gray-500">
                                Loading amenities...
                            </div>

                        ) : (

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                {amenities.map((amenity) => {

                                    const selected =
                                        selectedAmenities.includes(
                                            amenity.id
                                        );

                                    return (
                                        <label
                                            key={amenity.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${selected
                                                    ? "border-[#9a7650] bg-[#f7f3ed]"
                                                    : "border-[#e5e1d8] hover:bg-[#faf9f6]"
                                                }`}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() =>
                                                    toggleAmenity(
                                                        amenity.id
                                                    )
                                                }
                                                className="h-4 w-4 accent-[#9a7650]"
                                            />

                                            <span className="text-sm font-medium">
                                                {amenity.name}
                                            </span>

                                        </label>
                                    );
                                })}

                            </div>
                        )}

                        {selectedAmenities.length > 0 && (
                            <p className="mt-4 text-sm text-[#9a7650]">
                                {selectedAmenities.length} amenities selected
                            </p>
                        )}

                    </section>

                    {/* Location */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                05
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Location
                            </h2>
                        </div>

                        <div className="space-y-6">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Google Maps URL
                                </label>

                                <input
                                    name="mapUrl"
                                    value={property.mapUrl ?? ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Latitude
                                    </label>

                                    <input
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        value={property.latitude ?? ""}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Longitude
                                    </label>

                                    <input
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        value={property.longitude ?? ""}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                    />
                                </div>

                            </div>

                        </div>
                    </section>

                    {/* Contact */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                06
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Contact
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={property.phone ?? ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    WhatsApp
                                </label>

                                <input
                                    name="whatsapp"
                                    value={property.whatsapp ?? ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Publishing */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">

                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                07
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Publishing
                            </h2>
                        </div>

                        <div className="max-w-md">

                            <label className="mb-2 block text-sm font-medium">
                                Status
                            </label>

                            <select
                                name="status"
                                value={property.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#9a7650]"
                            >
                                <option value="DRAFT">
                                    Draft
                                </option>

                                <option value="PUBLISHED">
                                    Published
                                </option>
                            </select>

                        </div>
                    </section>

                    {/* Actions */}
                    <section className="sticky bottom-4 rounded-2xl border border-[#dedbd3] bg-white/95 p-5 shadow-lg backdrop-blur">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                {message ? (
                                    <p
                                        className={`text-sm font-medium ${message.includes(
                                            "successfully"
                                        )
                                                ? "text-green-700"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {message}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Changes will be saved to Supabase.
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={
                                        deleting || saving
                                    }
                                    className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving || deleting
                                    }
                                    className="rounded-xl bg-[#1f2933] px-7 py-3 text-sm font-semibold text-white hover:bg-[#111827] disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </div>
                    </section>

                </form>
            </div>
        </main>
    );
}
