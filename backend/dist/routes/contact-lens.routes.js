"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_lens_controller_1 = require("../controllers/contact-lens.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.route('/').get(contact_lens_controller_1.getContactLenses).post(contact_lens_controller_1.createContactLens);
router
    .route('/:id')
    .get(contact_lens_controller_1.getContactLens)
    .put(contact_lens_controller_1.updateContactLens)
    .delete(contact_lens_controller_1.deleteContactLens);
exports.default = router;
