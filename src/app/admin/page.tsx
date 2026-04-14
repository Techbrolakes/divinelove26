import { redirect } from "next/navigation";
import { getAdminUser, getStats } from "@/actions/admin";
import Link from "next/link";

export default async function AdminDashboard() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const stats = await getStats();

  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-white border-b border-royal-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl text-royal">
            Wedding Admin
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/guests"
              className="font-sans text-sm text-royal hover:text-royal-light"
            >
              Manage Guests
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
        <h2 className="font-serif text-3xl text-royal mb-8">
          RSVP Dashboard
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Guests" value={stats.total} />
          <StatCard
            label="Attending"
            value={stats.attending}
            color="text-green-600"
          />
          <StatCard
            label="Declined"
            value={stats.declined}
            color="text-red-500"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="text-warm-400"
          />
        </div>

        {Object.keys(stats.mealCounts).length > 0 && (
          <div className="bg-white rounded-xl border border-royal-100 p-6">
            <h3 className="font-serif text-xl text-royal mb-4">
              Meal Choices
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.mealCounts).map(([meal, count]) => (
                <div
                  key={meal}
                  className="flex items-center justify-between font-sans text-sm"
                >
                  <span className="text-warm-500 capitalize">{meal}</span>
                  <span className="text-royal-700 font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-royal",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-royal-100 p-6 text-center">
      <p className={`font-serif text-4xl font-light ${color}`}>{value}</p>
      <p className="font-sans text-xs tracking-widest uppercase text-warm-400 mt-2">
        {label}
      </p>
    </div>
  );
}
