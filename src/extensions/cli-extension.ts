import { GluegunToolbox } from 'gluegun'
import * as path from 'path'
import { serializeProjectData } from "../toolbox";

interface Template {
  name: string
}

interface TemplateMetadata {
  sections: string[],
  defaultSections: string[],
  props: string[]
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.search = {
    here(file: string) {
      const { filesystem } = toolbox
      return filesystem.exists(filesystem.resolve(filesystem.cwd(), file))
    },

    forTemplate({name}: Template) {
      const { filesystem } = toolbox
      const templateDir = filesystem.resolve(__dirname, '..', 'templates', name)
      return filesystem.exists(templateDir) ? templateDir : null
    }
  }

  toolbox.extractData = {
    async fromTemplate(template: Template) {
      const { search } = toolbox

      const templateDir = search.forTemplate(template)
      if (!templateDir) throw new Error('Template not found')
      const templateMetadata = await import(templateDir) as TemplateMetadata
      return templateMetadata
    },

    async fromProject() {
      const { filesystem: { resolve } } = toolbox
      try {
        const pkg = await import(resolve('package.json'))
        return serializeProjectData(pkg)
      } catch (error) {
        return null
      }
    }
  }

  toolbox.parse = {
    fileExtension(extension?: string) {
      if (!extension) return ''
      return extension[0] && extension[0] !== '.' ? `.${extension}` : extension
    },

    fileBaseName(name: string) {
      return name.replace(/\\|\//g, '-')
    },

    fileName(name: string, extension?: string) {
      const { parse } = toolbox
      const baseName = parse.fileBaseName(name)
      const ext = parse.fileExtension(extension)
      return path.parse(`${baseName}${ext}`).base
    },

    dirName(dir: string) {
      const { filesystem: { resolve, homedir } } = toolbox
      if (dir.slice(0, 2) === '~/') return resolve(homedir(), dir.slice(2))
      return resolve(dir)
    }
  }

}
