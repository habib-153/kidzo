import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

const TermsAndConditions = () => {
  // Initial terms content
  const initialContent = `Welcome to Our Platform Terms & Conditions

1. Acceptance of Terms
By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.

2. User Rights
- You have the right to use our services
- You agree to provide accurate information
- You must be of legal age to use our services

3. Limitations of Liability
Our platform is provided "as is" and we do not guarantee uninterrupted or error-free service.

4. Privacy
We respect your privacy and protect your personal information according to our Privacy Policy.

5. Intellectual Property
All content on this platform is protected by copyright and other intellectual property laws.

6. Modifications to Terms
We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.

7. Termination
We may terminate or suspend your account at our discretion, with or without notice.

8. Governing Law
These terms are governed by the laws of [Your Jurisdiction].

Last Updated: ${new Date().toLocaleDateString()}`;

  const [isEditing, setIsEditing] = useState(false);
  const [termsContent, setTermsContent] = useState(initialContent);

  // Use Redux authentication
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  // Determine if user is an admin
  const isAdmin = isAuthenticated && user?.role === "admin";

  // Handle editing of terms
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Optional: Add logic to save terms to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTermsContent(initialContent);
  };

  // Render terms content
  const renderTermsContent = () => {
    if (isEditing) {
      return (
        <textarea
          className="w-full h-[600px] p-4 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          value={termsContent}
          onChange={(e) => setTermsContent(e.target.value)}
        />
      );
    }

    return (
      <div className="prose max-w-full text-gray-700 leading-relaxed">
        {termsContent.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  // If loading, show a loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Terms & Conditions
          </h1>
          {isAdmin && !isEditing && (
            <Button
              variant="outline"
              onClick={handleEdit}
              className="hover:bg-blue-50 flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Terms
            </Button>
          )}
        </div>

        {/* Terms Content */}
        <div className="mt-4 relative">
          {renderTermsContent()}

          {/* Editing Controls */}
          {isEditing && (
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
