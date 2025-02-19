
import * as z from "zod";

export const formSchema = z.object({
  practiceName: z.string().min(1, "Practice name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format. Example: example@domain.com"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Phone must match format: XXX-XXX-XXXX"),
  website: z.string()
    .min(1, "Website is required")
    .url("Please enter a valid website URL"),
  keywords: z.array(z.string()),
});

export type FormData = z.infer<typeof formSchema>;
