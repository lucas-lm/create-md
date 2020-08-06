import { GluegunCommand } from 'gluegun'
import { parse, resolve } from 'path'

interface Prop {
  name: string,
  default?: string
}

const command: GluegunCommand = {
  name: 'create-md',
  run: async toolbox => {
    const { print, prompt, template: {generate}, parameters, getTemplate, selectSections, filesystem } = toolbox
    
    const { first='readme', options } = parameters

    let { ext='.md', name=''} = options
    ext = ext[0] && ext[0] !== '.' ? `.${ext}` : ext

    const filename = name ? `${name}${ext}` : parse(`${first}${ext}`).base
    const target = `./${filename}` // output

    let pkg
    
    try {
      pkg = require(resolve(filesystem.cwd(), 'package.json'))
    } catch (error) {
      print.warning('!!!ATTENTION!!!')
      print.warning('No package.json found here. Answers inference will not be available!')
    }

    // get template info: props, sections...
    const templateInfo = getTemplate({name: first})
    if (templateInfo.isFlat) {
      const questions = templateInfo.props.map((prop: string) => ({
        type: 'input',
        name: prop,
        message: prop
      }))
      const props = await prompt.ask(questions)
      return generate({ template: `${first}/index.ejs`, target, props })
      .then(() => {
        print.success(`DONE Created ${filename}`)
      })
      .catch(error => {
        if (error.message.match('template not found')) {
          print.error(`FAILED There is no template for ${first}`)
        } else {
          throw error
        }
      })
    }

    // get selected sections from input
    let { selectedSections } = await selectSections(templateInfo.sections)
    if (!(selectedSections.length > 0)) selectedSections = templateInfo.defaultSections

    // for each section, get props from input
    const props = {}
    for (const section of selectedSections) {
      const sectionProps = templateInfo.props[section] // props of a section
      
      if (!sectionProps) continue // skip questionaire if no props needed
      if (sectionProps.includes('sections')) throw new Error('sections cannot be a prop')

      const questions = sectionProps.map((prop: Prop) => ({
        type: 'input',
        name: prop.name,
        message: `Section ${section} - ${prop.name}`,
        initial: () => {
          if (!prop.default || !pkg) return
          return prop.default
            .split('.')
            .reduce((prev, curr) => prev[curr], pkg)
        } 
      }))

      const { selectedSections, ...rest} = await prompt.ask(questions)
      props[section] = rest
    }

    props['sections'] = selectedSections
    props['template'] = first

    generate({ template: 'index.ejs', target, props })
      .then(() => {
        print.success(`DONE Created ${filename}`)
      })
      .catch(error => {
        if (error.message.match('template not found')) {
          print.error(`FAILED There is no template for ${first}`)
        } else {
          throw error
        }
      })
  }
}

module.exports = command
