// "use client";

// import { useState, useEffect } from "react";
// import CookieTable from "@/components/CookieTable";
// import Pagination from "@/components/Pagination";
// import FilterBar from "@/components/FilterBar";

// type CookieEntry = {
//   id: number;
//   url: string;
//   tabId: number;
//   tabTitle: string | null;
//   favIconUrl: string | null;
//   cookiesData: any[];
//   ipAddress: string | null;
//   createdAt: string;
// };

// type PaginationData = {
//   page: number;
//   limit: number;
//   total: number;
//   pages: number;
// };

// export default function Home() {
//   const [cookieEntries, setCookieEntries] = useState<CookieEntry[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [pagination, setPagination] = useState<PaginationData>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0,
//   });
//   const [urlFilter, setUrlFilter] = useState("");

//   const fetchCookies = async (page = 1, url = "") => {
//     setIsLoading(true);
//     try {
//       let endpoint = `/api/cookies?page=${page}&limit=${pagination.limit}`;
//       if (url) {
//         endpoint += `&url=${encodeURIComponent(url)}`;
//       }

//       const response = await fetch(endpoint);
//       const data = await response.json();

//       if (data.success) {
//         setCookieEntries(data.data);
//         setPagination(data.pagination);
//       } else {
//         console.error("Failed to fetch cookies:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching cookies:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCookies(1, urlFilter);
//   }, []);

//   const handlePageChange = (page: number) => {
//     fetchCookies(page, urlFilter);
//   };

//   const handleFilter = (url: string) => {
//     setUrlFilter(url);
//     fetchCookies(1, url);
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Cookie Tracker Dashboard</h1>
//         <p className="text-gray-400">
//           View and analyze cookies captured by the Cookie Snitcher Chrome Extension.
//         </p>
//       </div>

//       <FilterBar onFilter={handleFilter} />

//       <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
//         <CookieTable entries={cookieEntries} isLoading={isLoading} refreshCookies={() => fetchCookies(pagination.page, urlFilter)}/>

//         {!isLoading && (
//           <div className="bg-gray-900 border-t border-gray-800 p-4">
//             <Pagination
//               currentPage={pagination.page}
//               totalPages={pagination.pages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         )}
//       </div>

//       {cookieEntries.length > 0 && (
//         <div className="mt-6 text-sm text-gray-500">
//           Showing {cookieEntries.length} of {pagination.total} entries
//         </div>
//       )}
//     </div>
//   );
// }

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
  cookiesData: any[];
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
  const [cookieEntries, setCookieEntries] = useState<CookieEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [urlFilter, setUrlFilter] = useState("");
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });
  const previousTotalRef = useRef<number>(0);

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
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCookies(1, urlFilter);
  }, [fetchCookies]);

  // Setup auto-refresh interval
  useEffect(() => {
    // First, set up the check for new data (light polling)
    const checkInterval = setInterval(async () => {
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
    }, 10000); // Check every 5 seconds

    // Set up a full refresh interval as a backup (less frequent)
    refreshIntervalRef.current = setInterval(() => {
      if (!isLoading) {
        fetchCookies(pagination.page, urlFilter, true);
      }
    }, 3600000); // Full refresh every 30 seconds

    // Clean up intervals on component unmount
    return () => {
      clearInterval(checkInterval);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchCookies, isLoading, pagination.page, pagination.total, urlFilter]);

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
