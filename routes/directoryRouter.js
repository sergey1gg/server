const Router = require("express")
const router = new Router()
const Directory=require("../models/Directory")
router.get('/get', async (req, res) => {
    try {
      const directory = await Directory.findOne({});
      
      if (!directory) {
        return res.status(404).json({ error: 'Directory not found' });
      } 
      // Если поле отсутствует, вернуть всю директорию
      return res.json(directory);
    } catch (error) {
      console.error('Error fetching directory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports=router
  