"use client";

import { useState, useEffect, useTransition } from "react";
import { getGuests, addGuest, deleteGuest, importGuestsFromCsv } from "@/actions/admin";
import Link from "next/link";

type GuestWithRsvp = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  party_name: string | null;
  max_plus_ones: number;
  rsvps: {
    attending: boolean;
    meal_choice: string | null;
    plus_one_name: string | null;
  }[];
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestWithRsvp[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadGuests = () => {
    startTransition(async () => {
      const data = await getGuests();
      setGuests(data as GuestWithRsvp[]);
    });
  };

  useEffect(() => {
    loadGuests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (formData: FormData) => {
    await addGuest(formData);
    setShowAddForm(false);
    loadGuests();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this guest?")) return;
    await deleteGuest(id);
    loadGuests();
  };

  const handleCsvImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const count = await importGuestsFromCsv(text);
      alert(`Imported ${count} guests.`);
      loadGuests();
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-white border-b border-royal-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl text-royal">Guest List</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-sans text-sm text-royal hover:text-royal-light"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="font-sans text-sm text-warm-400 hover:text-warm-600"
            >
              View Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="font-sans text-sm text-warm-400">
            {guests.length} guests
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCsvImport}
              className="px-4 py-2 border border-royal-100 text-royal font-sans text-sm rounded-lg hover:bg-royal-50 transition-colors"
            >
              Import CSV
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-royal text-white font-sans text-sm rounded-lg hover:bg-royal-dark transition-colors"
            >
              Add Guest
            </button>
          </div>
        </div>

        {showAddForm && (
          <form
            action={handleAdd}
            className="bg-white rounded-xl border border-royal-100 p-6 mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input
                name="firstName"
                placeholder="First name *"
                required
                className="px-3 py-2 border border-royal-100 rounded-lg font-sans text-sm"
              />
              <input
                name="lastName"
                placeholder="Last name *"
                required
                className="px-3 py-2 border border-royal-100 rounded-lg font-sans text-sm"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="px-3 py-2 border border-royal-100 rounded-lg font-sans text-sm"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="px-3 py-2 border border-royal-100 rounded-lg font-sans text-sm"
              />
              <input
                name="partyName"
                placeholder="Party name"
                className="px-3 py-2 border border-royal-100 rounded-lg font-sans text-sm"
              />
              <input
                name="maxPlusOnes"
                type="number"
                placeholder="Plus ones (0)"
                min="0"
                max="5"
                className="px-3 py-2 border border-royal-100 rounded-lg font-sans text-sm"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-royal text-white font-sans text-sm rounded-lg hover:bg-royal-dark"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-warm-400 font-sans text-sm hover:text-warm-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl border border-royal-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-royal-50">
              <tr>
                <th className="text-left px-4 py-3 font-sans text-xs tracking-widest uppercase text-royal-600">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-sans text-xs tracking-widest uppercase text-royal-600 hidden md:table-cell">
                  Party
                </th>
                <th className="text-center px-4 py-3 font-sans text-xs tracking-widest uppercase text-royal-600">
                  RSVP
                </th>
                <th className="text-center px-4 py-3 font-sans text-xs tracking-widest uppercase text-royal-600 hidden md:table-cell">
                  Meal
                </th>
                <th className="text-right px-4 py-3 font-sans text-xs tracking-widest uppercase text-royal-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-royal-50">
              {guests.map((guest) => {
                const rsvp = guest.rsvps?.[0];
                return (
                  <tr key={guest.id} className="hover:bg-ivory/50">
                    <td className="px-4 py-3 font-sans text-sm text-royal-700">
                      {guest.first_name} {guest.last_name}
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-warm-400 hidden md:table-cell">
                      {guest.party_name || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rsvp ? (
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-sans ${
                            rsvp.attending
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {rsvp.attending ? "Attending" : "Declined"}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-sans bg-warm-100 text-warm-400">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-sans text-sm text-warm-400 capitalize hidden md:table-cell">
                      {rsvp?.meal_choice || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="font-sans text-xs text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {guests.length === 0 && !isPending && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center font-sans text-sm text-warm-400"
                  >
                    No guests yet. Add your first guest above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
