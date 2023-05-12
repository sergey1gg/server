const Router = require("express")
const router = new Router()
const Act = require('../models/Act');

router.post('/setdefect/:id/:roomIndex/:elementIndex/:otdelkaIndex', async (req, res) => {
    const actId = req.params.id;
    const roomIndex = req.params.roomIndex;
    const elementIndex = req.params.elementIndex;
    const otdelkaIndex = req.params.otdelkaIndex;
    const { name} = req.body;
    try {
      const act = await Act.findById(actId);
      name.forEach((itemName) => {
        act.rooms[roomIndex].items[elementIndex].otdelka[otdelkaIndex].troubles.push({ name: itemName, subDefects:[] });
      });
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error adding item to room');
    }
  });
  
router.post('/deletedefect/:actId/:roomIndex/:elementIndex/:otdelkaIndex/:defectIndex', async (req, res) => {
    const actId = req.params.actId;
    const roomIndex=req.params.roomIndex
    const elementIndex = req.params.roomIndex;
    const otdelkaIndex = req.params.otdelkaIndex;
    const defectIndex = req.params.defectIndex

    try {
      const act = await Act.findById(actId);
      const rooms = act.rooms;
      rooms[roomIndex].items[elementIndex].otdelka[otdelkaIndex].troubles.splice(defectIndex, 1);
      const room=await act.save();
      res.status(200).send(room.rooms); // отправляем обновленный массив комнат
    } catch (error) {
      console.log(error);
      res.status(500).send('Error deleting room');
    }
  });
  router.post('/editdefect/:actId/:selectedRoom/:elementIndex/:otdelkaIndex/:defectIndex', async (req, res) => {
    const {actId, selectedRoom, elementIndex, otdelkaIndex, defectIndex} = req.params;
    const { name } = req.body;
    try {
      const act = await Act.findById(actId);
      const rooms = JSON.parse(JSON.stringify(act.rooms));
      rooms[selectedRoom].items[elementIndex].otdelka[otdelkaIndex].troubles[defectIndex].name = name;
      act.rooms = rooms;
  
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error editing room item');
    }
  });

 
module.exports=router