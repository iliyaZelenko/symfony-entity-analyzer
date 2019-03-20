console.log(window.entity)

const nodesData = window.entity.map((i, index) => {
  const table = i.tableAnnotationArguments.find(i => i.name === 'name').value

  return {
    id: i.fullNamespace, // index + 1,
    label: `${i.className} (${table})`,
    shape: 'box',
    color: stringToColor(i.fullNamespace),
    font: {
      size: 18
    },
    title: getTitleByNode(i)
  }
})
const nodes = new vis.DataSet(nodesData)
const edgesData = []

window.entity.forEach(i => {
  let selfRefCount = 0

  i.relations.forEach((rel, index) => {
    const strokeColorByType = {
      manyToOne: 'red',
      oneToMany: 'blue',
      oneToOne: 'grey',
      manyToMany: 'green'
    }

    edgesData.push({
      selfReferenceSize: 20 + selfRefCount * 25,
      from: i.fullNamespace,
      to: rel.entity,
      arrows: rel.type === 'manyToMany' ? 'to, from' : 'to',
      label: `${rel.type} (${rel.property})`,
      length: 700,
      dashes: i.fullNamespace === rel.entity,
      font: {
        align: 'middle',
        size: 14,
        color: strokeColorByType[rel.type]
      },
      color: stringToColor(i.fullNamespace)
    })

    if (i.fullNamespace === rel.entity) selfRefCount++
  })
})
const edges = new vis.DataSet(edgesData)
console.log(123, edgesData)
// create an array with edges
// const edges = new vis.DataSet([
//   // { from: 1, to: 8, arrows: 'to', dashes: true, label: '1-8', font: { align: 'middle' } },
//   // { from: 1, to: 3, arrows: 'to' },
//   { from: 1, to: 2, arrows: 'to, from', label: 'One to One', length: 500 },
//   // , font: { align: 'middle' }
//   { from: 2, to: 1, arrows: 'to', dashes: true, label: 'One to Many', length: 500 },
//   // { from: 2, to: 4, arrows: 'to, middle', value: 3 },
//   // { from: 2, to: 5, arrows: 'to, middle, from' },
//   // { from: 5, to: 6, arrows: { to: { scaleFactor: 2 } } },
//   // { from: 6, to: 7, arrows: { middle: { scaleFactor: 0.5 }, from: true } }
// ])

// create a network
const container = document.querySelector('#network')
const data = {
  nodes: nodes,
  edges: edges
}
const options = {
  layout: {
    // randomSeed: 3,
    // hierarchical: {
    //   direction: 'LR'
    //   // sortMethod: 'hubsize'
    // }
  },
  physics: {
    // enabled: false
  },
  nodes: {
    // padding: 500,
    margin: 5,
    // scaling: {
    //   customScalingFunction (min, max, total, value) {
    //     return value / total
    //   },
    //   min: 5,
    //   max: 150
    // }
  },
  edges: {
    smooth: {
      type: 'straightCross'
    },
    // selfReferenceSize: 50,
    arrows: {
      to: {
        scaleFactor: 1.2
      },
      from: {
        scaleFactor: 1.2
      }
    }
  }
}
const network = new vis.Network(container, data, options)

function getTitleByNode (node) {
  const repo = node.entityAnnotationArguments.find(i => i.name === 'repositoryClass').value
  const selfRefRelations = node.relations.filter(rel => node.fullNamespace === rel.entity)

  return `
    <b>Repository</b>: ${repo}<br>
    <b>Path</b>: ${node.path}<br>
    <b>Namespace</b>: ${node.fullNamespace}<br>
    <b>Total relations</b>: ${node.relations.length}<br>
    <b>Self-referential relationship</b>: [${selfRefRelations.length}]
    ${
      selfRefRelations.map(i => `${i.entity} (${i.name})`).join(', ')
    }
    <br>
    
    
  `
}

function stringToColor (str) {
  let hash = 0, colour = '#'

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).slice(-2)
  }
  return colour
}
