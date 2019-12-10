import * as express from "express"
import {resolve, join} from 'path'
const port = process.env.APP_PORT || '80';
const app = express()
const staticPath = resolve(join('.', '.temp', 'pack'))
console.log(`serving static assets from ${staticPath}`)
app.use('/', express.static(staticPath))
app.listen(port, () => console.log(`local server running on ${port}`))