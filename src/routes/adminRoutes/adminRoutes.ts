import express from 'express';
import { joiValidators } from '../../validations';
import { generalAuthFunction } from '../../middlewares/authorization.middleware';
import { adminController } from '../../controllers';

const router = express.Router();


router.get('/dyte-meetings', adminController.allDyteMeetings)






export default router;