import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import { SubscriptionTransactionAttributes } from "../../types/modelTypes";
import { DatabaseSubscriptionPlans } from "../subscriptionPlan/subscriptionPlanModel";

export class SubscriptionTransaction extends Model<SubscriptionTransactionAttributes> {}

SubscriptionTransaction.init(
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

    subscriptionPlanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: DatabaseSubscriptionPlans,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },

    paymentMethod: {
      type: DataTypes.ENUM("credit_card", "bank_transfer", "wallet", "paypal"),
      allowNull: false,
    },

    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    dateOfPayment: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    dateOfExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    tableName: "SubscriptionTransaction",
  }
);

export default SubscriptionTransaction;
