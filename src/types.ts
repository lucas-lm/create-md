// export types

import { PackageJSON } from "gluegun/build/types/toolbox/meta-types";

export interface Author {
  name: string
  email?: string
  url?: string
}

export interface Repo {
  url: string
  type?: string
}

export interface Requirements {
  node?: string
  npm?: string
  yarn?: string
  [key: string]: string
}

export interface Scripts {
  dev?: string
  test?: string
  start?: string
  build?: string
  [key: string]: string
}

export interface GitHub {
  username: string
  repo_name?: string
}

export interface ProjectData {
  name?: string
  description?: string
  author?: Author
  contributors?: Author[]
  repo?: Repo
  version?: string
  license?: string
  requirements?: Requirements | null
  scripts?: Scripts | null
  github?: GitHub | null
}

export interface PackageData extends PackageJSON {
  'create-md': ProjectData
}
