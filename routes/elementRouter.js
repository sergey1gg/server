const Router = require("express")
const router = new Router()
const Act = require('../models/Act');

router.post('/setelements/:id/:roomIndex', async (req, res) => {
    const actId = req.params.id;
    const roomIndex = req.params.roomIndex;
    const { name, otdelka } = req.body;
  
    try {
      const act = await Act.findById(actId);
      name.forEach((itemName) => {
        act.rooms[roomIndex].items.push({ name: itemName, otdelka:[] });
      });
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error adding item to room');
    }
  });

router.post('/deleteelement/:actId/:roomIndex/:elementIndex', async (req, res) => {
    const actId = req.params.actId;
    const roomIndex=req.params.roomIndex
    const elementIndex = req.params.roomIndex;
    console.log(actId, roomIndex,elementIndex)
    try {
      const act = await Act.findById(actId);
      const rooms = act.rooms;
      rooms[roomIndex].items.splice(elementIndex, 1);
      const room=await act.save();
      res.status(200).send(room.rooms); // отправляем обновленный массив комнат
    } catch (error) {
      console.log(error);
      res.status(500).send('Error deleting room');
    }
  });
  router.post('/editelement/:actId/:selectedRoom/:elementIndex', async (req, res) => {
    const {actId, selectedRoom, elementIndex} = req.params;
    const { name } = req.body;
  
    try {
      const act = await Act.findById(actId);
      const rooms = JSON.parse(JSON.stringify(act.rooms));
      rooms[selectedRoom].items[elementIndex].name = name;
      act.rooms = rooms;
  
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error editing room item');
    }
  });

 
module.exports=router