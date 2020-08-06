import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'create-md',
  run: async toolbox => {
    // toolbox
    const { print, prompt, template: {generate}, parameters, getTemplate, selectSections } = toolbox
    
    // get types
    const { string: str } = parameters
    const types = (str || 'readme').split(' ')

    // for each type, get sections
    for (const type of types) {
      // get template info: sections, props
      const templateInfo = getTemplate({name: 'default', type})

      let { selectedSections } = await selectSections(templateInfo.sections)
      if (!(selectedSections.length > 0)) selectedSections = templateInfo.defaultSections
      // for each section, get props
      const props = {}
      for (const section of selectedSections) {
        const sectionProps = templateInfo.props[section]
        if (!sectionProps) continue
        if (sectionProps.includes('sections')) throw new Error('sections cannot be a prop name')
        const questions = sectionProps.map((prop: string) => ({
            type: 'input',
            name: prop,
            message: prop
          }))
        const { selectedSections, ...rest} = await prompt.ask(questions)
        props[section] = rest
      }

      props['sections'] = selectedSections

      const template = `${type}/default/index.ejs`
      const filename = `${type.toUpperCase()}.md`
      const target = `./${filename}`

      generate({ template, target, props })
        .then(() => {
          print.success(`DONE Created ${filename}`)
        })
        .catch(error => {
          if (error.message.match('template not found')) {
            print.error(`FAILED There is no template for ${type}`)
          } else {
            throw error
          }
        })
    }
  }
}

module.exports = command
