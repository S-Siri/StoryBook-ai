// // app/layout.tsx
// import React from "react";
// import { AuthProvider } from "./components/AuthContext";
// import "./globals.css";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import Navbar from './components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <Navbar />
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}
