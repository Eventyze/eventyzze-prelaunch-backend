import { Transaction } from "sequelize";
import Wallet from "../../models/wallets/walletModel";

const walletRepositories = {

  create: async (data: any, transaction?:Transaction) => {
    try {
      const newWallet = await Wallet.create(data, { transaction });
      return newWallet;
    } catch (error: any) {
      throw new Error(`Error creating user wallet: ${error.message}`);
    }
  },

  getOne: async (filter: Record<string, any>, projection: any = null, include: boolean = false) => {
    try {
      const wallet = await Wallet.findOne({
        where: filter,
        attributes: projection,
        // include: include ? [
        //   { model: Wallet, as: 'wallet' },
        // ] : []
      });
      return wallet;
    } catch (error: any) {
      throw new Error(`Error fetching Wallet: ${error.message}`);
    }
  },


  updateOne: async (filter: any, update: any, transaction?: Transaction) => {
    try {
      const wallet:any = await Wallet.findOne({ where: filter });
      await wallet.update(update, { transaction });
      return wallet;
    } catch (error: any) {
      throw new Error(`Error updating wallet: ${error.message}`);
    }
  },
  
};

export default {
    walletRepositories,
};
