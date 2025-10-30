import "@/styles/globals.css";
import { useRouter } from "next/router";
import AppSidebar from "./Appslidbar";
import { Toaster } from "react-hot-toast";



export default function App({ Component, pageProps }) {
  const router = useRouter();


  const showSidebarOn = ["/Dashboard", "/Expense","/Income"];

  const shouldShowSidebar = showSidebarOn.includes(router.pathname);

  return (
    <div className="antialiased min-h-screen flex">
      {shouldShowSidebar && (
        <div className="w-5">
          <Toaster
  position="top-center"
  reverseOrder={true}
/>
          <AppSidebar />
        </div>
      )}

      
      <main className={`flex-1 ${shouldShowSidebar ? "ml-0 md:ml-64" : ""}`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

