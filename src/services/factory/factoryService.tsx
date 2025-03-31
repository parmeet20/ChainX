import { SupplyChain } from "@/utils/supply_chain";
import { IFactory, IProductInspector } from "@/utils/types";
import { BN, Program } from "@coral-xyz/anchor";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import { getUserWithPda } from "../user/userService";

export const createNewFactory = async (
  program: Program<SupplyChain>,
  NAME: string,
  DESCRIPTION: string,
  LATITUDE: number,
  LONGITUDE: number,
  CONTACT_INFO: string,
  publicKey: PublicKey
): Promise<TransactionSignature> => {
  const [userPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), publicKey.toBuffer()],
    program.programId
  );
  const factoryCount = await program.account.user.fetch(userPda);
  const f_id = factoryCount.factoryCount.add(new BN(1));
  const [factoryPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("factory"),
      userPda.toBuffer(),
      f_id.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const tx = await program.methods
    .createFactory(NAME, DESCRIPTION, LATITUDE, LONGITUDE, CONTACT_INFO)
    .accountsPartial({
      factory: factoryPda,
      user: userPda,
      owner: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  return tx;
};

export const getFactory = async (
  program: Program<SupplyChain>,
  factoryPda: string
): Promise<IFactory> => {
  const fPda = new PublicKey(factoryPda);
  const factory = await program.account.factory.fetch(fPda);
  return {
    factory_id: factory.factoryId,
    name: factory.name,
    description: factory.description,
    owner: factory.owner,
    created_at: factory.createdAt,
    latitude: factory.latitude,
    longitude: factory.longitude,
    contact_info: factory.contactInfo,
    product_count: factory.productCount,
    balance: factory.balance,
    publicKey: fPda,
  };
};

export const getMyFactories = async (
  program: Program<SupplyChain>,
  publicKey: PublicKey
): Promise<IFactory[]> => {
  const factories = await program.account.factory.all();
  const myFactories = factories
    .filter(
      (f) =>
        f.account.owner.toString().toLocaleUpperCase() ===
        publicKey.toString().toLocaleUpperCase()
    )
    .map((f) => {
      return {
        factory_id: f.account.factoryId,
        name: f.account.name,
        description: f.account.description,
        owner: f.account.owner,
        created_at: f.account.createdAt,
        latitude: f.account.latitude,
        longitude: f.account.longitude,
        contact_info: f.account.contactInfo,
        product_count: f.account.productCount,
        balance: f.account.balance,
        publicKey: f.publicKey,
      };
    });

  return myFactories;
};

export const getFactoryFromProduct = async (
  program: Program<SupplyChain>,
  product_pda: string
): Promise<IFactory> => {
  // Fetch the product details using the product_pda
  const product = await program.account.product.fetch(product_pda);

  // Fetch all factories
  const factories = await program.account.factory.all();

  // Find the factory that matches the product's factory_id
  const matchingFactory = factories.find(
    (factory) =>
      factory.account.factoryId.toString() === product.factoryId.toString()
  );

  // If no matching factory is found, throw an error
  if (!matchingFactory) {
    throw new Error(
      `Factory with ID ${product.factoryId.toString()} not found`
    );
  }

  // Return the matching factory account data
  return {
    factory_id: matchingFactory.account.factoryId,
    name: matchingFactory.account.name,
    description: matchingFactory.account.description,
    owner: matchingFactory.account.owner,
    created_at: matchingFactory.account.createdAt,
    latitude: matchingFactory.account.latitude,
    longitude: matchingFactory.account.longitude,
    contact_info: matchingFactory.account.contactInfo,
    product_count: matchingFactory.account.productCount,
    balance: matchingFactory.account.balance,
    publicKey: matchingFactory.publicKey,
  };
};

export const withdrawFactoryBalance = async (
  program: Program<SupplyChain>,
  factory_pda: string,
  amount: number,
  publicKey: PublicKey
): Promise<TransactionSignature> => {
  const user_pda = await getUserWithPda(program, publicKey);
  const usr = await program.account.user.fetch(new PublicKey(user_pda));
  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("transaction"),
      user_pda.toBuffer(),
      usr.transactionCount.add(new BN(1)).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const tx = await program.methods
    .withdrawBalanceAsFactory(new BN(amount*LAMPORTS_PER_SOL))
    .accountsPartial({
      transaction: transactionPda,
      factory: new PublicKey(factory_pda),
      user: user_pda,
      owner: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();
  return tx;
};

export const fetchAllPendingPaymentsToInspector = async (
  program: Program<SupplyChain>,
  factory_pda: string,
  product_pda: string
): Promise<IProductInspector> => {
  const factory = await program.account.factory.fetch(
    new PublicKey(factory_pda)
  );
  const product = await program.account.product.fetch(
    new PublicKey(product_pda)
  );
  const inspectors = await program.account.productInspector.all();
  const inspector = inspectors.find(
    (i) =>
      i.account.productId === product.productId && product.factoryId === factory
  );
  if (!inspector) {
    throw new Error(
      "No matching inspector found for the given product and factory."
    );
  }

  return {
    inspector_id: inspector.account.inspectorId,
    name: inspector.account.name,
    latitude: inspector.account.latitude,
    longitude: inspector.account.longitude,
    product_id: inspector.account.productId,
    inspection_outcome: inspector.account.inspectionOutcome,
    notes: inspector.account.notes,
    inspection_date: inspector.account.inspectionDate,
    fee_charge_per_product: inspector.account.feeChargePerProduct,
    balance: inspector.account.balance,
    owner: inspector.account.owner,
    publicKey: inspector.publicKey,
  };
};
