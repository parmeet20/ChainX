import { SupplyChain } from "@/utils/supply_chain";
import { ISellerProductStock } from "@/utils/types";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export const getAllMySellerProducts = async (
  program: Program<SupplyChain>,
  seller_pda: string
): Promise<ISellerProductStock[]> => {
  const products = await program.account.sellerProductStock.all();
  const sellerPda = new PublicKey(seller_pda);
  console.log(products
    .filter((p) => p.account.sellerPda.equals(sellerPda))
    .map((p) => ({
      seller_id: p.account.sellerId,
      product_id: p.account.productId,
      stock_quantity: p.account.stockQuantity,
      stock_price: p.account.stockPrice,
      created_at: p.account.createdAt,
      publicKey: p.publicKey,
      product_pda: p.account.productPda,
    })))
  return products
    .filter((p) => p.account.sellerPda.equals(sellerPda))
    .map((p) => ({
      seller_id: p.account.sellerId,
      product_id: p.account.productId,
      stock_quantity: p.account.stockQuantity,
      stock_price: p.account.stockPrice,
      created_at: p.account.createdAt,
      publicKey: p.publicKey,
      product_pda: p.account.productPda,
    }));
};
