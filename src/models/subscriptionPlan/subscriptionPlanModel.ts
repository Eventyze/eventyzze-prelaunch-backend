import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import {
  SubscriptionPlanAttributes,
} from "../../types/modelTypes";

export class DatabaseSubscriptionPlans extends Model<SubscriptionPlanAttributes> {}


DatabaseSubscriptionPlans.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      attendeeLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      streamingLimitHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize: database,
      tableName: "Subscription",
    }
  );