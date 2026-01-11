// POST { user, pass }  -> { token }
const jwt = require('jsonwebtoken');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  try{
    const { user, pass } = req.body || {};
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!ADMIN_USER || !ADMIN_PASSWORD || !JWT_SECRET) return res.status(500).json({error:'Server not configured'});
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
      const token = jwt.sign({user}, JWT_SECRET, {expiresIn: '4h'});
      return res.json({token});
    }
    return res.status(401).json({error:'Invalid credentials'});
  }catch(e){console.error(e);res.status(500).json({error:'Server error'})}
};
