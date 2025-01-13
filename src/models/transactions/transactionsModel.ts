import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import { TransactionAttributes } from "../../types/modelTypes";

export class Transaction extends Model<TransactionAttributes> {}

Transaction.init(
  {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
      },

      userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
              model: User,
              key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
      },

      amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },

      type: {
          type: DataTypes.ENUM("credit", "debit"),
          allowNull: false,
      },

      status: {
          type: DataTypes.ENUM("pending", "completed", "failed"),
          allowNull: false,
          defaultValue: "pending",
      },
      reference: ""
  },
  {
    sequelize: database,
    tableName: "User",
  }
)
