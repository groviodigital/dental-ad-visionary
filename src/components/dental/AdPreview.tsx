
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

        {/* Desktop Preview */}
        <TabsContent value="desktop" className="mt-4">
          <div className="border rounded-lg overflow-hidden">
            {/* Google Search Bar */}
            <div className="bg-white border-b px-6 py-3">
              <div className="flex items-center max-w-[632px]">
                <img src="/lovable-uploads/c210e479-b641-439a-828d-aa2f6c492ee9.png" alt="Google Logo" className="h-7 mr-4" />
                <div className="flex-1 bg-white border rounded-full px-4 py-2 shadow-sm">
                  <div className="text-sm text-gray-600">dentist near me</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white px-6 border-b">
              <div className="flex space-x-6 text-sm">
                <span className="border-b-4 border-[#1a73e8] text-[#1a73e8] py-3">All</span>
                <span className="text-gray-600 py-3">Maps</span>
                <span className="text-gray-600 py-3">Images</span>
                <span className="text-gray-600 py-3">News</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white p-6">
              {/* Ad Container */}
              <div className="max-w-[632px]">
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
                      className="text-[14px] text-[#4d5156] leading-5 break-words"
                    >
                      {description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Mobile Preview */}
        <TabsContent value="mobile" className="mt-4">
          <div className="border rounded-lg overflow-hidden max-w-[360px] mx-auto">
            {/* Mobile Search Bar */}
            <div className="bg-white border-b px-4 py-2">
              <div className="flex items-center">
                <img src="/lovable-uploads/c210e479-b641-439a-828d-aa2f6c492ee9.png" alt="Google Logo" className="h-6 mr-3" />
                <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5">
                  <div className="text-xs text-gray-600">dentist near me</div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="bg-white px-4 py-1 border-b overflow-x-auto whitespace-nowrap">
              <div className="flex space-x-4 text-xs">
                <span className="border-b-2 border-[#1a73e8] text-[#1a73e8] py-2">All</span>
                <span className="text-gray-600 py-2">Maps</span>
                <span className="text-gray-600 py-2">Images</span>
                <span className="text-gray-600 py-2">News</span>
              </div>
            </div>

            {/* Mobile Filters */}
            <div className="bg-white px-4 py-2 border-b overflow-x-auto whitespace-nowrap">
              <div className="flex space-x-2 text-xs">
                <span className="bg-gray-100 rounded-full px-3 py-1">Top rated</span>
                <span className="bg-gray-100 rounded-full px-3 py-1">Open now</span>
                <span className="bg-gray-100 rounded-full px-3 py-1">Nearby</span>
              </div>
            </div>

            {/* Mobile Ad Container */}
            <div className="bg-white p-4">
              {/* Ad Label */}
              <div className="inline-block text-[11px] font-medium px-1 mb-1 text-[#006621] border border-[#006621] rounded">
                Ad
              </div>
              {/* Display URL */}
              <div className="text-[14px] text-[#202124] font-normal mb-1">{displayUrl}</div>
              {/* Headlines */}
              <div className="mb-1">
                <h3 className="text-[16px] leading-5 text-[#1a0dab] font-normal inline">
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
                    className="text-[13px] text-[#4d5156] leading-5 break-words"
                  >
                    {description}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
