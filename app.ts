import express from 'express'
const app = express();

// your beautiful code...

app.get('/',(req, res)=>{
    res.send('Cry me a river')
})

if (import.meta.env.PROD)
  app.listen(3000);

export const viteNodeApp = app;