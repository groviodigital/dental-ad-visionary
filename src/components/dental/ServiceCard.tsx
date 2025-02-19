
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export const ServiceCard = ({
  service,
  description,
  selected,
  onClick,
}: ServiceCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]",
        selected
          ? "border-grovio-teal bg-gradient-to-r from-grovio-lime/10 to-grovio-teal/10"
          : "border-gray-200 hover:border-grovio-teal hover:bg-gray-50"
      )}
    >
      <h3
        className={cn(
          "font-semibold mb-2",
          selected ? "text-grovio-teal" : "text-gray-700"
        )}
      >
        {service}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
