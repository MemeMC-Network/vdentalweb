// POST { content } (protected) -> commits content.json to repository
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

function unauthorized(res){res.status(401).json({error:'unauthorized'});}

module.exports = async (req,res)=>{
  if(req.method !== 'POST') return res.status(405).send('Method not allowed');
  try{
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ','');
    const JWT_SECRET = process.env.JWT_SECRET;
    if(!token || !JWT_SECRET) return unauthorized(res);
    try{ jwt.verify(token, JWT_SECRET); }catch(e){return unauthorized(res);}    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; const REPO_OWNER = process.env.REPO_OWNER; const REPO_NAME = process.env.REPO_NAME;
    if(!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) return res.status(500).json({error:'Server not configured'});
    const content = req.body && req.body.content;
    if(!content) return res.status(400).json({error:'Missing content'});

    // get current file sha
    const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content.json`;
    const getRes = await fetch(getUrl,{headers:{Authorization:`token ${GITHUB_TOKEN}`,Accept:'application/vnd.github.v3+json'}});
    if(!getRes.ok) return res.status(500).json({error:'Failed to fetch existing file'});
    const getJson = await getRes.json(); const sha = getJson.sha;

    const putRes = await fetch(getUrl,{method:'PUT',headers:{Authorization:`token ${GITHUB_TOKEN}`,Accept:'application/vnd.github.v3+json','content-type':'application/json'},body:JSON.stringify({message:'Update content.json via admin',content:Buffer.from(JSON.stringify(content,null,2)).toString('base64'),sha})});
    if(!putRes.ok){const txt=await putRes.text();return res.status(500).json({error:'Failed to update',details:txt});}
    const j = await putRes.json(); return res.json({ok:true,commit:j.commit.sha});
  }catch(e){console.error(e);res.status(500).json({error:'Server error'})}
};
