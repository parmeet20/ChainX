"use client";
import { getUser, registerUser } from "@/services/user/userService";
import { IUser } from "@/utils/types";
import { getProvider } from "@/services/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegisterUserDialog } from "@/components/shared/dialog/register-user-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useStore from "@/store/user_store";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setStoreUser } = useStore();

  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const program = useMemo(() => {
    if (!publicKey) return null;
    return getProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, sendTransaction, signTransaction]);

  useEffect(() => {
    const fetchUser = async () => {
      if (publicKey && program) {
        try {
          const u = await getUser(program, publicKey);
          setUser(u);
          setStoreUser(u!);
        } catch (error) {
          console.log(error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [program, publicKey]);

  const handleRegister = async (name: string, role: string) => {
    if (!program || !publicKey) return;
    try {
      setLoading(true);
      const tx = await registerUser(program, publicKey, name, role);
      toast("Transaction successful", {
        description: `Profile created successfully`,
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}>
            Signature
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      const u = await getUser(program, publicKey);
      setUser(u);
      setStoreUser(u!);
      setLoading(false);
    }
  };

  // Wallet Not Connected State
  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl animate-in fade-in zoom-in">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connect Your Wallet
            </h1>
            <p className="mt-4 text-muted-foreground">
              Please connect your Solana wallet to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile Not Found State
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-md mx-auto pt-20">
          <Card className="border-0 shadow-xl animate-in fade-in zoom-in">
            <CardContent className="p-8 text-center space-y-6">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarFallback className="bg-gray-800 dark:bg-slate-200 text-white dark:text-black text-2xl">
                  ?
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Create Your Profile
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Get started by setting up your profile
                </p>
              </div>
              <RegisterUserDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                onRegister={handleRegister}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-4xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              {user.name.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {user.name}
            </h1>
            <Badge className="mt-2 text-sm px-4 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-100">
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-500 dark:text-gray-400 text-sm">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user.transaction_count.toString()}
              </p>
            </CardContent>
          </Card>

          {user.role === "INSPECTOR" ? (
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-500 dark:text-gray-400 text-sm">
                  Inspector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.inspector_count.toString()}
                </p>
              </CardContent>
            </Card>
          ) : null}
          {user.role === "WAREHOUSE" && (
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-500 dark:text-gray-400 text-sm">
                  Warehouses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.warehouse_count.toString()}
                </p>
              </CardContent>
            </Card>
          )}
          {user.role === "FACTORY" && (
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-500 dark:text-gray-400 text-sm">
                  Factories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.factory_count.toString()}
                </p>
              </CardContent>
            </Card>
          )}

          {user.role === "SELLER" && (
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-500 dark:text-gray-400 text-sm">
                  Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.seller_count.toString()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Wallet Address
                  </dt>
                  <dd className="font-mono text-gray-900 dark:text-gray-100">
                    {user.owner.toString().slice(0, 6)}...
                    {user.owner.toString().slice(-4)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Registration Status
                  </dt>
                  <dd className="text-green-600 dark:text-green-400 font-medium">
                    Active
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
