import React, { useState, useEffect } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Dialog, DialogContent } from "./ui/dialog";
import { useToast } from "./ui/use-toast";

interface PDFDocument {
  id: string;
  title: string;
  url: string;
  importantQuestionsUrl?: string;
}

interface PDFViewerProps {
  documents?: PDFDocument[];
  initialDocumentId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const PDFViewer = ({
  documents = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      importantQuestionsUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      importantQuestionsUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
    {
      id: "3",
      title: "Operating Systems",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      importantQuestionsUrl:
        "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    },
  ],
  initialDocumentId = "1",
  isOpen = true,
  onClose = () => {},
}: PDFViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>(initialDocumentId);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<"document" | "questions">(
    "document",
  );
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Initialize loading states for all documents
    const initialLoadingStates: Record<string, boolean> = {};
    documents.forEach((doc) => {
      initialLoadingStates[doc.id] = true;
    });
    setLoadingStates(initialLoadingStates);
  }, [documents]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    onClose();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDownload = (document: PDFDocument) => {
    try {
      const link = document.createElement("a");
      link.href = document.url;
      link.download = `${document.title}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `Downloading ${document.title}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download the PDF file",
        variant: "destructive",
      });
    }
  };

  const handlePdfLoad = (docId: string) => {
    setLoadingStates((prev) => ({ ...prev, [docId]: false }));
    setErrorStates((prev) => ({ ...prev, [docId]: false }));
  };

  const handlePdfError = (docId: string) => {
    setLoadingStates((prev) => ({ ...prev, [docId]: false }));
    setErrorStates((prev) => ({ ...prev, [docId]: true }));
    console.error(`PDF failed to load for document: ${docId}`);
  };

  const activeDocument = documents.find((doc) => doc.id === activeTab);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={`p-0 bg-[#0A1931] border-[#185ADB] ${isFullscreen ? "max-w-full w-screen h-screen m-0" : "max-w-6xl w-full h-[80vh]"}`}
      >
        <div className="flex flex-col h-full bg-[#0A1931]">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex flex-col h-full"
          >
            {/* Header with tabs */}
            <div className="flex items-center justify-between p-2 border-b border-[#185ADB]/30">
              <div className="flex items-center space-x-4">
                <TabsList className="bg-[#0A1931] border border-[#185ADB]/30">
                  {documents.map((doc) => (
                    <TabsTrigger
                      key={doc.id}
                      value={doc.id}
                      className="data-[state=active]:bg-[#185ADB] data-[state=active]:text-white text-white"
                    >
                      {doc.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* View Mode Toggle */}
                <div className="flex bg-[#0A1931] border border-[#185ADB]/30 rounded-md">
                  <Button
                    variant={viewMode === "document" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("document")}
                    className={`rounded-r-none transition-all duration-200 ${viewMode === "document" ? "bg-gradient-to-r from-[#185ADB] to-[#185ADB]/80 text-white shadow-lg" : "text-white hover:bg-[#185ADB]/30 hover:text-white"}`}
                  >
                    Document
                  </Button>
                  <Button
                    variant={viewMode === "questions" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("questions")}
                    className={`rounded-l-none transition-all duration-200 ${viewMode === "questions" ? "bg-gradient-to-r from-[#185ADB] to-[#185ADB]/80 text-white shadow-lg" : "text-white hover:bg-[#185ADB]/30 hover:text-white"}`}
                  >
                    Important Questions
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-[#185ADB]/30 hover:text-white transition-all duration-200"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-white hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PDF Viewer Content */}
            <div className="flex-1 overflow-hidden">
              {documents.map((doc) => (
                <TabsContent key={doc.id} value={doc.id} className="h-full m-0">
                  <div className="flex flex-col h-full">
                    {/* Google Ads Space - PDF Viewer */}
                    <div className="p-3 bg-[#0A1931] border-b border-[#185ADB]/30">
                      <div className="bg-gray-800/50 border border-[#185ADB]/30 rounded p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">
                          Advertisement
                        </p>
                        <div className="bg-gray-700/30 rounded p-2 min-h-[60px] flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            Google Ads Space - 468x60
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-between p-2 bg-[#0A1931] border-b border-[#185ADB]/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">
                          {doc.title} -{" "}
                          {viewMode === "document"
                            ? "Document"
                            : "Important Questions"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleZoomOut}
                          className="border-[#185ADB]/50 text-white hover:bg-gradient-to-r hover:from-[#185ADB] hover:to-[#185ADB]/80 hover:border-[#185ADB] transition-all duration-200"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-300 min-w-[50px] text-center font-medium">
                          {zoomLevel}%
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleZoomIn}
                          className="border-[#185ADB]/50 text-white hover:bg-gradient-to-r hover:from-[#185ADB] hover:to-[#185ADB]/80 hover:border-[#185ADB] transition-all duration-200"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className="ml-2 border-[#185ADB]/50 text-white hover:bg-gradient-to-r hover:from-[#185ADB] hover:to-[#185ADB]/80 hover:border-[#185ADB] transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4 relative">
                      {loadingStates[doc.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0A1931]/80 z-10">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-[#185ADB]" />
                            <p className="text-white">Loading PDF...</p>
                          </div>
                        </div>
                      )}

                      {errorStates[doc.id] ? (
                        <div className="flex flex-col items-center gap-4 text-white">
                          <AlertCircle className="h-16 w-16 text-red-400" />
                          <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">
                              PDF Failed to Load
                            </h3>
                            <p className="text-gray-300 mb-4">
                              Unable to display the PDF document
                            </p>
                            <Button
                              onClick={() => handleDownload(doc)}
                              className="bg-gradient-to-r from-[#185ADB] to-[#185ADB]/80 hover:from-[#185ADB]/90 hover:to-[#185ADB]/70 shadow-lg transition-all duration-200"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Instead
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            transform: `scale(${zoomLevel / 100})`,
                            transformOrigin: "center top",
                          }}
                        >
                          <iframe
                            src={`${viewMode === "document" ? doc.url : doc.importantQuestionsUrl || doc.url}#toolbar=1&navpanes=1&scrollbar=1`}
                            className="w-full h-full border-0 rounded"
                            title={`${doc.title} - ${viewMode === "document" ? "Document" : "Important Questions"}`}
                            onLoad={() => handlePdfLoad(doc.id)}
                            onError={() => handlePdfError(doc.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
