import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Screenshoots",
  description: "Preview URLs in device frames, create isometric galleries, and style screenshots with overlays and gradients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
            <div className="flex flex-col w-full">
              <Header />
              <div className="flex-1 flex">
                <AppSidebar />
                <SidebarInset>
                  {children}
                </SidebarInset>
              </div>
            </div>
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
