import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../services/prisma'

export default async function createLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url: unknown = req.body.url

  if (typeof url !== 'string') {
    res.status(400)
    res.json({ message: 'url is a required field' })
    return
  }

  const exists = await prisma.link.count({ where: { url } })

  if (exists) {
    res.status(400)
    res.json({ message: 'Link already registered' })
    return
  }

  await prisma.link.create({ data: { title: '', url } })

  res.end()
}
