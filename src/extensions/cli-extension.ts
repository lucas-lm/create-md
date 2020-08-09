import { GluegunToolbox } from 'gluegun'
import { resolve } from 'path'

interface Template {
  name: string
}

interface TemplateMetadata {
  sections: string[],
  defaultSections: string[],
  props: string[]
}

const getTemplateDir = (toolbox: GluegunToolbox, {name}: Template) => {
  const { filesystem } = toolbox
  const templateDir = filesystem.resolve(__dirname, '..', 'templates', name)
  if (!filesystem.exists(templateDir)) throw new Error(`${name} is not a template`)
  return templateDir
}

const getTemplateMetadata = (toolbox: GluegunToolbox, template: Template) => {
  const templateDir = getTemplateDir(toolbox, template)
  const metadata = require(templateDir) as TemplateMetadata
  return metadata
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.getTemplate = (template: Template) => {
    const meta = getTemplateMetadata(toolbox, template)
    return meta
  }

  toolbox.search = {
    here(file: string) {
      const { filesystem } = toolbox
      return filesystem.exists(resolve(filesystem.cwd(), file))
    },

    forData() {
      const { filesystem, print } = toolbox
      try {
        return require(resolve(filesystem.cwd(), 'package.json'))
      } catch (error) {
        print.warning('!!!ATTENTION!!!')
        print.warning('No package.json found here. Answers inference will not be available!')
        return null
      }
    }
  }

}
