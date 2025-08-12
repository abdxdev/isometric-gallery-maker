import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Header } from "@/components/header";
import { ScreenshootsIcon } from "@/components/svg/screenshoots";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: { default: "Screenshoots", template: "%s | Screenshoots" },
  description: "Preview URLs in device frames, create isometric galleries, and style screenshots with overlays and gradients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
          <div className="flex flex-col w-full h-screen">
            <Header
              name="Screenshoots"
              logo={<ScreenshootsIcon className="h-6 w-6" />}
              isBeta={true}
              pages={[
                { href: "/isometric-gallery", label: "Isometric Gallery" },
                { href: "/screen-decorator", label: "Screen Decorator" },
              ]}
              githubRepo="abdxdev/screenshoots"
              portfolioUrl="https://abd-dev.studio"
            />
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
