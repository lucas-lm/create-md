import { GluegunToolbox } from 'gluegun'

interface Template {
  name: string
}

interface TemplateMetadata {
  sections: string[],
  defaultSections: string[],
  props: string[]
}

// const getTemplateDir = (toolbox: GluegunToolbox, {name}: Template) => {
//   const { filesystem } = toolbox
//   const templateDir = filesystem.resolve(__dirname, '..', 'templates', name)
//   if (!filesystem.exists(templateDir)) throw new Error(`${name} is not a template`)
//   return templateDir
// }

// const getTemplateMetadata = (toolbox: GluegunToolbox, template: Template) => {
//   const templateDir = toolbox.search.forTemplate(template)
//   const metadata = require(templateDir) as TemplateMetadata
//   return metadata
// }

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.getTemplate = (template: Template) => {
    const meta = toolbox.extractData.fromTemplate(template)
    return meta
  }

  toolbox.search = {
    here(file: string) {
      const { filesystem } = toolbox
      return filesystem.exists(filesystem.resolve(filesystem.cwd(), file))
    },

    forData() {
      const { filesystem } = toolbox
      try {
        return require(filesystem.resolve(filesystem.cwd(), 'package.json'))
      } catch (error) {

        return null
      }
    },

    forTemplate({name}: Template) {
      const { filesystem } = toolbox
      const templateDir = filesystem.resolve(__dirname, '..', 'templates', name)
      return filesystem.exists(templateDir) ? templateDir : null
    }
  }

  toolbox.extractData = {
    fromTemplate(template: Template) {
      const { search } = toolbox

      const templateDir = search.forTemplate(template)
      if (!templateDir) throw new Error('Template not found')
      const templateMetadata = require(templateDir) as TemplateMetadata
      return templateMetadata
    }
  }

}
