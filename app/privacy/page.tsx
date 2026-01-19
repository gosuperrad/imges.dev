import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - imges.dev",
  description: "Privacy policy for imges.dev placeholder image generator",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Last updated: January 19, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Overview
          </h2>
          <p className="text-gray-700 mb-4">
            imges.dev is a free placeholder image generation service. We are committed to protecting 
            your privacy and being transparent about the minimal data we collect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Data We Collect
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Analytics Data (Production Only)
          </h3>
          <p className="text-gray-700 mb-4">
            We collect anonymous usage analytics to improve our service. This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>Image specifications:</strong> Dimensions, colors, and format preferences</li>
            <li><strong>Feature usage:</strong> Which features are used (text, borders, effects, etc.)</li>
            <li><strong>Browser information:</strong> General browser type (e.g., "Chrome on macOS") for compatibility testing</li>
            <li><strong>Referring website:</strong> Domain name (not full URL) of the website using our service</li>
            <li><strong>Request parameters:</strong> Query parameters used for customization</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            What We Do NOT Store or Log
          </h3>
          <p className="text-gray-700 mb-2">
            We do not store or log the following information in our analytics or databases:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>IP addresses for analytics, tracking, or long-term logging</li>
            <li>Personal information (names, emails, etc.)</li>
            <li>Tracking cookies</li>
            <li>Full referrer URLs (only domains)</li>
            <li>Precise browser versions or OS versions</li>
          </ul>
          <p className="text-gray-600 text-sm mb-4">
            <strong>Note:</strong> For abuse prevention, IP addresses may be processed transiently in memory for
            automated rate limiting (maximum 100 requests per minute per IP). These IPs are not logged,
            persisted to disk or database, or used for analytics or tracking purposes. They are automatically
            purged from memory after the rate limit window expires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How We Use Your Data
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>To understand popular image sizes and formats</li>
            <li>To improve service features based on usage patterns</li>
            <li>To ensure browser compatibility</li>
            <li>To optimize service performance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Data Storage & Security
          </h2>
          <p className="text-gray-700 mb-4">
            Analytics data is stored securely in a PostgreSQL database hosted on Railway 
            (a US-based cloud infrastructure provider). Access to analytics data is 
            restricted and protected by authentication.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Data Retention
          </h2>
          <p className="text-gray-700 mb-4">
            Analytics data is retained indefinitely for trend analysis and service improvement. 
            Since no personal information is collected, there is no personal data to delete.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-700 mb-4">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Google Fonts API:</strong> To load custom fonts (https://fonts.google.com)</li>
            <li><strong>Twemoji CDN:</strong> To render emoji images (https://cdn.jsdelivr.net)</li>
            <li><strong>Railway:</strong> Cloud hosting and database infrastructure</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Rights (GDPR Compliance)
          </h2>
          <p className="text-gray-700 mb-4">
            Since we do not collect personal information or use tracking cookies, GDPR 
            obligations for personal data do not apply. However, we are committed to transparency:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>No consent is required to use our service</li>
            <li>No personal data is processed</li>
            <li>Analytics are based on legitimate interest (service improvement)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-700 mb-4">
            Our service does not collect personal information from anyone, including children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this privacy policy from time to time. The "Last updated" date at 
            the top of this page indicates when the policy was last revised.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this privacy policy, please contact us:
          </p>
          <ul className="list-none space-y-2 text-gray-700">
            <li><strong>Email:</strong> privacy@imges.dev</li>
            <li><strong>GitHub:</strong> <a href="https://github.com/gosuperrad/imges.dev" className="text-blue-600 hover:underline">github.com/gosuperrad/imges.dev</a></li>
          </ul>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
