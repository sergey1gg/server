const Router = require("express")
const router = new Router()
const Act = require('../models/Act');

router.post('/setotdelka/:id/:roomIndex/:elementIndex', async (req, res) => {
    const actId = req.params.id;
    const roomIndex = req.params.roomIndex;
    const elementIndex = req.params.elementIndex;
    const { name} = req.body;
  
    try {
      const act = await Act.findById(actId);
      name.forEach((itemName) => {
        act.rooms[roomIndex].items[elementIndex].otdelka.push({ name: itemName, troubles:[] });
      });
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error adding item to room');
    }
  });

router.post('/deleteotdelka/:actId/:roomIndex/:elementIndex/:otdelkaIndex', async (req, res) => {
    const actId = req.params.actId;
    const roomIndex=req.params.roomIndex
    const elementIndex = req.params.roomIndex;
    const otdelkaIndex = req.params.otdelkaIndex;

    try {
      const act = await Act.findById(actId);
      const rooms = act.rooms;
      rooms[roomIndex].items[elementIndex].otdelka.splice(otdelkaIndex, 1);
      const room=await act.save();
      res.status(200).send(room.rooms); // отправляем обновленный массив комнат
    } catch (error) {
      console.log(error);
      res.status(500).send('Error deleting room');
    }
  });
  router.post('/editotdelka/:actId/:selectedRoom/:elementIndex/:otdelkaIndex', async (req, res) => {
    const {actId, selectedRoom, elementIndex, otdelkaIndex} = req.params;
    const { name } = req.body;
    try {
      const act = await Act.findById(actId);
      const rooms = JSON.parse(JSON.stringify(act.rooms));
      rooms[selectedRoom].items[elementIndex].otdelka[otdelkaIndex].name = name;
      act.rooms = rooms;
  
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error editing room item');
    }
  });

 
module.exports=router