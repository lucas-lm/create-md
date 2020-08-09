import { GluegunCommand, GluegunToolbox } from 'gluegun'
import { forSections, forProps } from "../questions";
import * as path from 'path'

/**
 * --- Process ---
 * 1. Confirm overwrites if needed
 * 2. Set name, extension and output directory path
 * 3. Search for project info
 * 4. Build questions based on given template 
 * 5. Ask user questions
 * 6. Generate final file
 *
 */

 interface TContext extends GluegunToolbox {
  search: {
    here: (file: string) => Boolean
    forData: () => any
    forTemplate: (template: any) => any
  },
  extractData: {
    fromTemplate: (template: any) => any
  },
  parse: {
    fileExtension: (string) => string
  }
 }

const command: GluegunCommand<TContext> = {
  name: 'create-md',
  run: async toolbox => {
    const { print, prompt, template: {generate}, parameters, search, extractData, parse } = toolbox
    
    const { first='readme', options } = parameters
    
    let { ext='.md', name=''} = options
    ext = parse.fileExtension(ext)
    
    const filename = name ? `${name}${ext}` : path.parse(`${first}${ext}`).base
    const target = `./${filename}` // output
    // if (search.here(target)) {
    //   const wantOverwrite = await prompt.confirm('Overwrite?', false)
    //   if (!wantOverwrite) return
    // } 
    
    const pkg = search.forData()

    // get template info: props, sections...
    const templateInfo = extractData.fromTemplate({name: first})
    if (templateInfo.isFlat) {

      const questions = forProps(templateInfo.props, pkg)
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
    let { selectedSections } = await prompt.ask(forSections(templateInfo.sections))
    if (!(selectedSections.length > 0)) selectedSections = templateInfo.defaultSections

    // for each section, get props from input
    const props = {}
    for (const section of selectedSections) {
      const sectionProps = templateInfo.props[section] // props of a section
      
      if (!sectionProps) continue // skip questionaire if no props needed
      if (sectionProps.includes('sections')) throw new Error('sections cannot be a prop')

      const questions = forProps(sectionProps, pkg, section)

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
