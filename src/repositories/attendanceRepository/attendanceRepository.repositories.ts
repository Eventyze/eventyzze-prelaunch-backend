import Attendance from "../../models/attendance/attendanceModel";
import { Transaction } from "sequelize";



const attendanceRepositories = {
    create: async (data: any, transaction?:Transaction) => {
        try {
          const newAttendance = await Attendance.create(data, { transaction });
          return newAttendance;
        } catch (error: any) {
          throw new Error(`Error creating Attendance: ${error.message}`);
        }
      },
      deleteOne: async (filter: any) => {
        try {
          const attendance = await Attendance.findOne({ where: filter });
          if (!attendance) throw new Error("Attendance not found");
          await attendance.destroy();
          return attendance;
        } catch (error: any) {
          throw new Error(`Error deleting Attendance: ${error.message}`);
        }
      },
    
      deleteMany: async (filter: any) => {
        try {
          const affectedRows = await Attendance.destroy({ where: filter });
          return { affectedRows };
        } catch (error: any) {
          throw new Error(`Error deleting Attendances: ${error.message}`);
        }
      },
    
      getOne: async (filter: Record<string, any>, projection: any = null, include: boolean = false) => {
        try {
          const attendance = await Attendance.findOne({
            where: filter,
            attributes: projection,
            // include: include ? [
            //   { model: Wallet, as: 'wallet' },
            //   { model: Followers, as: 'userFollowers' },
            //   { model: Followings, as: 'userFollowings' }
            // ] : []
          });
          return attendance;
        } catch (error: any) {
          throw new Error(`Error fetching Attendance: ${error.message}`);
        }
      },
      
    
      getMany: async (filter: any, projection?: any, options?: any) => {
        try {
          const attendance = await Attendance.findAll({
            where: filter,
            attributes: projection,
            ...options,
          });
          return attendance;
        } catch (error: any) {
          throw new Error(`Error fetching Attendances: ${error.message}`);
        }
      },
    }



export default {
    attendanceRepositories
}