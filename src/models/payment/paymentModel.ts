import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import Events from "../events/eventsModel";
import { PaymentAttributes } from "../../types/modelTypes";

export class Payment extends Model<PaymentAttributes> {}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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

    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Events,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true, // E.g., "credit_card", "bank_transfer", "paypal"
    },

    transactionId: {
      type: DataTypes.STRING,
      allowNull: true, // Store transaction reference from payment gateway
      unique: true,
    },

    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    tableName: "Payments",
  }
);

export default Payment;
