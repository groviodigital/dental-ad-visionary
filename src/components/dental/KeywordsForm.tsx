
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegister } from "react-hook-form";
import { FormData } from "./schema";

interface KeywordsFormProps {
  register: UseFormRegister<FormData>;
}

export const KeywordsForm = ({ register }: KeywordsFormProps) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <Label>Keywords (up to 3)</Label>
        <div className="grid grid-cols-1 gap-4">
          {[0, 1, 2].map((index) => (
            <Input
              key={index}
              {...register(`keywords.${index}`)}
              placeholder={`Keyword ${index + 1}`}
              className="mt-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
