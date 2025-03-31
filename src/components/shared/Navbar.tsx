"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ModeToggle } from "./ModeToggle";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useTheme } from "next-themes";

const menuItems = [
  { name: "Home", link: "/" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Services", link: "/services" },
  { name: "Profile", link: "/profile" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const walletButtonStyle = {
    backgroundColor: theme === "dark" ? "#becbd6" : "	#3a3d45",
    borderRadius: "24px",
    color: theme === "dark" ? "black" : "white",
    padding: "12px 24px", // Increased padding for larger size
    fontWeight: "500",
    fontSize: "16px", // Added font size for better readability
    border: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "140px", // Added minimum width for consistent size
    height: "48px", // Increased height
  };

  return (
    <nav className="fixed w-full top-4 z-[450] px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex h-16 items-center justify-between px-6 rounded-4xl border bg-slate-100/70 backdrop-blur-2xl shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800/30 dark:border-gray-700">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2  font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105"
          >
            {"ChainX"}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-sm font-medium transition-all duration-200 hover:text-primary text-foreground/80 dark:text-gray-200 dark:hover:text-white hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connect Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <WalletMultiButton style={walletButtonStyle} />
          </div>

          {/* Mobile Navigation Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden px-2 hover:bg-transparent dark:hover:bg-gray-800"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6 dark:text-gray-200" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] dark:bg-gray-900 dark:border-gray-800"
            >
              <DialogTitle>{"ChainX"}</DialogTitle>
              <div className="flex flex-col h-full">
                <div className="flex-1 pt-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className="flex py-3 px-4 text-sm font-medium transition-all duration-200 hover:bg-accent dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t dark:border-gray-800">
                  <ModeToggle />
                  <WalletMultiButton style={walletButtonStyle} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
