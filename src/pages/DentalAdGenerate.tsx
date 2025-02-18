import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { StepIndicator } from "@/components/dental/StepIndicator";
import { ServiceCard } from "@/components/dental/ServiceCard";
import { AdPreview } from "@/components/dental/AdPreview";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const STEPS = ["Practice Info", "Services", "Keywords", "Preview"];

const SERVICES = [
  {
    name: "General Dentistry",
    description: "Comprehensive dental care for the whole family",
  },
  {
    name: "Preventive Care",
    description: "Regular checkups and cleanings to maintain oral health",
  },
  {
    name: "Cosmetic Dentistry",
    description: "Transform your smile with aesthetic dental procedures",
  },
  {
    name: "Restorative Dentistry",
    description: "Repair and restore damaged or missing teeth",
  },
  {
    name: "Dental Implants",
    description: "Permanent solution for missing teeth",
  },
  {
    name: "Orthodontics",
    description: "Straighten teeth and correct bite issues",
  },
  {
    name: "Pediatric Dentistry",
    description: "Specialized dental care for children",
  },
  {
    name: "Gum Care",
    description: "Treatment for periodontal disease and gum health",
  },
  {
    name: "Oral Surgery",
    description: "Surgical procedures for complex dental issues",
  },
  {
    name: "Emergency Dentistry",
    description: "Immediate care for dental emergencies",
  },
  {
    name: "Specialty Services",
    description: "Advanced dental procedures and treatments",
  },
];

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

interface DentalPracticeTable {
  id?: string;
  created_at?: string;
  last_updated?: string;
  email: string;
  phone: string;
  website: string;
  services: string[];
  practice_name: string;
}

type DentalPracticeCreate = Omit<DentalPracticeTable, 'id' | 'created_at' | 'last_updated'>;
type DentalPracticeUpdate = Partial<DentalPracticeCreate>;

export default function DentalAdGenerate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [generatedAd, setGeneratedAd] = useState<{
    headlines: string[];
    descriptions: string[];
    url: string;
  } | null>(null);

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: ["", "", ""],
    },
  });

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : prev.length < 3
        ? [...prev, service]
        : prev
    );
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    
    if (digits.length >= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };

  const savePracticeInfo = async (data: DentalPracticeCreate | DentalPracticeUpdate) => {
    try {
      if (practiceId) {
        const { error } = await supabase
          .from('dental_practices')
          .update(data)
          .eq('id', practiceId);
        
        if (error) throw error;
      } else {
        const fullData = data as DentalPracticeCreate;
        const { data: newPractice, error } = await supabase
          .from('dental_practices')
          .insert([fullData])
          .select('id')
          .single();
        
        if (error) throw error;
        setPracticeId(newPractice.id);
      }

      toast({
        title: "Success",
        description: "Progress saved successfully",
      });
      return true;
    } catch (error) {
      console.error('Error saving practice info:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const keywords = data.keywords.filter(Boolean);
      
      const { data: adData, error } = await supabase.functions.invoke<{
        headlines: string[];
        descriptions: string[];
        url: string;
      }>('generate-dental-ad', {
        body: {
          practiceName: data.practiceName,
          email: data.email,
          phone: data.phone,
          website: data.website,
          selectedServices,
          keywords,
        },
      });

      if (error) throw error;
      setGeneratedAd(adData);
      
      toast({
        title: "Success!",
        description: "Your Google Ad has been generated.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Dental Google Ad Generator
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Create optimized Google Ads for your dental practice in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator currentStep={currentStep} steps={STEPS} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 0 && (
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
              )}

              {currentStep === 1 && (
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
                        onClick={() => handleServiceToggle(service.name)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
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
              )}

              {currentStep === 3 && (
                <div className="animate-fadeIn">
                  {generatedAd ? (
                    <AdPreview {...generatedAd} />
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Ready to generate your ad
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Click generate to create your optimized Google Ad
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      if (currentStep === 0) {
                        const practiceInfo = watch();
                        const isValid = !errors.practiceName && 
                                      !errors.email && 
                                      !errors.phone && 
                                      !errors.website &&
                                      practiceInfo.practiceName &&
                                      practiceInfo.email &&
                                      practiceInfo.phone &&
                                      practiceInfo.website;
                        
                        if (!isValid) {
                          toast({
                            title: "Error",
                            description: "Please fill out all required fields correctly",
                            variant: "destructive",
                          });
                          return;
                        }

                        const saveSuccess = await savePracticeInfo({
                          practice_name: practiceInfo.practiceName,
                          email: practiceInfo.email,
                          phone: practiceInfo.phone,
                          website: practiceInfo.website,
                          services: [],
                        });

                        if (!saveSuccess) return;
                      }
                      
                      if (currentStep === 1) {
                        if (selectedServices.length === 0) {
                          toast({
                            title: "Error",
                            description: "Please select at least one service",
                            variant: "destructive",
                          });
                          return;
                        }

                        const saveSuccess = await savePracticeInfo({
                          services: selectedServices,
                        });

                        if (!saveSuccess) return;
                      }
                      
                      setCurrentStep((prev) => Math.min(3, prev + 1));
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      "Generate Ad"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
