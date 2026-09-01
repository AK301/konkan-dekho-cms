
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Amenity = {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
};

export default function NewPropertyPage() {
    const router = useRouter();

    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        type: "",
        location: "",
        shortDescription: "",
        description: "",
        rooms: "",
        guests: "",
        price: "",
        phone: "",
        whatsapp: "",
        mapUrl: "",
        latitude: "",
        longitude: "",
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchAmenities() {
            try {
                const response = await fetch("/api/amenities");
                const data = await response.json();

                if (data.success) {
                    setAmenities(data.amenities);
                }
            } catch (error) {
                console.error("Failed to fetch amenities:", error);
            }
        }

        fetchAmenities();
    }, []);

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
            ...(name === "name" && {
                slug: generateSlug(value),
            }),
        }));
    }

    function toggleAmenity(amenityId: string) {
        setSelectedAmenities((current) =>
            current.includes(amenityId)
                ? current.filter((id) => id !== amenityId)
                : [...current, amenityId]
        );
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    slug: form.slug,
                    type: form.type,
                    location: form.location,

                    shortDescription:
                        form.shortDescription || null,

                    description:
                        form.description || null,

                    rooms: form.rooms
                        ? Number(form.rooms)
                        : null,

                    guests: form.guests
                        ? Number(form.guests)
                        : null,

                    price: form.price
                        ? Number(form.price)
                        : null,

                    phone: form.phone || null,
                    whatsapp: form.whatsapp || null,
                    mapUrl: form.mapUrl || null,

                    latitude: form.latitude
                        ? Number(form.latitude)
                        : null,

                    longitude: form.longitude
                        ? Number(form.longitude)
                        : null,

                    amenityIds: selectedAmenities,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Failed to save property."
                );
            }

            setMessage("Property saved successfully!");

            setTimeout(() => {
                router.push("/admin/properties");
            }, 1000);
        } catch (error) {
            console.error("Save property error:", error);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to save property."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">

            <header className="border-b border-[#dedbd3] bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7650]">
                            KonkanDekho CMS
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold">
                            Add Property
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/admin/properties")
                        }
                        className="rounded-lg border border-[#dedbd3] px-4 py-2 text-sm font-medium transition hover:bg-[#faf9f6]"
                    >
                        Back
                    </button>

                </div>
            </header>

            <div className="mx-auto max-w-5xl px-6 py-10">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Basic Information */}

                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Basic details about the property.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Property Name *
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Sunset Cove"
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none transition focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Property Type *
                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-[#dedbd3] bg-white px-4 py-3 outline-none focus:border-[#9a7650]"
                                >
                                    <option value="">
                                        Select type
                                    </option>

                                    <option value="Homestay">
                                        Homestay
                                    </option>

                                    <option value="Villa">
                                        Villa
                                    </option>

                                    <option value="Hotel">
                                        Hotel
                                    </option>

                                    <option value="Resort">
                                        Resort
                                    </option>

                                    <option value="Apartment">
                                        Apartment
                                    </option>

                                    <option value="Lodge">
                                        Lodge
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Location *
                                </label>

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="Aare-Ware, Ganpatipule"
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Slug *
                                </label>

                                <input
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    required
                                    placeholder="sunset-cove"
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Automatically generated from the property name.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Description */}

                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Description
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Information that will appear on the property page.
                            </p>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Short Description
                                </label>

                                <textarea
                                    name="shortDescription"
                                    value={form.shortDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="A short description of the property..."
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Full Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={7}
                                    placeholder="Detailed property description..."
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Capacity & Pricing */}

                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Capacity & Pricing
                            </h2>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Rooms
                                </label>

                                <input
                                    name="rooms"
                                    type="number"
                                    min="0"
                                    value={form.rooms}
                                    onChange={handleChange}
                                    placeholder="10"
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guests
                                </label>

                                <input
                                    name="guests"
                                    type="number"
                                    min="0"
                                    value={form.guests}
                                    onChange={handleChange}
                                    placeholder="20"
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Price / Night
                                </label>

                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Amenities */}

                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
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
                                            className={`flex cursor - pointer items - center gap - 3 rounded - xl border p - 4 transition ${selected
                                                ? "border-[#9a7650] bg-[#f7f3ed]"
                                                : "border-[#e5e1d8] hover:bg-[#faf9f6]"
                                                } `}
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

                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Location
                            </h2>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Google Maps URL
                                </label>

                                <input
                                    name="mapUrl"
                                    value={form.mapUrl}
                                    onChange={handleChange}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Latitude
                                    </label>

                                    <input
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="16.8485"
                                        className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
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
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="73.2887"
                                        className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                    />
                                </div>

                            </div>

                        </div>
                    </section>

                    {/* Contact */}

                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Contact
                            </h2>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91..."
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    WhatsApp
                                </label>

                                <input
                                    name="whatsapp"
                                    type="tel"
                                    value={form.whatsapp}
                                    onChange={handleChange}
                                    placeholder="+91..."
                                    className="w-full rounded-xl border border-[#dedbd3] px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Save */}

                    <div className="flex items-center justify-between rounded-2xl border border-[#dedbd3] bg-white p-5">

                        <div>
                            {message && (
                                <p
                                    className={`text - sm font - medium ${message.includes("success")
                                        ? "text-green-600"
                                        : "text-red-600"
                                        } `}
                                >
                                    {message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[#1f2933] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Property"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}