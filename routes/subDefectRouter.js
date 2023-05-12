const Router = require("express")
const router = new Router()
const Act = require('../models/Act');

router.post('/setsubdefect/:id/:roomIndex/:elementIndex/:otdelkaIndex/:defectIndex', async (req, res) => {
    const actId = req.params.id;
    const roomIndex = req.params.roomIndex;
    const elementIndex = req.params.elementIndex;
    const otdelkaIndex = req.params.otdelkaIndex;
    const defectIndex = req.params.defectIndex;
    const { name} = req.body;
    try {
      const act = await Act.findById(actId);
      name.forEach((itemName) => {
        act.rooms[roomIndex].items[elementIndex].otdelka[otdelkaIndex].troubles[defectIndex].subDefects.push({ name: itemName.name,comment:itemName.comment });
      });
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error adding item to room');
    }
  });
  
router.post('/deletesubdefect/:actId/:roomIndex/:elementIndex/:otdelkaIndex/:defectIndex/:subdefectIndex', async (req, res) => {
    const {actId,roomIndex, elementIndex, otdelkaIndex, defectIndex, subdefectIndex } = req.params

    try {
      const act = await Act.findById(actId);
      const rooms = act.rooms;
      rooms[roomIndex].items[elementIndex].otdelka[otdelkaIndex].troubles[defectIndex].subDefects.splice(subdefectIndex, 1);
      const room=await act.save();
      res.status(200).send(room.rooms); // отправляем обновленный массив комнат
    } catch (error) {
      console.log(error);
      res.status(500).send('Error deleting room');
    }
  });
  router.post('/editsubdefect/:actId/:selectedRoom/:elementIndex/:otdelkaIndex/:defectIndex/:subdefectIndex', async (req, res) => {
    const {actId, selectedRoom, elementIndex, otdelkaIndex, defectIndex, subdefectIndex} = req.params;
    const { name } = req.body;
    try {
      const act = await Act.findById(actId);
      const rooms = JSON.parse(JSON.stringify(act.rooms));
      rooms[selectedRoom].items[elementIndex].otdelka[otdelkaIndex].troubles[defectIndex].subDefects[subdefectIndex].name = name;
      act.rooms = rooms;
  
      const room=await act.save();
      res.status(200).send(room.rooms);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error editing room item');
    }
  });

 
module.exports=router