
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600">Page not found</p>
          <p className="text-gray-500 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-gradient-to-r from-grovio-lime to-grovio-teal text-white hover:opacity-90">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
