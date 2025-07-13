import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Briefcase, Cpu, Zap, Filter } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface SidebarProps {
  onFilterChange?: (filterType: string, filters: string[]) => void;
}

const Sidebar = ({ onFilterChange = () => {} }: SidebarProps) => {
  // Default filter options
  const [branchFilters, setBranchFilters] = useState<FilterOption[]>([
    { id: "cs", label: "Computer Science", checked: false },
    { id: "mechanical", label: "Mechanical", checked: false },
    { id: "electrical", label: "Electrical", checked: false },
    { id: "civil", label: "Civil", checked: false },
  ]);

  const [yearFilters, setYearFilters] = useState<FilterOption[]>([
    { id: "1", label: "1st Year", checked: false },
    { id: "2", label: "2nd Year", checked: false },
    { id: "3", label: "3rd Year", checked: false },
    { id: "4", label: "4th Year", checked: false },
  ]);

  const [resourceTypeFilters, setResourceTypeFilters] = useState<
    FilterOption[]
  >([
    { id: "notes", label: "Notes", checked: false },
    { id: "papers", label: "Question Papers", checked: false },
    { id: "books", label: "Books", checked: false },
  ]);

  // Handle filter changes
  const handleFilterChange = (
    filterType: string,
    filterId: string,
    checked: boolean,
  ) => {
    let updatedFilters: FilterOption[] = [];

    switch (filterType) {
      case "branch":
        updatedFilters = branchFilters.map((filter) =>
          filter.id === filterId ? { ...filter, checked } : filter,
        );
        setBranchFilters(updatedFilters);
        break;
      case "year":
        updatedFilters = yearFilters.map((filter) =>
          filter.id === filterId ? { ...filter, checked } : filter,
        );
        setYearFilters(updatedFilters);
        break;
      case "resourceType":
        updatedFilters = resourceTypeFilters.map((filter) =>
          filter.id === filterId ? { ...filter, checked } : filter,
        );
        setResourceTypeFilters(updatedFilters);
        break;
    }

    // Notify parent component about filter changes
    const selectedFilters = updatedFilters
      .filter((filter) => filter.checked)
      .map((filter) => filter.id);

    onFilterChange(filterType, selectedFilters);
  };

  return (
    <aside className="w-[280px] h-screen bg-[#0A1931] text-white border-r border-[#185ADB]/20 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-[#185ADB]/20">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h2>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["branch", "year", "resourceType"]}
        >
          {/* Branch Filter */}
          <AccordionItem
            value="branch"
            className="border-b border-[#185ADB]/20"
          >
            <AccordionTrigger className="py-3 hover:text-[#185ADB]">
              <div className="flex items-center gap-2">
                <Cpu size={18} />
                <span>Engineering Branch</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 pl-2 py-2">
                {branchFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${filter.id}`}
                      checked={filter.checked}
                      onCheckedChange={(checked) =>
                        handleFilterChange(
                          "branch",
                          filter.id,
                          checked === true,
                        )
                      }
                      className="border-[#185ADB] data-[state=checked]:bg-[#185ADB]"
                    />
                    <Label
                      htmlFor={`branch-${filter.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Academic Year Filter */}
          <AccordionItem value="year" className="border-b border-[#185ADB]/20">
            <AccordionTrigger className="py-3 hover:text-[#185ADB]">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>Academic Year</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 pl-2 py-2">
                {yearFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`year-${filter.id}`}
                      checked={filter.checked}
                      onCheckedChange={(checked) =>
                        handleFilterChange("year", filter.id, checked === true)
                      }
                      className="border-[#185ADB] data-[state=checked]:bg-[#185ADB]"
                    />
                    <Label
                      htmlFor={`year-${filter.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Resource Type Filter */}
          <AccordionItem
            value="resourceType"
            className="border-b border-[#185ADB]/20"
          >
            <AccordionTrigger className="py-3 hover:text-[#185ADB]">
              <div className="flex items-center gap-2">
                <Briefcase size={18} />
                <span>Resource Type</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 pl-2 py-2">
                {resourceTypeFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`resourceType-${filter.id}`}
                      checked={filter.checked}
                      onCheckedChange={(checked) =>
                        handleFilterChange(
                          "resourceType",
                          filter.id,
                          checked === true,
                        )
                      }
                      className="border-[#185ADB] data-[state=checked]:bg-[#185ADB]"
                    />
                    <Label
                      htmlFor={`resourceType-${filter.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Popular Tags Section */}
        <div className="mt-6 mb-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Zap size={16} />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Programming",
              "Calculus",
              "Circuits",
              "Thermodynamics",
              "Algorithms",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-[#185ADB]/20 text-[#185ADB] hover:bg-[#185ADB]/30 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
