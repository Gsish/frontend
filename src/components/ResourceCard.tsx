import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ResourceCardProps {
  id?: string;
  title?: string;
  branch?: string;
  year?: string;
  type?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  onOpenPdfViewer?: (id: string) => void;
}

const ResourceCard = ({
  id = "1",
  title = "Introduction to Data Structures",
  branch = "Computer Science",
  year = "2nd Year",
  type = "Lecture Notes",
  thumbnailUrl = "https://images.unsplash.com/photo-1586772002345-339f8042a777?w=400&q=80",
  downloadUrl = "#",
  onOpenPdfViewer = () => {},
}: ResourceCardProps) => {
  return (
    <Card className="w-full h-full bg-[#0A1931] border-[#185ADB] hover:border-[#185ADB]/80 hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <h3 className="text-lg font-semibold text-white line-clamp-2">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="bg-[#185ADB] text-white">
            {branch}
          </Badge>
          <Badge variant="outline" className="text-white border-white/30">
            {year}
          </Badge>
          <Badge variant="outline" className="text-white border-white/30">
            {type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-full h-40 overflow-hidden rounded-md cursor-pointer group">
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-[#0A1931] border-[#185ADB]">
            <div className="w-full h-[70vh] flex items-center justify-center">
              <img
                src={thumbnailUrl}
                alt={title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-[#185ADB] text-white hover:bg-[#185ADB]/20"
          onClick={() => window.open(downloadUrl, "_blank")}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-[#185ADB] hover:bg-[#185ADB]/80 text-white"
          onClick={() => onOpenPdfViewer(id)}
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Open
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
