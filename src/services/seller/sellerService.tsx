import { SupplyChain } from "@/utils/supply_chain";
import { BN, Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import { getUserWithPda } from "../user/userService";
import { ISeller } from "@/utils/types";

export const createSeller = async (
  program: Program<SupplyChain>,
  name: string,
  description: string,
  latitude: number,
  longitude: number,
  contact_info: string,
  publicKey: PublicKey
): Promise<TransactionSignature> => {
  const user_pda = await getUserWithPda(program, publicKey);
  const user = await program.account.user.fetch(user_pda);
  const [sellerPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("seller"),
      user_pda.toBuffer(),
      user.sellerCount.add(new BN(1)).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const tx = await program.methods
    .createSellerInstruction(
      name,
      description,
      latitude,
      longitude,
      contact_info
    )
    .accountsPartial({
      user: user_pda,
      seller: sellerPda,
      owner: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();
  return tx;
};

export const getAllSellers = async (
  program: Program<SupplyChain>,
  publicKey: PublicKey
): Promise<ISeller[]> => {
  const sellers = await program.account.seller.all();
  const filteredSellers = sellers.filter(
    (s) => s.account.owner.toString() === publicKey.toString()
  );
  return filteredSellers.map((seller) => ({
    seller_id: Number(seller.account.sellerId),
    name: seller.account.name,
    description: seller.account.description,
    products_count: Number(seller.account.productsCount),
    latitude: seller.account.latitude,
    longitude: seller.account.longitude,
    contact_info: seller.account.contactInfo,
    registered_at: Number(seller.account.registeredAt),
    order_count: Number(seller.account.orderCount),
    owner: seller.account.owner,
    publicKey: seller.publicKey,
  }));
};

export const getSeller = async (
  program: Program<SupplyChain>,
  seller_pda: string
): Promise<ISeller> => {
  const seller = await program.account.seller.fetch(new PublicKey(seller_pda));
  return {
    seller_id: Number(seller.sellerId),
    name: seller.name,
    description: seller.description,
    products_count: Number(seller.productsCount),
    latitude: seller.latitude,
    longitude: seller.longitude,
    contact_info: seller.contactInfo,
    registered_at: Number(seller.registeredAt),
    order_count: Number(seller.orderCount),
    owner: seller.owner,
    publicKey: new PublicKey(seller_pda),
  };
};
export const recieveProdctAsSeller = async (
  program: Program<SupplyChain>,
  publicKey: PublicKey,
  logisticPda: string,
  orderPda: string
): Promise<TransactionSignature> => {
  const user_pda = await getUserWithPda(program, publicKey);
  const seller = await program.account.user.fetch(user_pda);
  const [sellerPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("seller"),
      user_pda.toBuffer(),
      seller.sellerCount.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const sllr = await program.account.seller.fetch(sellerPda);
  const [seller_productPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("seller_product"),
      sellerPda.toBuffer(),
      sllr.productsCount.add(new BN(1)).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const tx = await program.methods
    .receiveProductInstructionAsSeller()
    .accountsPartial({
      signer: publicKey,
      user: user_pda,
      seller: sellerPda,
      sellerProductStock: seller_productPda,
      logistics: new PublicKey(logisticPda),
      order: new PublicKey(orderPda),
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();
  return tx;
};
