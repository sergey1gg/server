const Router = require("express")
const router = new Router()
const Act = require('../models/Act');
const authMiddleware=require("../middlewares/auth.middleware")
const _ = require('lodash');
const { ObjectId } = require('mongoose').Types;
router.post('/newact',authMiddleware, async (req, res) => {
  try {
    const { number, FIO, address, category, checkdate } = req.body;
    console.log(req.body)
    const userId=req.user.id
    const newAct = new Act({
        date: new Date(),
        number: number,
        FIO: FIO,
        address: address,
        category: category,
        checkdate: checkdate,
        author: userId
    });
    await newAct.save();
    res.status(201).json({ message: 'Act created successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
});

router.get('/getallact', async (req, res) => {
  try {
    const acts = await Act.find().populate('author','username');
    res.send(acts);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
});


router.post('/setrooms/:id', async (req, res) => {
  const actId = req.params.id;
  const { name } = req.body;
  console.log(name)
  try {
    const act = await Act.findById(actId);
    name.forEach((roomName) => {
      act.rooms.push({ name: roomName, items: [] });
    });
    const room =await act.save();
    res.status(200).send(room.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error adding rooms');
  }
});


// роут для добавления предмета в комнату
router.post('/setotdelka/:id/:roomIndex/:elementIndex', async (req, res) => {
  const actId = req.params.id;
  const roomIndex = req.params.roomIndex;
  const elementIndex = req.params.elementIndex;
  const { name } = req.body;

  try {
    const act = await Act.findById(actId);
    name.forEach((otdelkaName) => {
      act.rooms[roomIndex].items[elementIndex].otdelka.push({ name: otdelkaName, troubles: [] });
    });
    const room=await act.save();
    res.status(200).send(room.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error adding otdelka to item');
  }
});

router.post('/settroubles/:id/:roomIndex/:elementIndex/:otdelkaIndex', async (req, res) => {
  const actId = req.params.id;
  const roomIndex = req.params.roomIndex;
  const elementIndex = req.params.elementIndex;
  const otdelkaIndex = req.params.otdelkaIndex;
  const { name } = req.body;

  try {
    const act = await Act.findById(actId);
    name.forEach((troubleName) => {
      act.rooms[roomIndex].items[elementIndex].otdelka[otdelkaIndex].troubles.push(troubleName);
    });
    const room=await act.save();
    res.status(200).send(room.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error adding troubles to otdelka');
  }
});

// роут для получения списка предметов в комнате
router.get('/acts/:id/rooms/:roomIndex', async (req, res) => {
  const actId = req.params.id;
  const roomIndex = req.params.roomIndex;

  try {
    const act = await Act.findById(actId);
    const room = act.rooms[roomIndex];
    res.status(200).send(`${roomIndex}: ${room.name} { ${room.items.join(', ')} }`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting room items');
  }
});
// получение акта по id
router.get('/rooms/:id/', async (req, res) => {
  const actId = req.params.id;
  const roomIndex = req.params.roomIndex;

  try {
    const act = await Act.findById(actId);
    const room = act
    res.status(200).send(room.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting room items');
  }
});

router.post('/deleteroom/:actId', async (req, res) => {
  const { actId } = req.params;
  const { index } = req.body;

  try {
    const act = await Act.findById(actId);
    const rooms = act.rooms;
    rooms.splice(index, 1); // удаляем комнату по индексу
    const room=await act.save();
    res.status(200).send(room.rooms); // отправляем обновленный массив комнат
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting room');
  }
});
router.post('/editroom/:id', async (req, res) => {
  const actId = req.params.id;
  const { index, name } = req.body;

  try {
    const act = await Act.findById(actId);
    const rooms = act.rooms;
    rooms[index].name = name;
    act.rooms = rooms;

    const room=await act.save();
    res.status(200).send(room.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error editing room item');
  }
});
// копия всего акта
router.post('/copyact/:id', async (req, res) => {
  const actId = req.params.id;

  try {
    // Найти исходный акт
    const sourceAct = await Act.findById(actId);

    // Глубокое копирование схемы акта с заменой идентификатора Mongo

    const newDoc = new Act(_.omit(sourceAct.toObject(), ['_id']));
    newDoc._id = new ObjectId(); // генерация нового _id
    // Сохранить скопированный акт
    await Act.create(newDoc);

    res.status(200).send('Act copied successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error copying act');
  }
});
// удалить акт
router.post('/deleteact/:actId', async (req, res) => {
  const { actId } = req.params;
  
  try {
    // Находим акт по его ID и удаляем его
    const deletedAct = await Act.findByIdAndRemove(actId);
    
    if (deletedAct) {
      res.status(200).send('Act deleted successfully');
    } else {
      res.status(404).send('Act not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting act');
  }
});

module.exports = router;