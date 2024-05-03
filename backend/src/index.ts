import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';

const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: SignatureKey
  }
}>()

app.post('/api/v1/user/signup', async(c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try{
const user = await prisma.user.create({
  data: {
    email: body.email,
    password: body.password,
    name:body.name
  }
})
const jwt = await sign({
  id: user.id
}, c.env.JWT_SECRET)
return c.text(jwt) 
}catch(e){
  c.status(411);
  console.log(e)
  return c.json(e)
}
})

app.post('/api/v1/user/signin', async(c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try{
const user = await prisma.user.findFirst({
  where: {
    email: body.email,
    password: body.password,
  }
})
if(!user){
  c.status(403)
  return c.text("Invalid")
}
const jwt = await sign({
  id: user.id
}, c.env.JWT_SECRET)
return c.text(jwt) 
}catch(e){
  c.status(411);
  console.log(e)
  return c.json(e)
}
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})

export default app




