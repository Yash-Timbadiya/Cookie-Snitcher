export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Cookie Snitcher</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          What is Cookie Snitcher?
        </h2>
        <p className="text-gray-300 mb-4">
          Cookie Snitcher is a comprehensive browser cookie monitoring solution
          that consists of a Chrome extension and this web app. It helps you
          track, analyze, and understand the cookies that websites store in your
          browser.
        </p>
        <p className="text-gray-300">
          Whether you're a developer, privacy enthusiast, or security
          professional, Cookie Snitcher provides valuable insights into how
          websites use cookies to track and store information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>
              <span className="font-semibold">Browser Extension:</span> The
              Cookie Snitcher Chrome extension monitors cookies as you browse
              the web.
            </li>
            <li>
              <span className="font-semibold">Data Collection:</span> When you
              visit a website, the extension captures cookie data along with tab
              information.
            </li>
            <li>
              <span className="font-semibold">Secure Storage:</span> All cookie
              data is securely stored in our database powered by Neon DB
              (PostgreSQL).
            </li>
            <li>
              <span className="font-semibold">Web Interface:</span> This web app
              provides a user-friendly interface to view, filter, and analyze
              the collected cookie data.
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-2">✨ Real-time Tracking</h3>
            <p className="text-gray-400">
              Monitor cookies as you browse, with automatic updates when you
              visit new sites.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-2">🔍 Detailed Analytics</h3>
            <p className="text-gray-400">
              View comprehensive data about each cookie, including domain,
              expiration, and security settings.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-2">🔄 Filter & Search</h3>
            <p className="text-gray-400">
              Easily find specific cookies by filtering by URL or other
              criteria.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-medium mb-2">📋 Copy Functionality</h3>
            <p className="text-gray-400">
              Copy cookie data with a single click for analysis in other tools.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Privacy & Security</h2>
        <p className="text-gray-300 mb-4">
          Cookie Snitcher is designed with privacy in mind. All data is stored
          locally in your database, and the extension only collects cookie data
          from sites you visit. We never share your browsing data with third
          parties.
        </p>
        <p className="text-gray-300">
          For more information about how Cookie Snitcher handles your data,
          please refer to our documentation.
        </p>
      </section>
    </div>
  );
}
