import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function NavigationBreadcrumb({ items }: NavigationBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.location.reload()}
        className="text-[#B8BAC1] hover:text-white hover:bg-[#4A4E56] p-2"
      >
        <Home className="w-4 h-4" />
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3 text-[#B8BAC1]" />
          {item.onClick ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={item.onClick}
              className={`text-sm px-2 py-1 h-auto ${
                item.active 
                  ? "text-white font-medium" 
                  : "text-[#B8BAC1] hover:text-white"
              }`}
            >
              {item.label}
            </Button>
          ) : (
            <span className={`${
              item.active 
                ? "text-white font-medium" 
                : "text-[#B8BAC1]"
            }`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}