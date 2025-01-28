import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import {
  Roles,
  WalletAttributes,
} from "../../types/modelTypes";
import User from "../users/usersModel";

export class Wallet extends Model<WalletAttributes> {}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    walletType: {
      type: DataTypes.ENUM(...Object.values(Roles)),
      allowNull: false,
      validate: {
        isIn: [Object.values(Roles)],
      },
    },

    totalBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    ledgerBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    
  },
  {
    sequelize: database,
    tableName: "Wallet",
  }
);
  
export default Wallet;
