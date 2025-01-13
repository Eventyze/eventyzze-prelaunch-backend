import { Transaction } from "sequelize";
import Followings from "../../models/followings/followingsModel";

const followingsRepositories = {

  create: async (data: any, transaction?:Transaction) => {
    try {
      const newOtp = await Followings.create(data, { transaction });
      return newOtp;
    } catch (error: any) {
      throw new Error(`Error creating user followings: ${error.message}`);
    }
  },
  
};

export default {
    followingsRepositories,
};
