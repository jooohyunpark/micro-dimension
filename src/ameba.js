const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    // exportPixelRatio: 3,
    // dimensions: [2000, 2000],
    pixelsPerInch: 300,
    units: 'in',
    dimensions: [16, 16]
};

const sketch = () => {
    let count = 10000;
    let alpha = 0.1;
    let data = [];
    let color = random.pick(['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00', '#0000ff']);

    for (let i = 0; i < count; i++) {
        data.push(
            {
                x: random.range(0, 1),
                y: random.range(0, 1),
                size: random.range(0, 0.2),
                angle: random.range(0, 2)
            }
        )
    }

    return ({ context, width, height }) => {
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        data.forEach(d => {
            context.beginPath();

            let margin = 0;
            let x = width * margin + d.x * (width * (1 - margin * 2));
            let y = height * margin + d.y * (height * (1 - margin * 2));

            context.arc(x, y, d.size, 0, 2 * Math.PI);

            context.fillStyle = '#fff';

            // context.fillStyle = random.chance(0.01) ? '#5200ff' : '#fff';
            context.globalAlpha = alpha;
            context.fill();
        })
    };
};

canvasSketch(sketch, settings);
