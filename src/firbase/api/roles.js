const express = require('express');
const { assignRole } = require('../functions/assignRoles');
const router = express.Router();

router.post('/assign-role', async (req, res) => {
  const { uid, role } = req.body;
  try {
    const response = await assignRole(uid, role);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
