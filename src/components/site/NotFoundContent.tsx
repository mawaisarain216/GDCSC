import Link from "next/link";
import { Home, Search, Phone } from "lucide-react";

export default function NotFoundContent() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 sm:py-28 text-center">
      <p className="text-primary font-heading font-bold text-7xl sm:text-8xl tracking-tight">404</p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-heading font-bold text-gray-900">
        Page Not Found
      </h1>
      <p className="mt-3 text-gray-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved,
        renamed, or the link you followed might be outdated.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-theme hover:opacity-90 transition-opacity"
        >
          <Home size={16} /> Back to Homepage
        </Link>
        <Link
          href="/admissions/status"
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-theme hover:bg-gray-50 transition-colors"
        >
          <Search size={16} /> Check Admission Status
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-theme hover:bg-gray-50 transition-colors"
        >
          <Phone size={16} /> Contact Us
        </Link>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 text-sm text-gray-500">
        <p className="font-medium text-gray-700 mb-2">You might be looking for:</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/admissions" className="hover:text-primary hover:underline">Admissions</Link>
          <Link href="/departments" className="hover:text-primary hover:underline">Departments</Link>
          <Link href="/news-events" className="hover:text-primary hover:underline">News &amp; Events</Link>
          <Link href="/about" className="hover:text-primary hover:underline">About the College</Link>
        </div>
      </div>
    </div>
  );
}
