import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import { TransactionAttributes } from "../../types/modelTypes";

export class Transactions extends Model<TransactionAttributes> {}

Transactions.init(
  {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },

     description: {
        type: DataTypes.TEXT,
        allowNull: false,
     },

      userUUId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
              model: User,
              key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
      },

      userEventyzzeId: {
          type: DataTypes.STRING,
          allowNull: false,
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

      reference: {
          type: DataTypes.STRING,
          allowNull: false,
      },
  },
  {
    sequelize: database,
    tableName: "Transactions",
  }
)
