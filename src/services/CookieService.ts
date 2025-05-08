// src/services/CookieService.ts

export async function fetchCookiesWithMetadata(
  page: number,
  limit: number,
  urlFilter?: string
) {
  try {
    let endpoint = `/api/cookies?page=${page}&limit=${limit}`;
    if (urlFilter) {
      endpoint += `&url=${encodeURIComponent(urlFilter)}`;
    }

    // Add a cache-busting timestamp
    endpoint += `&_t=${Date.now()}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.success) {
      return {
        entries: data.data,
        pagination: data.pagination,
        success: true,
        error: null,
      };
    } else {
      return {
        entries: [],
        pagination: null,
        success: false,
        error: data.message,
      };
    }
  } catch (error) {
    console.error("Error in fetchCookiesWithMetadata:", error);
    return {
      entries: [],
      pagination: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCookie(id: number) {
  try {
    const response = await fetch(`/api/cookies/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message,
      error: response.ok ? null : data.error || "Failed to delete cookie",
    };
  } catch (error) {
    console.error("Error in deleteCookie:", error);
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Check if there are any new cookies since the lastFetchTime
export async function checkForNewCookies() {
  try {
    // We just need to fetch the latest cookie to see if there are any new ones
    const endpoint = `/api/cookies?page=1&limit=1&_t=${Date.now()}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.success) {
      return {
        hasNewCookies: data.data.length > 0,
        total: data.pagination.total,
        success: true,
        error: null,
      };
    } else {
      return {
        hasNewCookies: false,
        total: 0,
        success: false,
        error: data.message,
      };
    }
  } catch (error) {
    console.error("Error in checkForNewCookies:", error);
    return {
      hasNewCookies: false,
      total: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
