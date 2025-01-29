import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import Events from "../events/eventsModel";

export class Likes extends Model {}

Likes.init(
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
    },

    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Events,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize: database,
    tableName: "Likes",
  }
);

export default Likes;
