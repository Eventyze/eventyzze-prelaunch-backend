import { Transaction } from "sequelize";
import Event from "../../models/events/eventsModel";
import Wallet from "../../models/wallets/walletModel";

const eventRepositories = {

  create: async (data: any, transaction?:Transaction) => {
    try {
      const newEvent = await Event.create(data, { transaction });
      return newEvent;
    } catch (error: any) {
      throw new Error(`Error creating Event: ${error.message}`);
    }
  },

  updateOne: async (filter: any, update: any, transaction?: Transaction) => {
    try {
      const event:any = await Event.findOne({ where: filter });
      await event.update(update, { transaction });
      return event;
    } catch (error: any) {
      throw new Error(`Error updating Event: ${error.message}`);
    }
  },

  deleteOne: async (filter: any) => {
    try {
      const event = await Event.findOne({ where: filter });
      if (!event) throw new Error("Event not found");
      await event.destroy();
      return event;
    } catch (error: any) {
      throw new Error(`Error deleting Event: ${error.message}`);
    }
  },

  deleteMany: async (filter: any) => {
    try {
      const affectedRows = await Event.destroy({ where: filter });
      return { affectedRows };
    } catch (error: any) {
      throw new Error(`Error deleting Events: ${error.message}`);
    }
  },

  getOne: async (filter: Record<string, any>, projection: any = null, include: boolean = false) => {
    try {
      const event = await Event.findOne({
        where: filter,
        attributes: projection,
        include: include ? [
          { model: Wallet, as: 'wallet' },
        ] : [],
      });
      return event;
    } catch (error: any) {
      throw new Error(`Error fetching Event: ${error.message}`);
    }
  },
  

  getMany: async (filter: any, projection: any = null, options: any = null, order?:any) => {
    try {
      const events = await Event.findAll({
        where: filter,
        attributes: projection ? projection : null,
        ...options,
        order: order ? order : []
      });
      return events;
    } catch (error: any) {
      throw new Error(`Error fetching Events: ${error.message}`);
    }
  },
  
};

export default {
  eventRepositories,
};
