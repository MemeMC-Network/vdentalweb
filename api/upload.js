// POST { name, content } (protected) -> create file in assets/images/<timestamp>-name
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
module.exports = async (req,res)=>{
  if(req.method !== 'POST') return res.status(405).send('Method not allowed');
  try{
    const auth = req.headers.authorization || ''; const token = auth.replace('Bearer ','');
    const JWT_SECRET = process.env.JWT_SECRET; if(!token || !JWT_SECRET) return res.status(401).json({error:'unauthorized'});
    try{ jwt.verify(token, JWT_SECRET); }catch(e){return res.status(401).json({error:'unauthorized'})}
    const { name, content } = req.body || {};
    if(!name || !content) return res.status(400).json({error:'Missing name or content'});
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; const REPO_OWNER = process.env.REPO_OWNER; const REPO_NAME = process.env.REPO_NAME;
    if(!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) return res.status(500).json({error:'Server not configured'});
    const safe = Date.now() + '-' + name.replace(/[^a-z0-9\.\-_]/gi,'');
    const path = `assets/images/${safe}`;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}`;
    const putRes = await fetch(url,{method:'PUT',headers:{Authorization:`token ${GITHUB_TOKEN}`,Accept:'application/vnd.github.v3+json','content-type':'application/json'},body:JSON.stringify({message:'Upload image via admin',content,committer:{name:'vd-admin',email:'admin@example.com'}})});
    if(!putRes.ok){const txt=await putRes.text();return res.status(500).json({error:'Upload failed',details:txt});}
    const j=await putRes.json(); return res.json({ok:true,path:`/assets/images/${safe}`,commit:j.commit.sha});
  }catch(e){console.error(e);res.status(500).json({error:'Server error'})}
};
