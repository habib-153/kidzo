import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, FileText } from "lucide-react";

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
  const [isAdmin, setIsAdmin] = useState(false); // Simulated admin state

  // Simulated login/admin toggle (you'd replace this with actual authentication)
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  // Handle editing of terms
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Render terms content
  const renderTermsContent = () => {
    if (isEditing) {
      return (
        <textarea
          className="w-full h-[500px] p-4 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
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

  return (
    <div className="container mx-auto p-4">
      {/* Admin Mode Toggle (for demonstration) */}
      <div className="mb-4 flex items-center justify-end">
        <Label className="mr-2">Admin Mode</Label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={toggleAdminMode}
          className="toggle toggle-primary"
        />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            View Terms & Conditions
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Terms & Conditions</span>
              {isAdmin && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TermsAndConditions;
