import { Router } from 'express';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClient).put(updateClient).delete(deleteClient);

export default router; 