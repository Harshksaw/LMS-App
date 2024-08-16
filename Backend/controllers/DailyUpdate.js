const DailyUpdate = require('../models/DailyUpdate');


// Get all daily updates
exports.getAllDailyUpdates = async (req, res) => {
  try {
    const dailyUpdates = await DailyUpdate.find().sort({createdAt: -1});
    res.json(dailyUpdates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one daily update
exports.getDailyUpdate = async (req, res) => {
  try {
    const dailyUpdate = await DailyUpdate.findById(req.params.id);
    if (!dailyUpdate) return res.status(404).json({ message: 'Daily update not found' });
    res.json(dailyUpdate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new daily update
exports.createDailyUpdate = async (req, res) => {
  const dailyUpdate = new DailyUpdate({
    title: req.body.title,
    heading: req.body.heading,
    description: req.body.description,
    content: req.body.content,
    image: req.body.image,

  });

  try {
    const newDailyUpdate = await dailyUpdate.save();
    res.status(201).json(newDailyUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a daily update
exports.updateDailyUpdate = async (req, res) => {
  try {
    const dailyUpdate = await DailyUpdate.findById(req.params.id);
    if (!dailyUpdate) return res.status(401).json({ message: 'Daily update not found' });

    dailyUpdate.title = req.body.title || dailyUpdate.title;
    dailyUpdate.heading = req.body.heading || dailyUpdate.heading;
    dailyUpdate.description = req.body.description || dailyUpdate.description;
    dailyUpdate.content = req.body.content || dailyUpdate.content;
    dailyUpdate.image = req.body.image || dailyUpdate.image;
    dailyUpdate.date = req.body.date || dailyUpdate.date;

    const updatedDailyUpdate = await dailyUpdate.save();
    res.json(updatedDailyUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a daily update
exports.deleteDailyUpdate = async (req, res) => {
  try {
    const dailyUpdate = await DailyUpdate.findById(req.params.id);
    if (!dailyUpdate) return res.status(404).json({ message: 'Daily update not found' });

    await dailyUpdate.remove();
    res.json({ message: 'Daily update deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};