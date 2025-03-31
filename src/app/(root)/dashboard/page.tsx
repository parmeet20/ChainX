import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivedTransactionsPage from "@/pages/transactions/ReceivedTransactionsPage";
import PaidTransactionsPage from "@/pages/transactions/PaidTransactionsPage";

const DashboardPage = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50 w-full dark:bg-gray-900 p-8">
      <Tabs defaultValue="analytics">
        <TabsList className="grid grid-cols-3 sm:w-[50%] mx-auto">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="pending">Paid Transactions</TabsTrigger>
          <TabsTrigger value="received">Received Transactions</TabsTrigger>
        </TabsList>

        {/* Analytics Tab Content */}
        <TabsContent value="analytics">
          <div className="mt-4 p-4 border rounded-lg">
            {/* Replace with your Analytics component */}
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
            <p className="text-muted-foreground">
              Analytics components will go here
            </p>
          </div>
        </TabsContent>

        {/* Pending Transactions Tab Content */}
        <TabsContent value="pending">
          <PaidTransactionsPage />
        </TabsContent>
        {/* Received Transactions Tab Content */}
        <TabsContent value="received">
          <ReceivedTransactionsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
