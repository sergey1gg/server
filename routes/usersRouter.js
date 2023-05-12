const Router = require("express")
const router = new Router()
const User = require('../models/User');

router.get('/getuser', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;