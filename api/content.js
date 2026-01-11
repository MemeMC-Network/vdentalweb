// GET -> returns parsed content.json from the repository via GitHub API or local file fallback
const fetch = require('node-fetch');
module.exports = async (req,res)=>{
  if(req.method !== 'GET') return res.status(405).send('Method not allowed');
  try{
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    if(GITHUB_TOKEN && REPO_OWNER && REPO_NAME){
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content.json`;
      const r = await fetch(url,{headers:{Authorization:`token ${GITHUB_TOKEN}`,Accept:'application/vnd.github.v3.raw'}});
      if(r.ok){ const json = await r.json(); return res.json(json); }
      // fallback to raw
    }
    // fallback to reading local file bundled with deployment
    const data = require('../content.json');
    return res.json(data);
  }catch(e){console.error(e);res.status(500).json({error:'Unable to load content'})}
};
