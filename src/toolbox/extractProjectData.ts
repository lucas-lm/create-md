import { PackageData, Author, ProjectData, Repo, Requirements, Scripts } from "../types"

const serializeAuthor = (author: Author) => typeof author === 'string' ? { name: author } : author

const serializeRepo = (repo: Repo) => typeof repo === 'string' ? { url: repo } : repo

const getAuthor: (pkg: PackageData) => Author = pkg => {
  const { author='' } = pkg
  return serializeAuthor(author)
}

const getContributors: (pkg: PackageData) => Author[] = pkg => {
  const { contributors=[] } = pkg
  return contributors.map(contrib => serializeAuthor(contrib))
}

const getRepo: (pkg: PackageData) => Repo = pkg => {
  const { repository='' } = pkg
  return serializeRepo(repository)
}

export const serializeProjectData = (packageData: PackageData) => {
  
  const author = getAuthor(packageData)
  const contributors = getContributors(packageData)
  const repo = getRepo(packageData)
  const { engines: requirements = null }: Requirements = packageData
  const { scripts=null }: Scripts = packageData
  
  const overwrites: ProjectData = packageData['create-md']

  const serialized = {
    ...packageData,
    author,
    contributors,
    repo,
    requirements,
    scripts,
    ...overwrites
  }

  return serialized
} // Type ProjectData
// export...