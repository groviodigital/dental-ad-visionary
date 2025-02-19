
import { SERVICES } from "@/types/dental";
import { ServiceCard } from "./ServiceCard";

interface ServicesSelectionProps {
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
}

export const ServicesSelection = ({
  selectedServices,
  onServiceToggle,
}: ServicesSelectionProps) => {
  return (
    <div className="animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Select up to 3 services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.name}
            service={service.name}
            description={service.description}
            selected={selectedServices.includes(service.name)}
            onClick={() => onServiceToggle(service.name)}
          />
        ))}
      </div>
    </div>
  );
};
