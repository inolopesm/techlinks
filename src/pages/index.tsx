import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FormEventHandler, useState } from 'react'
import prisma, { Prisma } from '../services/prisma'
import { formatList } from '../utils/intl'
import { Unpacked } from '../utils/types'

const getApprovedLinks = () =>
  prisma.link.findMany({
    include: { tags: true },
    where: { approved: true },
    orderBy: { id: 'desc' },
  })

type ApprovedLinks = Prisma.PromiseReturnType<typeof getApprovedLinks>
type ApprovedLink = Unpacked<ApprovedLinks>
type Tag = Unpacked<ApprovedLink['tags']>

// Why serialize? Because this error:
// SerializableError: Error serializing `.approvedLinks[0].createdAt` returned from `getServerSideProps` in "/".

type SerializedTag = Omit<Tag, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

type SerializedApprovedLink = Omit<
  ApprovedLink,
  'createdAt' | 'updatedAt' | 'tags'
> & {
  createdAt: string
  updatedAt: string
  tags: SerializedTag[]
}

interface IndexProps {
  links: SerializedApprovedLink[]
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const approvedLinks = await getApprovedLinks()

  const serializedApprovedLinks: SerializedApprovedLink[] =
    approvedLinks.map<SerializedApprovedLink>((link) => ({
      ...link,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.createdAt.toISOString(),
      tags: link.tags.map<SerializedTag>((tag) => ({
        ...tag,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.createdAt.toISOString(),
      })),
    }))

  return { props: { links: serializedApprovedLinks } }
}

export default function Index({ links }: IndexProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/createLink', { url })

      window.alert(
        'Pronto! Seu link foi enviado, agora passará pelo filtro da administração e se for relacionado a tecnologia será aprovado!'
      )
    } catch (reason) {
      window.alert(
        axios.isAxiosError(reason) && reason.response?.data.message
          ? reason.response.data.message
          : String(reason)
      )
    } finally {
      setUrl('')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Tech Links</title>
      </Head>

      <div className="container">
        <h1 className="mt-5">Tech Links</h1>
        <p className="mb-5">Links de coisas relacionadas a tecnologia</p>

        <h2 className="mb-3">Envie seu link!</h2>

        <form onSubmit={handleSubmit} className="input-group mb-5">
          <label htmlFor="url" className="input-group-text">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            maxLength={255}
            disabled={loading}
            className="form-control"
            required
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            Enviar
          </button>
        </form>

        <h2 className="mb-3">Últimos links aprovados</h2>

        <table className="table mb-5">
          <thead>
            <tr>
              <th>URL</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.title}
                  </a>
                </td>
                <td>{formatList(link.tags.map((tag) => tag.name))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pb-3">
          <a
            href="https://github.com/inolopesm/tech-links"
            target="_blank"
            rel="noreferrer"
          >
            Projeto no GitHub
          </a>
        </div>
      </div>
    </>
  )
}
