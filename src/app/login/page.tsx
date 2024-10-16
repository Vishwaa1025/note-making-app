// src/app/login/page.tsx

import {LoginForm} from "@/components/auth/LoginForm";  // Assuming you have a LoginForm component

export default function LoginPage() {
  return (
    <div className="flex items-center h-screen">
        <div className="container mx-auto p-4">
            <LoginForm />
        </div>
    </div>
    
  );  
}
