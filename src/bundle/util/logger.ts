export function log(message: string, color = '#945cff') {
  const style = `
    background: ${color};
    border-radius: 0.5em;
    color: white;
    font-weight: medium;
    padding: 2px 0.5em;
  `

  console.log(`%c${'Meteor'}%c ${message}`, style, '')
}
