import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { router } from "./router";

/**
 * Priest services site — mostly public (no auth needed for browsing).
 * Renders the RouterProvider directly with the QueryClientProvider
 * (provided in main.tsx). No Internet Identity gating for public pages.
 */
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
