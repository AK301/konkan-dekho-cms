"use client";

import { FormEvent, useState } from "react";

export default function NewPropertyPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        slug: "",
        type: "Homestay",
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

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;

        setForm((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create property");
            }

            setMessage("Property saved successfully!");

            setForm({
                name: "",
                slug: "",
                type: "Homestay",
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
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
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

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Add Property
                        </h1>
                    </div>

                    <div className="rounded-full border border-[#dedbd3] bg-[#faf9f6] px-4 py-2 text-sm text-gray-600">
                        Draft
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="mx-auto max-w-6xl px-6 py-10">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Information */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                01
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Enter the primary details of the property.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Property Name *
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Sunset Cove"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7650] focus:ring-2 focus:ring-[#9a7650]/10"
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
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#9a7650]"
                                >
                                    <option>Homestay</option>
                                    <option>Villa</option>
                                    <option>Resort</option>
                                    <option>Hotel</option>
                                    <option>Apartment</option>
                                    <option>Guest House</option>
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
                                    placeholder="e.g. Aare-Ware, Ganpatipule"
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
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="sunset-cove"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    Automatically generated from the property name.
                                </p>
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
                                Property Description
                            </h2>
                        </div>

                        <div className="space-y-6">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Short Description
                                </label>

                                <textarea
                                    name="shortDescription"
                                    value={form.shortDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="A short description used for cards and previews..."
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
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
                                    placeholder="Describe the property, experience, surroundings and important details..."
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Capacity & Pricing */}
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
                                    min="0"
                                    value={form.rooms}
                                    onChange={handleChange}
                                    placeholder="10"
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
                                    min="0"
                                    value={form.guests}
                                    onChange={handleChange}
                                    placeholder="20"
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
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Location */}
                    <section className="rounded-2xl border border-[#dedbd3] bg-white p-7 shadow-sm">
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7650]">
                                04
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
                                    value={form.mapUrl}
                                    onChange={handleChange}
                                    placeholder="https://maps.google.com/..."
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
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="16.8489"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Longitude
                                    </label>

                                    <input
                                        name="longitude"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="73.2886"
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
                                05
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Contact Information
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    WhatsApp
                                </label>

                                <input
                                    name="whatsapp"
                                    value={form.whatsapp}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#9a7650]"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Save */}
                    <section className="sticky bottom-4 rounded-2xl border border-[#dedbd3] bg-white/95 p-5 shadow-lg backdrop-blur">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                {message && (
                                    <p
                                        className={`text-sm font-medium ${message.includes("successfully")
                                                ? "text-green-700"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {message}
                                    </p>
                                )}

                                {!message && (
                                    <p className="text-sm text-gray-500">
                                        Property will be saved as a draft.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-[#1f2933] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Saving..." : "Save Property"}
                            </button>

                        </div>
                    </section>

                </form>
            </div>
        </main>
    );
}