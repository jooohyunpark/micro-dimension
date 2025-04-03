const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  pixelsPerInch: 300,
  units: "in",
  dimensions: [32, 32],
};

let sketchFn = generateSketch(); // Initial sketch function

function generateSketch() {
  const count = 2000;
  const thickness = 1 * 0.03;
  const alpha = 0.1;

  const seedCount = [random.rangeFloor(1, 4), random.rangeFloor(1, 4)];
  const controlCount = random.rangeFloor(2, 5);
  const points = [];
  const controls = [];
  const seeds_x = [];
  const seeds_y = [];
  const thresold = 1 / 20;
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // Set seed coordinates
  for (let h = 0; h < seedCount[0]; h++) {
    seeds_x.push(random.range(thresold, 1 - thresold));
  }
  for (let h = 0; h < seedCount[1]; h++) {
    seeds_y.push(random.range(thresold, 1 - thresold));
  }

  // Iterate points
  for (let i = 0; i < count; i++) {
    let x = random.pick(seeds_x) + random.gaussian() * 0.03;
    let y = random.pick(seeds_y) + random.gaussian() * 0.03;
    points.push([x, y]);
  }

  // Set control points
  for (let j = 0; j < controlCount; j++) {
    controls.push([random.range(0, 1), random.range(0, 1)]);
  }

  // Return draw function
  return ({ context, width, height }) => {
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    points.forEach((point) => {
      context.beginPath();

      const y0 = lerp(0, height, point[0]);
      const y1 = lerp(0, height, point[1]);

      const m = width / 10;
      const n = height / 10;

      let control0 = random.pick(controls);
      let control1 = random.pick(controls);

      let xControl0 = lerp(m, width - m, control0[0]);
      let yControl0 = lerp(n, height - n, control0[1]);
      let xControl1 = lerp(m, width - m, control1[0]);
      let yControl1 = lerp(n, height - n, control1[1]);

      context.moveTo(0, y0);
      context.bezierCurveTo(
        xControl0,
        yControl0,
        xControl1,
        yControl1,
        width,
        y1
      );

      context.lineWidth = thickness;
      context.strokeStyle = random.chance(0.08) ? color : "#ffffff";
      context.globalAlpha = alpha;
      context.stroke();
    });
  };
}

let manager;

canvasSketch(() => {
  return (props) => {
    sketchFn(props);
  };
}, settings).then((m) => {
  manager = m;

  const regenerate = () => {
    random.setSeed();
    sketchFn = generateSketch();
    manager.render();
  };

  window.addEventListener("click", regenerate);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      e.preventDefault();
      regenerate();
    }
  });
});
