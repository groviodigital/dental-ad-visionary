
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center w-full mb-8 animate-fadeIn">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-200",
                index < currentStep
                  ? "bg-primary border-primary text-white"
                  : index === currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-300"
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-medium",
                index <= currentStep ? "text-primary" : "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-[2px] w-12 mx-2",
                index < currentStep ? "bg-primary" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
