import { GluegunCommand, GluegunToolbox } from 'gluegun'
import { forSections, forProps } from "../questions"
import { ProjectData } from '../types'

/**
 * --- Process Flow ---
 * 1. Try loading the template
 * 2. Parse and serialize output config
 * 3. Confirm overwrites if needed
 * 4. Try extracting project info
 * 4. Build questions based on given template 
 * 5. Ask user questions
 * 6. Generate final file
 *
 */

 interface TContext extends GluegunToolbox {
  search: {
    forTemplate: (template: any) => any
  },
  extractData: {
    fromTemplate: (template: any) => any
    fromProject: () => any
  },
  parse: {
    fileExtension: (extension: string) => string
    fileBaseName: (name: string) => string
    fileName: (name: string, extension?: string) => string
    dirName: (dir: string) => string
  }
 }

const command: GluegunCommand<TContext> = {
  name: 'create-md',
  run: async toolbox => {
    const { print, prompt, template: {generate}, parameters, extractData, parse, filesystem: { resolve, exists } } = toolbox
    const { first='readme', options } = parameters
    const { name, ext='.md', outDir='.' } = options

    const spinner = print.spin('Loading template')

    const templateInfo = await extractData.fromTemplate({name: first}) // get template info: props, sections...
    if (!templateInfo) return spinner.fail(`ERROR ${first} is not a valid template`)
    else spinner.succeed('Template loaded successfully')
    
    const baseName = name || templateInfo.name
    const dirname = parse.dirName(outDir)
    const filename = parse.fileName(baseName, ext)
    const target = resolve(dirname, filename) // output file
    
    const alreadyExists = exists(resolve(target))
    
    if (alreadyExists && alreadyExists !== 'file') 
      return print.error(`ERROR: Name conflict. There is already something named ${filename} here`)

    if (alreadyExists === 'file') {
      print.warning(`WARNING: There is already a file named ${filename} in the output folder`)
      const wantOverwrite = await prompt.confirm(`Do you want to OVERWRITE ${filename} ??`, false)
      if (!wantOverwrite) return print.info('Hint: You can pass another file name in options: --name=foo')
    } 

    spinner.start('Collecting project information')
    const inferredProjectData: ProjectData = await extractData.fromProject()
    if (inferredProjectData) {
      spinner.succeed('Information collected successfully')
    } else {
      spinner.warn('Fail collecting project information. Predictions will not be available!')
      print.info('You may be running on a folder with no package.json')
      print.info('Learn more on https://github.com/lucas-lm/create-md')
    }
    // TODO: default questions and specific questions - will avoid repeat questions in modular templates

    if (templateInfo.isFlat) {
      const questions = forProps(templateInfo.props, inferredProjectData)
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

      const questions = forProps(sectionProps, inferredProjectData, section)

      const { selectedSections, ...rest} = await prompt.ask(questions)
      props[section] = rest
    }

    // append sections and template info to props
    props['sections'] = selectedSections
    props['template'] = first

    // Finally create the file
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
