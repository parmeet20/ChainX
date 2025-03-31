import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <main className="relative z-10 pt-24 sm:pt-24 md:pt-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-slate-300">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Supply Chain
            </span>
            <br />
            <span className="text-gray-700 dark:text-slate-300">
              Powered by Solana
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Revolutionize your supply chain management with blockchain-powered
            transparency, real-time tracking, and immutable audit trails.
          </p>

          <div className="flex justify-center gap-6">
            <Link href="/profile">
              <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-sm font-semibold leading-6 text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1.5 px-4 ring-1 ring-white/10">
                  <span>Get Started</span>
                  <svg
                    fill="none"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-7xl mx-auto">
          <Card className="bg-white border border-gray-300 backdrop-blur-sm hover:border-indigo-400 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-indigo-400">
            <CardHeader>
              <CardTitle className="text-indigo-400 dark:text-indigo-400">
                Blockchain Transparency
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Every transaction and movement recorded immutably on Solana
                blockchain
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border border-gray-300 backdrop-blur-sm hover:border-indigo-400 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-indigo-400">
            <CardHeader>
              <CardTitle className="text-indigo-400 dark:text-indigo-400">
                Real-Time Tracking
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Monitor shipments with live GPS tracking and IoT sensor
                integration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border border-gray-300 backdrop-blur-sm hover:border-indigo-400 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-indigo-400">
            <CardHeader>
              <CardTitle className="text-indigo-400 dark:text-indigo-400">
                Smart Contracts
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Automate payments and agreements with self-executing contracts
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white backdrop-blur-sm border border-gray-300 rounded-2xl p-8 max-w-7xl mx-auto dark:bg-slate-900/50 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300 dark:divide-slate-800">
            <div className="text-center py-4 sm:py-0">
              <div className="text-4xl font-bold text-indigo-400 dark:text-indigo-500">
                1M+
              </div>
              <div className="text-gray-600 mt-2 dark:text-slate-400">
                Transactions Daily
              </div>
            </div>
            <div className="text-center py-4 sm:py-0">
              <div className="text-4xl font-bold text-indigo-400 dark:text-indigo-500">
                500ms
              </div>
              <div className="text-gray-600 mt-2 dark:text-slate-400">
                Average Block Time
              </div>
            </div>
            <div className="text-center py-4 sm:py-0">
              <div className="text-4xl font-bold text-indigo-400 dark:text-indigo-500">
                $0.0001
              </div>
              <div className="text-gray-600 mt-2 dark:text-slate-400">
                Avg Transaction Cost
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
