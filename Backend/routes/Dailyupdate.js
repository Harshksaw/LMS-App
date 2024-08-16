const express = require("express");
const { getAllDailyUpdates, getDailyUpdate, createDailyUpdate, updateDailyUpdate, deleteDailyUpdate } = require("../controllers/DailyUpdate");
const router = express.Router();






router.get('/getAllUpdates',getAllDailyUpdates)
router.get('/getDailyUpdate/:id',getDailyUpdate)
router.post('/createDailyUpdate',createDailyUpdate)
router.post('/updateDailyUpdate/:id',updateDailyUpdate)
router.post('/DeleteUpdate/:id',deleteDailyUpdate)

module.exports = router;