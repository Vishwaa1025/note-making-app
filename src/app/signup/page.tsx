// src/app/signup/page.tsx

import {SignupForm} from "@/components/auth/SignupForm";  // Adjust the path if needed

export default function SignupPage() {
  return (
    <div className="flex items-center h-screen">
      <div className="container mx-auto p-4">
        <SignupForm />
      </div>
    </div>
  );
}
