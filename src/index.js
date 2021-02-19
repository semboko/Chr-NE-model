import { SVG } from "@svgdotjs/svg.js";
import { gamma, normal, uniform } from "jstat";

// The size of the nucleus in px
const NUC_DIAMETER = 800
const NUC_RADIUS = NUC_DIAMETER/2
const PADDING = [20, 20]

// The number of Lamin B molecules
const N_LAMINS = 1000

// Varies from 0 to 1, where 0 means that all Lamin molecules are strictly
// attached to the nuclear envelope and 1 means that Lamin B molecules are
// uniformelly dispersed throughout the radius. 
const LAMIN_RADIAL_DENSITY = 0.80

// The length of the chromatin fiber (the number of random-walk steps)
const CHROMATIN_STEPS = 2000

// The beta-parameter for the β-distribution, from which the radial coordinate of 
// each random-walk step is sampled. It directly affects the radial distribution of chromatin. 
// Taken from practice:
// the value of ~0.16 corresponds to a normal nucleus (the fiber is 'attracted' by the nuclear envelope)
// the value of ~0.25 is closer to a mutant one (the radial density becomes more uniform)
const CHROMATIN_BETA = 0.28

const CHROMATIN_COLOR = "#006699"
const LAMIN_COLOR = "green"

let draw = SVG()
    .addTo('body')
    .size(NUC_DIAMETER + 2*PADDING[0], 
        NUC_DIAMETER + 2*PADDING[1])

draw.circle(NUC_DIAMETER)
    .move(PADDING[0], PADDING[1])
    .attr({
        fill: '#e6f3ff', 
        stroke:'grey', 
        'stroke-width': '1'
    })

let rwStep = function (prev_r, prev_alpha) {
    // The ideal kurtosis is 1.8
    // The ideal beta = 16% of variancee
    const new_r = NUC_RADIUS - 
        gamma.sample(Math.sqrt(2/1.8), CHROMATIN_BETA*NUC_RADIUS)
    
    const new_alpha = normal.sample(prev_alpha + Math.PI/256, Math.PI/8)

    // TODO: Make sure that the radial distance from the previous point 
    // to the new one is not bigger than MAX_RW_DISTANCE

    return [new_r, new_alpha]
}

let polarToCartesian = function(r, alpha){
    if (r < 0){
        r = 30
    }
    
    const x = r * Math.sin(alpha)
    const y = r * Math.cos(alpha)
    return [x, y]
}

// Set initial values in polar coordinates
let i_r = NUC_RADIUS
let i_alpha = 0

// Create an array of chromatin line
let chromatin_array = []
let chromatin = draw.polyline(chromatin_array)
    .stroke(CHROMATIN_COLOR)
    .fill('transparent')

// Iterate over steps
for (let i = 0; i < CHROMATIN_STEPS;  i++) {
    let new_coordinates = rwStep(i_r, i_alpha)

    chromatin_array.push(
        polarToCartesian(
            new_coordinates[0], 
            new_coordinates[1]))
    
    i_r = new_coordinates[0]
    i_alpha = new_coordinates[1]
}

chromatin
.plot(chromatin_array)
.move(PADDING[0], PADDING[1])


// Draw lamin

const LAM_THICKNESS = LAMIN_RADIAL_DENSITY * NUC_RADIUS
const LAM_LENGTH = 50 // Total length of the moleque
const LAM_HEIGHT = 10 // Total height of the moleque

// Generate a new single Lamin B moleque. The moleque is a wave-shaped line.
let laminMoleque = function(){
    
    // Polar coordinates of a new moleque
    const alpha = uniform.sample(0, 2*Math.PI) + Math.PI/2
    const r = uniform.sample(NUC_RADIUS, NUC_RADIUS - LAM_THICKNESS)    

    // Calculate the x,y cartesian coordinates for the c0 of the moleque
    // c0 is a center of the wave-shape moleque
    
    const c0 = [
        r * Math.cos(alpha) + NUC_RADIUS + PADDING[0],
        r * Math.sin(alpha) + NUC_RADIUS + PADDING[1]
    ]

    const rotation = alpha + Math.PI / 2

    // Calculate 'Move To' x, y positions (start point)
    const M = [
        c0[0] - LAM_LENGTH * Math.cos(rotation) / 2, 
        c0[1] - LAM_LENGTH * Math.sin(rotation) / 2
    ]    

    // The polar angle coordinate for the curve
    const beta = Math.atan(LAM_HEIGHT/(LAM_LENGTH/4))

    // Calculate the Bezier curve
    // https://docs.google.com/drawings/d/1Yfvs578IFAnw-35fuUSb_J-LP2c-o_p9ZNOh6xQfVVQ/edit?usp=sharing
    const Q = [
        c0[0] - Math.cos(rotation + beta) * 
            (LAM_LENGTH / 4) * Math.cos(beta),
        c0[1] - Math.sin(rotation + beta) * 
            (LAM_LENGTH / 4) * Math.cos(beta)
    ]

    console.log(Q);
    

    // Calculate the coordinates of the end point
    const E = [
        c0[0] + LAM_LENGTH * 
            Math.cos(rotation) / 2,
        c0[1] + LAM_LENGTH * 
            Math.sin(rotation) / 2
    ]

    draw
    .path(['M', M[0], M[1], 'Q', Q[0], Q[1], c0[0], c0[1], 'T', E[0], E[1]]) 
    .attr({'stroke-width': 1, 'stroke': LAMIN_COLOR, 'fill': 'transparent'})
    .plot()    
    
}

for (let i = 0; i < N_LAMINS; i++) {
    laminMoleque()  
}
