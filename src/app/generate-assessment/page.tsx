"use client";

import { useState } from "react";

type PageSelectionType = "all" | "specific" | "range";

export default function GenerateAssessment() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSelection, setPageSelection] = useState<PageSelectionType>("all");
  const [specificPage, setSpecificPage] = useState<string>("");
  const [pageRange, setPageRange] = useState({ start: "", end: "" });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Load the PDF and get page count
      const arrayBuffer = await selectedFile.arrayBuffer();
      //   const pdf = await import("pdfjs-dist");

      //   const pdfjsLib = pdf.default;

      //   pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      //   const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      //   const pdfDoc = await loadingTask.promise;
      //   setTotalPages(pdfDoc.numPages);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      // TODO: Implement file upload logic here
      console.log("Uploading file:", file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const validatePageInput = (
    input: string,
    isRangeEnd: boolean = false
  ): boolean => {
    const num = parseInt(input);
    if (isNaN(num)) return false;
    if (num < 1 || num > totalPages) return false;
    if (isRangeEnd && pageRange.start && num < parseInt(pageRange.start))
      return false;
    return true;
  };

  const handleSpecificPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpecificPage(value);
  };

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "start" | "end"
  ) => {
    const value = e.target.value;
    setPageRange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Generate Assessment</h1>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer block mb-4">
            <div className="text-gray-600 mb-2">
              {file ? file.name : "Drop your PDF here or click to browse"}
            </div>
            {!file && (
              <div className="text-sm text-gray-500">Supports PDF files</div>
            )}
          </label>

          {file && (
            <div className="mt-6 text-left">
              <p className="mb-3 text-gray-600">Total Pages: {totalPages}</p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="allPages"
                    name="pageSelection"
                    value="all"
                    checked={pageSelection === "all"}
                    onChange={(e) =>
                      setPageSelection(e.target.value as PageSelectionType)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="allPages">All Pages</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="specificPage"
                    name="pageSelection"
                    value="specific"
                    checked={pageSelection === "specific"}
                    onChange={(e) =>
                      setPageSelection(e.target.value as PageSelectionType)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="specificPage">Specific Page</label>
                  {pageSelection === "specific" && (
                    <input
                      type="number"
                      value={specificPage}
                      onChange={handleSpecificPageChange}
                      className="ml-3 px-2 py-1 border rounded w-20"
                      placeholder="Page #"
                      min={1}
                      max={totalPages}
                    />
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="pageRange"
                    name="pageSelection"
                    value="range"
                    checked={pageSelection === "range"}
                    onChange={(e) =>
                      setPageSelection(e.target.value as PageSelectionType)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="pageRange">Page Range</label>
                  {pageSelection === "range" && (
                    <div className="ml-3 flex items-center">
                      <input
                        type="number"
                        value={pageRange.start}
                        onChange={(e) => handleRangeChange(e, "start")}
                        className="px-2 py-1 border rounded w-20"
                        placeholder="Start"
                        min={1}
                        max={totalPages}
                      />
                      <span className="mx-2">to</span>
                      <input
                        type="number"
                        value={pageRange.end}
                        onChange={(e) => handleRangeChange(e, "end")}
                        className="px-2 py-1 border rounded w-20"
                        placeholder="End"
                        min={1}
                        max={totalPages}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`mt-4 px-4 py-2 rounded-md ${
              !file || uploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
