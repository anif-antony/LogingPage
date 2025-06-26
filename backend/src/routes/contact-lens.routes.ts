import { Router } from 'express';
import {
  getContactLenses,
  getContactLens,
  createContactLens,
  updateContactLens,
  deleteContactLens,
} from '../controllers/contact-lens.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.route('/').get(getContactLenses).post(createContactLens);
router
  .route('/:id')
  .get(getContactLens)
  .put(updateContactLens)
  .delete(deleteContactLens);

export default router; 