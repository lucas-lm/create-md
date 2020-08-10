// export types

interface Author {
  name: string
  email?: string
  url?: string
}

interface Repo {
  type: string
  url: string
}

interface ProjectData {
  name?: string
  version?: string
  author?: string | Author
  description?: string
  license?: string
  [key: string]: any
}

