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


  router.post('/set', async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data)
      // Проверка наличия обязательного поля data
      if (!data) {
        return res.status(400).json({ error: 'Missing data field' });
      }
  
      // Удаление существующей директории
      await Directory.deleteOne({});

    // Создание и сохранение новой директории
    const newDirectory = new Directory();

    // Сохранение значений из req.body в схему
    newDirectory.rooms = data.rooms.default;
    newDirectory.elements = data.elements.default;
    newDirectory.otdelka = data.otdelka.default;
    newDirectory.defects = data.defects.default;
    newDirectory.subdefects = data.subdefects.default;

    // Сохранение новой директории
    await newDirectory.save();


    return res.json(newDirectory);
    } catch (error) {
      console.error('Error updating directory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports=router
  