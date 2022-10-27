import Head from 'next/head'
import { FormEventHandler, useEffect, useState } from 'react'

interface Tag {
  id: number
  name: string
}

interface Link {
  id: number
  title: string
  url: string
  approved: boolean
  tags: Tag[]
}

const getApprovedLinks = async (): Promise<Link[]> => [
  {
    id: 1,
    title: 'Rant: Projetos, TESTES e Estimativa??? | Rated-R - YouTube',
    url: 'https://www.youtube.com/watch?v=H_-7o_pLn1s',
    approved: true,
    tags: [
      { id: 1, name: 'Video' },
      { id: 2, name: 'YouTube' },
    ],
  },
  {
    id: 2,
    title: 'Design Patterns na prática. Tudo que você precisa saber',
    url: 'https://www.youtube.com/watch?v=kE8H6-z6x_8',
    approved: true,
    tags: [{ id: 1, name: 'Video' }],
  },
]

const formatList = (values: string[]) =>
  new Intl.ListFormat('pt-BR').format(values)

export default function Index() {
  const [url, setUrl] = useState('')
  const [approvedLinks, setApprovedLinks] = useState<Link[]>([])

  useEffect(() => {
    getApprovedLinks()
      .then((value) => setApprovedLinks(value))
      .catch((reason) => window.alert(String(reason)))
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <Head>
        <title>Tech Links</title>
      </Head>
      <h1>Tech Links</h1>
      <h2>Envie seu link!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">URL</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          maxLength={255}
          required
        />
        <button type="submit">Search</button>
      </form>
      <h2>Links enviados</h2>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Tags</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {approvedLinks.map((approvedLink) => (
            <tr key={approvedLink.id}>
              <td>{approvedLink.title}</td>
              <td>{formatList(approvedLink.tags.map((tag) => tag.name))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
