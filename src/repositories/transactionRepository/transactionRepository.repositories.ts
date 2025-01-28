import { Transaction } from "sequelize";
import { Transactions } from "../../models/transactions/transactionsModel";

const transactionRepositories = {

  create: async (data: any, transaction?:Transaction) => {
    try {
      const newTransaction = await Transactions.create(data, { transaction });
      return newTransaction;
    } catch (error: any) {
      throw new Error(`Error creating Transaction: ${error.message}`);
    }
  },

  getOne: async (filter: Record<string, any>, projection: any = null, include: boolean = false) => {
    try {
      const transaction = await Transactions.findOne({
        where: filter,
        attributes: projection,
        // include: include ? [
        //   { model: Wallet, as: 'wallet' },
        // ] : []
      });
      return transaction;
    } catch (error: any) {
      throw new Error(`Error fetching Transaction: ${error.message}`);
    }
  },
  
};

export default {
    transactionRepositories,
};
