import { DataTypes, Model } from "sequelize";
import { database } from "../../configurations/database";
import User from "../users/usersModel";
import Events from "../events/eventsModel";
import { AttendanceAttributes } from "../../types/modelTypes";

export class Attendance extends Model<AttendanceAttributes> {}

Attendance.init(
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

    attendedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    tableName: "Attendance",
  }
);

export default Attendance;
