import {Sequelize} from 'sequelize';
import config from './config';


const {
    NEON
} = config

export const database = new Sequelize(`${NEON}`,
    {
        pool: {
          max: 5, // Maximum number of connections
          min: 0, // Minimum number of connections
          acquire: 30000, // Maximum time (ms) to try to get a connection
          idle: 10000, // Time (ms) a connection can be idle before being released
        },
    }
)



// let sequelize: Sequelize;

// export const getDatabase = () => {
//   if (!sequelize) {
//     sequelize = new Sequelize(`${NEON}`, {
//       pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//       },
//     });
//   }
//   return sequelize;
// };
