import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import { EventAttributes } from "../../types/modelTypes";

export class Events extends Model<EventAttributes>{}

Events.init(
  {
      id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
      },

      eventTitle: {
        type: DataTypes.STRING,
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

      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      eventAd: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      noOfLikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      noOfDislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      dyteDetails: {
        type: DataTypes
      },

      hostJoinTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      isLive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      isHosted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
      }

  },
  {
    sequelize: database,
    tableName: "Events",
  }
);

export default Events;
