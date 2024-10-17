// const express = require('express');
// const router = express.Router();
// const jobsController = require('../controllers/jobsController');
// router.route("/").get(jobsController.indexPage);
// router.get("/jobs", jobsController.getAllJobs);
// router.post('/jobs', jobsController.addJob);
// router.get("/jobs/new", jobsController.showNewJobForm);
// router.get("/jobs/edit/:id", jobsController.showEditJobForm);
// router.post("/jobs/update/:id", jobsController.updateJob);
// router.post("/jobs/delete/:id", jobsController.deleteJob);
// module.exports = router;
const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs');
router.get("/", jobsController.getAllJobs);
router.post('/', jobsController.addJob);
router.get("/new", jobsController.showNewJobForm);
router.get("/edit/:id", jobsController.showEditJobForm);
router.post("/update/:id", jobsController.updateJob);
router.post("/delete/:id", jobsController.deleteJob);
module.exports = router;