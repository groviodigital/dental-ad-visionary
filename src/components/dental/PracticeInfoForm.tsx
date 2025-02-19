
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "./schema";

interface PracticeInfoFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  formatPhoneNumber: (value: string) => string;
}

export const PracticeInfoForm = ({
  register,
  errors,
  formatPhoneNumber,
}: PracticeInfoFormProps) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <Label htmlFor="practiceName">Practice Name *</Label>
        <Input
          id="practiceName"
          {...register("practiceName")}
          className={`mt-1 ${errors.practiceName ? 'border-red-500' : ''}`}
          placeholder="Enter your practice name"
        />
        {errors.practiceName && (
          <span className="text-sm text-red-500">
            {errors.practiceName.message}
          </span>
        )}
      </div>
      <div>
        <Label htmlFor="website">Website *</Label>
        <Input
          id="website"
          type="url"
          {...register("website")}
          className={`mt-1 ${errors.website ? 'border-red-500' : ''}`}
          placeholder="https://www.yourpractice.com"
        />
        {errors.website && (
          <span className="text-sm text-red-500">
            {errors.website.message}
          </span>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
          placeholder="example@domain.com"
        />
        {errors.email && (
          <span className="text-sm text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>
      <div>
        <Label htmlFor="phone">Phone * (XXX-XXX-XXXX)</Label>
        <Input
          id="phone"
          {...register("phone")}
          className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="555-555-5555"
          onChange={(e) => {
            e.target.value = formatPhoneNumber(e.target.value);
          }}
        />
        {errors.phone && (
          <span className="text-sm text-red-500">
            {errors.phone.message}
          </span>
        )}
      </div>
    </div>
  );
};
