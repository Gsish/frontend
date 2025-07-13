import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertCircle, Loader2 } from "lucide-react";
import ResourceCard from "./ResourceCard";

interface Resource {
  id: string;
  title: string;
  branch: string;
  year: string;
  type: string;
  thumbnail: string;
  downloadUrl: string;
  pdfUrl?: string;
}

interface ResourceGridProps {
  resources?: Resource[];
  isLoading?: boolean;
  error?: string | null;
  onOpenPdfViewer?: (resource: Resource) => void;
}

const ResourceGrid = ({
  resources = [],
  isLoading = false,
  error = null,
  onOpenPdfViewer = () => {},
}: ResourceGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 12;
  const totalPages = Math.ceil(resources.length / resourcesPerPage);

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(
    indexOfFirstResource,
    indexOfLastResource,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#0A1931] p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="h-6 w-6 animate-spin text-[#185ADB]" />
            <span>Loading resources...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 rounded-lg bg-[#0F2649] animate-pulse border border-[#185ADB]/20"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#0A1931] p-6">
        <div className="flex flex-col items-center justify-center py-12 text-white">
          <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Error Loading Resources
          </h3>
          <p className="text-gray-300 text-center max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="w-full bg-[#0A1931] p-6">
        <div className="flex flex-col items-center justify-center py-12 text-white">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No Resources Found</h3>
          <p className="text-gray-300 text-center max-w-md">
            No resources match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0A1931] p-6 min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {currentResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            id={resource.id}
            title={resource.title}
            branch={resource.branch}
            year={resource.year}
            type={resource.type}
            thumbnailUrl={resource.thumbnail}
            downloadUrl={resource.downloadUrl}
            onOpenPdfViewer={() => onOpenPdfViewer(resource)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50 text-white"
                      : "cursor-pointer text-white hover:bg-[#185ADB]/20"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`text-white hover:bg-[#185ADB]/20 ${
                      currentPage === index + 1 ? "bg-[#185ADB]" : ""
                    }`}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50 text-white"
                      : "cursor-pointer text-white hover:bg-[#185ADB]/20"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;
