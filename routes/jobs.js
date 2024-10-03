const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs');

router.get('/', jobsController.getAllJobs);
router.post('/', jobsController.addJob);
router.get('/new', jobsController.showNewJobForm);
router.get('/edit/:id', jobsController.showEditJobForm);
router.post('/update/:id', jobsController.updateJob);
router.post('/delete/:id', jobsController.deleteJob);

module.exports = router;