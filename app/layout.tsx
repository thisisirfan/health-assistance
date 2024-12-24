import { ToastProvider } from "@/components/ToastProvider";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Food Intelligence - Your Personal Health Assistant",
  description:
    "Track your nutrition, plan your meals, and achieve your health goals with Food Knowledge Graph platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
