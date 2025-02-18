
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone } from "lucide-react";

interface AdPreviewProps {
  headlines: string[];
  descriptions: string[];
  url: string;
}

export const AdPreview = ({ headlines, descriptions, url }: AdPreviewProps) => {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  const formatUrl = (url: string) => {
    // Remove http:// or https:// and trailing slash
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  const displayUrl = formatUrl(url);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="desktop" onClick={() => setView("desktop")}>
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" onClick={() => setView("mobile")}>
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="desktop" className="mt-4">
          <div className="border rounded-lg p-4 bg-white">
            {/* Ad Label */}
            <div className="inline-block text-[11px] font-medium px-1 mb-1 text-[#006621] border border-[#006621] rounded">
              Ad
            </div>
            {/* Display URL */}
            <div className="text-[15px] text-[#202124] font-normal mb-1">{displayUrl}</div>
            {/* Headlines */}
            <div className="mb-1">
              <h3 className="text-[20px] leading-6 text-[#1a0dab] font-normal inline">
                {headlines.map((headline, index) => (
                  <span key={index}>
                    {headline}
                    {index < headlines.length - 1 && (
                      <span className="text-gray-500 mx-1">|</span>
                    )}
                  </span>
                ))}
              </h3>
            </div>
            {/* Descriptions */}
            <div>
              {descriptions.map((description, index) => (
                <p 
                  key={index} 
                  className="text-[14px] text-[#4d5156] leading-5 whitespace-normal break-words w-full overflow-visible"
                >
                  {description}
                </p>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="mobile" className="mt-4">
          <div className="border rounded-lg p-3 bg-white max-w-[320px] mx-auto">
            {/* Ad Label */}
            <div className="inline-block text-[11px] font-medium px-1 mb-1 text-[#006621] border border-[#006621] rounded">
              Ad
            </div>
            {/* Display URL */}
            <div className="text-[14px] text-[#202124] font-normal mb-1">{displayUrl}</div>
            {/* Headlines */}
            <div className="mb-1">
              <h3 className="text-[18px] leading-5 text-[#1a0dab] font-normal inline">
                {headlines.map((headline, index) => (
                  <span key={index}>
                    {headline}
                    {index < headlines.length - 1 && (
                      <span className="text-gray-500 mx-1">|</span>
                    )}
                  </span>
                ))}
              </h3>
            </div>
            {/* Descriptions */}
            <div>
              {descriptions.map((description, index) => (
                <p 
                  key={index} 
                  className="text-[13px] text-[#4d5156] leading-5 whitespace-normal break-words w-full overflow-visible"
                >
                  {description}
                </p>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
