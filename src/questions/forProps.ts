interface Prop {
  name: string,
  default?: string,
  description?: string
}

// pkg: object from package.json // TODO: type pkg

const forProps = (props: Prop[], pkg: any, section?: string) => {
  const sectionLabel = section ? `Section ${section}` : ''
  
  const questions = props.map((prop) => ({
    type: 'input',
    name: prop.name,
    message: `${sectionLabel} - ${prop.description || prop.name}`,
    initial: () => {
      if (!prop.default || !pkg) return
      return prop.default
        .split('.')
        .reduce((prev, curr) => prev[curr], pkg)
    } 
  }))

  return questions
}

export default forProps
