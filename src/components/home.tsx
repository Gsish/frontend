import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ResourceGrid from "./ResourceGrid";
import PDFViewer from "./PDFViewer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, AlertCircle } from "lucide-react";
import { useToast } from "./ui/use-toast";

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

interface ApiFilters {
  branches: string[];
  years: string[];
  resourceTypes: string[];
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [currentPdfDocuments, setCurrentPdfDocuments] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<ApiFilters>({
    branches: [],
    years: [],
    resourceTypes: [],
  });
  const { toast } = useToast();

  // Dummy data fallback
  const dummyResources: Resource[] = [
    {
      id: "1",
      title: "Data Structures and Algorithms",
      branch: "Computer Science",
      year: "2nd Year",
      type: "Notes",
      thumbnail:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "2",
      title: "Thermodynamics Fundamentals",
      branch: "Mechanical",
      year: "1st Year",
      type: "Notes",
      thumbnail:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "3",
      title: "Circuit Theory",
      branch: "Electrical",
      year: "2nd Year",
      type: "Notes",
      thumbnail:
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "4",
      title: "Operating Systems",
      branch: "Computer Science",
      year: "3rd Year",
      type: "Question Papers",
      thumbnail:
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "5",
      title: "Machine Design",
      branch: "Mechanical",
      year: "3rd Year",
      type: "Notes",
      thumbnail:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "6",
      title: "Power Systems",
      branch: "Electrical",
      year: "4th Year",
      type: "Question Papers",
      thumbnail:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "7",
      title: "Database Management Systems",
      branch: "Computer Science",
      year: "2nd Year",
      type: "Notes",
      thumbnail:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "8",
      title: "Fluid Mechanics",
      branch: "Mechanical",
      year: "2nd Year",
      type: "Notes",
      thumbnail:
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&q=80",
      downloadUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      pdfUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
  ];

  // Fetch resources from API
  const fetchResources = async (filters?: ApiFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.branches.length) {
        params.append("branches", filters.branches.join(","));
      }
      if (filters?.years.length) {
        params.append("years", filters.years.join(","));
      }
      if (filters?.resourceTypes.length) {
        params.append("types", filters.resourceTypes.join(","));
      }

      const queryString = params.toString();
      const url = `/api/resources${queryString ? `?${queryString}` : ""}`;

      console.log("Fetching resources from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data && Array.isArray(data.resources)) {
        setResources(data.resources);
        setIsUsingDummyData(false);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch resources",
      );

      // Fallback to dummy data
      setResources(dummyResources);
      setIsUsingDummyData(true);

      toast({
        title: "API Unavailable",
        description: "Demo content is being shown due to API unavailability.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchResources();
  }, []);

  // Filter resources based on search query and active filters
  useEffect(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply branch filters
    if (activeFilters.branches.length > 0) {
      filtered = filtered.filter((resource) => {
        const branchMap: Record<string, string> = {
          cs: "Computer Science",
          mechanical: "Mechanical",
          electrical: "Electrical",
          civil: "Civil",
        };
        return activeFilters.branches.some((branch) =>
          resource.branch
            .toLowerCase()
            .includes(branchMap[branch]?.toLowerCase() || branch.toLowerCase()),
        );
      });
    }

    // Apply year filters
    if (activeFilters.years.length > 0) {
      filtered = filtered.filter((resource) => {
        const yearMap: Record<string, string> = {
          "1": "1st Year",
          "2": "2nd Year",
          "3": "3rd Year",
          "4": "4th Year",
        };
        return activeFilters.years.some((year) =>
          resource.year.includes(yearMap[year] || year),
        );
      });
    }

    // Apply resource type filters
    if (activeFilters.resourceTypes.length > 0) {
      filtered = filtered.filter((resource) => {
        const typeMap: Record<string, string> = {
          notes: "Notes",
          papers: "Question Papers",
          books: "Books",
        };
        return activeFilters.resourceTypes.some((type) =>
          resource.type
            .toLowerCase()
            .includes(typeMap[type]?.toLowerCase() || type.toLowerCase()),
        );
      });
    }

    setFilteredResources(filtered);
  }, [resources, searchQuery, activeFilters]);

  // Handle filter changes from sidebar
  const handleFilterChange = (filterType: string, filters: string[]) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: filters,
    };
    setActiveFilters(newFilters);

    // Optionally refetch from API with new filters
    // fetchResources(newFilters);
  };

  const handleOpenPdfViewer = (resource: Resource) => {
    const pdfDocument = {
      id: resource.id,
      title: resource.title,
      url: resource.pdfUrl || resource.downloadUrl,
    };

    setCurrentPdfDocuments([pdfDocument]);
    setIsPdfViewerOpen(true);
  };

  const handleClosePdfViewer = () => {
    setIsPdfViewerOpen(false);
    setCurrentPdfDocuments([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1931] via-[#0A1931] to-[#185ADB]/10 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-[#0A1931] via-[#185ADB]/20 to-[#0A1931] border-b border-[#185ADB]/30 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23185ADB' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "60px 60px",
                }}
              />
            </div>

            <div className="relative p-8 max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#185ADB] to-[#185ADB]/70 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-[#185ADB] bg-clip-text text-transparent">
                    Engineering Resources Hub
                  </h1>
                </div>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Your ultimate destination for engineering educational
                  resources. Access comprehensive notes, question papers, and
                  study materials across all branches and academic years.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="group bg-gradient-to-br from-[#185ADB]/20 to-[#185ADB]/5 p-6 rounded-xl border border-[#185ADB]/30 hover:border-[#185ADB]/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#185ADB] to-[#185ADB]/70 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Comprehensive Library
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Access thousands of curated resources across Computer
                    Science, Mechanical, Electrical, and Civil Engineering
                    disciplines.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#185ADB]/20 to-[#185ADB]/5 p-6 rounded-xl border border-[#185ADB]/30 hover:border-[#185ADB]/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#185ADB] to-[#185ADB]/70 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Smart Search & Filter
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Find exactly what you need with our intelligent search
                    system and advanced filtering capabilities by branch and
                    year.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#185ADB]/20 to-[#185ADB]/5 p-6 rounded-xl border border-[#185ADB]/30 hover:border-[#185ADB]/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#185ADB] to-[#185ADB]/70 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Built-in PDF Viewer
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    View and compare multiple documents seamlessly with our
                    advanced tabbed PDF viewer interface.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="p-6 bg-[#0A1931]/50 backdrop-blur-sm border-b border-[#185ADB]/30">
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#185ADB]/20 to-[#185ADB]/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-[#0A1931]/80 backdrop-blur-sm border border-[#185ADB]/30 rounded-xl p-1">
                  <Input
                    type="text"
                    placeholder="Search for notes, papers, books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 text-white pl-12 pr-20 h-14 text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#185ADB] h-5 w-5" />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#185ADB] hover:text-white hover:bg-[#185ADB]/30 rounded-lg transition-all duration-200"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* API Status Indicator */}
              {isUsingDummyData && (
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 px-4 py-2 rounded-lg border border-amber-400/20">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Demo content is being shown - API currently unavailable
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Resource Grid */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0A1931]/30 to-[#0A1931]">
            <ResourceGrid
              resources={filteredResources}
              isLoading={isLoading}
              error={error && !isUsingDummyData ? error : null}
              onOpenPdfViewer={handleOpenPdfViewer}
            />
          </main>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {isPdfViewerOpen && (
        <PDFViewer
          documents={currentPdfDocuments}
          initialDocumentId={currentPdfDocuments[0]?.id}
          isOpen={isPdfViewerOpen}
          onClose={handleClosePdfViewer}
        />
      )}
    </div>
  );
};

export default Home;
