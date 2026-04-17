"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* Logo area */}
      <div className="absolute left-16 top-[50px]">
        <h2 className="text-[20px] font-bold text-gray-900">Admin</h2>
      </div>

      {/* Centered Content */}
      <div className="flex flex-1 items-center justify-center">{children}</div>

      {/* Footer */}
      <div className="flex h-[47px] items-center justify-center border-t border-gray-200 px-16">
        <p className="text-[14px] font-medium text-gray-500">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
