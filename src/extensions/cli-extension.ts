import { GluegunToolbox } from 'gluegun'

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

  toolbox.selectSections = async (sections: string[]) => {
    const { prompt } = toolbox
    const message = `Select sections you want in your md.
    Press [Space bar] to select and [Enter] to submit your selection.
    `

    const selectSections = await prompt.ask([{
      type: 'multiselect',
      name: 'selectedSections',
      message,
      choices: sections
    }])

    return selectSections
  }

}
