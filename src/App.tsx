// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import { AuthProvider } from "./contexts/AuthContext";
// // import { Web3Provider } from "./contexts/Web3Context";
// // import Index from "./pages/Index";
// // import LoginPage from "./pages/LoginPage";
// // import NotFound from "./pages/NotFound";
// // import SignupPage from "./pages/SignupPage";
// // import Dashboard from "./pages/Dashboard";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import Profile from "./pages/Profile";
// // import ProtectedRoute from "./components/ProtectedRoute";

// // const queryClient = new QueryClient();


// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <Toaster />
// //       <Sonner />
// //       <BrowserRouter>
// //         <Web3Provider>
// //           <AuthProvider>
// //             <Routes>
// //             <Route path="/" element={<Index />} />
// //             <Route path="/login" element={<LoginPage />} />
// //             <Route path="/signup" element={<SignupPage />} />
// //             <Route path="/forgot-password" element={<ForgotPassword />} />
// //             <Route 
// //               path="/dashboard" 
// //               element={
// //                 <ProtectedRoute>
// //                   <Dashboard />
// //                 </ProtectedRoute>
// //               } 
// //             />
// //             <Route 
// //               path="/profile" 
// //               element={
// //                 <ProtectedRoute>
// //                   <Profile />
// //                 </ProtectedRoute>
// //               } 
// //             />
// //             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
// //             <Route path="*" element={<NotFound />} />
// //           </Routes>
// //         </AuthProvider>
// //         </Web3Provider>
// //       </BrowserRouter>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;



// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import { Web3Provider } from "./contexts/Web3Context";
// import LoginPage from "./pages/LoginPage";
// import NotFound from "./pages/NotFound";
// import SignupPage from "./pages/SignupPage";
// import Dashboard from "./pages/Dashboard";
// import ForgotPassword from "./pages/ForgotPassword";
// import Profile from "./pages/Profile";
// import ProtectedRoute from "./components/ProtectedRoute";

// const queryClient = new QueryClient();

// const App = () => (
// <QueryClientProvider client={queryClient}>
// <TooltipProvider>
// <Toaster />
// <Sonner />
// <BrowserRouter>
// <Web3Provider>
// <AuthProvider>
// <Routes>
// {/* Public dashboard as home */}
// <Route path="/" element={<Dashboard />} />
// <Route path="/dashboard" element={<Dashboard />} />
//           {/* Auth pages */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />

//           {/* Keep profile protected (optional) */}
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />

//           {/* Catch-all */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </AuthProvider>
//     </Web3Provider>
//   </BrowserRouter>
// </TooltipProvider>
// </QueryClientProvider> );
// export default App;



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Toaster />
<Sonner />
<BrowserRouter>
<Web3Provider>
<AuthProvider>
<Routes>
{/* Public dashboard as home */}
<Route path="/" element={<Dashboard />} />
<Route path="/dashboard" element={<Dashboard />} />
          {/* Auth pages (still available) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Profile stays behind login */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Doctor Dashboard */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Web3Provider>
  </BrowserRouter>
</TooltipProvider>
</QueryClientProvider> );
export default App;