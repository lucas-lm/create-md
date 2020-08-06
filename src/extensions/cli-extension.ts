import { GluegunToolbox, print } from 'gluegun'
import { parse } from 'path'

interface Template {
  type: string,
  name: string
}

interface TemplateMetadata {
  sections: string[],
  defaultSections: string[],
  props: string[]
}

const getTemplateDir = (toolbox: GluegunToolbox, {type, name}: Template) => {
  const { filesystem } = toolbox
  const templateDir = filesystem.resolve(__dirname, '..', 'templates', type, name)
  if (!filesystem.exists(templateDir)) throw new Error(`${type} is not a template type`)
  return templateDir
}

const getSections = ( toolbox: GluegunToolbox, template: Template ) => {
  const { filesystem } = toolbox

  const templateDir = getTemplateDir(toolbox, template)

  return filesystem
    .list(templateDir)
    .map(file => parse(file))
    .filter(({ name, ext }) => ext === '.ejs' && name !== 'index')
    .map(({ name }) => name)
}

const getTemplateMetadata = (toolbox: GluegunToolbox, template: Template) => {
  const templateDir = getTemplateDir(toolbox, template)
  const metadata = require(templateDir) as TemplateMetadata
  return metadata
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.getTemplate = (template: Template) => {
    const sections = getSections(toolbox, template)
    const meta = getTemplateMetadata(toolbox, template)
    print.debug(meta)
    return {sections, ...meta}
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

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "create-md" property),
  // create-md.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "create-md")
  // }
}
