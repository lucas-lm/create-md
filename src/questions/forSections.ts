const message = `Select sections you want in your md.
Press [Space bar] to select and [Enter] to submit your selection.
`

const forSections = (sections: string[]) => ({
  type: 'multiselect',
  name: 'selectedSections',
  message,
  choices: sections
})

export default forSections
