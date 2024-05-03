import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()


blogRouter.use("/*", (c,next)=>{
    next()
});

blogRouter.post('/', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.post.create({
    data:{
        title: body.title,
        content: body.content,
        authorId: "1"
    }
  })

    return c.json({
        id:blog.id
    })
  })
  
  blogRouter.put('/', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.post.update({
    where:{
        id:body.id
    },
    data:{
        title: body.title,
        content: body.content
    }
  })
    return c.json({
        id:blog.id
    })
  })
  
  blogRouter.get('/:id', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
  const blog = await prisma.post.findFirst({
    where:{
        id:body.id
    }
  })
    return c.json({
       blog
    })
}catch(e){
    c.status(411);
    return c.json({
        message: "Error while fetching blog"
    })
}
  })
  
  blogRouter.get('/bulk', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = prisma.post.findMany()
    return c.json({
        blogs
    })
  })