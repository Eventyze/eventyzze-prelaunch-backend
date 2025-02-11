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

      ownerName: {
        type: DataTypes.STRING,
        allowNull: false,
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
        type: DataTypes.STRING,
        allowNull: false,
      },

      startTime: {
        type: DataTypes.STRING,
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
        defaultValue: null
      },

      endTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dyteDetails: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      hostJoinTime: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
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

      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      cost: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      videoUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },

      isRecorded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

  },
  {
    sequelize: database,
    tableName: "Events",
  }
);

export default Events;
