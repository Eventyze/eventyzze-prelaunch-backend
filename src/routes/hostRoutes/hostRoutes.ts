import express from 'express';
import { joiValidators } from '../../validations';
import { generalAuthFunction, rolePermit } from '../../middlewares/authorization.middleware';
import { hostController } from '../../controllers';
import { cloudinaryUpload } from '../../utilities';
import { Roles } from '../../types/modelTypes';

const router = express.Router();


//Shop Routes
router.get('/get-all-hosts', hostController.allHosts)
router.post('/create-event', generalAuthFunction, cloudinaryUpload, hostController.hostCreatesEvent)

export default router;