const canvas = document.querySelector("#canvas");
const resetButtn = document.querySelector(".reset");
const ctx = canvas.getContext("2d");
const pointA = document.querySelector("#pointA");
const pointB = document.querySelector("#pointB");
const pointC = document.querySelector("#pointC");
const pointD = document.querySelector("#pointD");
const intersectionsElement = document.querySelector("#intersections");
const pontRadius = 5;

let points = []; // массив для збереження точок
let draggingPoint = null;

function updateDisplay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.map((p) => drawPoint(p, "black"));

  if (points.length >= 2) {
    const A = points[0];
    const B = points[1];
    const radiusA = distance(A, B);
    drawCircle(A, radiusA, "blue");

    // A та B
    pointA.innerText = `A: (${A.x.toFixed()}, ${A.y.toFixed()})`;
    pointB.innerText = `B: (${B.x.toFixed()}, ${B.y.toFixed()})`;
  } else {
    // A та B
    pointA.innerText = `A: `;
    pointB.innerText = `B: `;
  }
  if (points.length >= 4) {
    canvas.classList.add("canvas-grab");
    const C = points[2];
    const D = points[3];
    const radiusC = distance(C, D);
    drawCircle(C, radiusC, "yellow");

    // C та D
    pointC.innerText = `C: (${C.x.toFixed()}, ${C.y.toFixed()})`;
    pointD.innerText = `D: (${D.x.toFixed()}, ${D.y.toFixed()})`;

    const A = points[0];
    const B = points[1];
    const radiusA = distance(A, B);
    const intersections = getCircleIntersections(A, radiusA, C, radiusC);
    if (intersections.length === 0) {
      intersectionsElement.innerText = `Intersections: empty`;
    } else if (intersections.length === 1) {
      const P = intersections[0];
      intersectionsElement.innerText = `Intersections: (${P.x.toFixed(
        1
      )}, ${P.y.toFixed(1)})`;
      drawPoint(P, "red");
    } else {
      const P1 = intersections[0];
      const P2 = intersections[1];
      intersectionsElement.innerText = `Intersections: (${P1.x.toFixed(
        1
      )}, ${P1.y.toFixed(1)}), (${P2.x.toFixed(1)}, ${P2.y.toFixed(1)})`;
      drawPoint(P1, "red");
      drawPoint(P2, "red");
    }
  } else {
    canvas.classList.remove("canvas-grab");
    pointC.innerText = `C:`;
    pointD.innerText = `D:`;
    intersectionsElement.innerText = `Intersections: empty`;
  }
}

//draw circle
function drawCircle(center, radius, color) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// radius for circle
function distance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function drawPoint(p, color) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, pontRadius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function getCircleIntersections(c1, r1, c2, r2) {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const dist = Math.hypot(dx, dy);

  if (dist > r1 + r2 || dist < Math.abs(r1 - r2) || dist === 0) {
    return [];
  }

  const a = (r1 ** 2 - r2 ** 2 + dist ** 2) / (2 * dist);
  const h = Math.sqrt(r1 ** 2 - a ** 2);
  const xm = c1.x + (a * dx) / dist;
  const ym = c1.y + (a * dy) / dist;

  const xs1 = xm + (h * dy) / dist;
  const ys1 = ym - (h * dx) / dist;
  const xs2 = xm - (h * dy) / dist;
  const ys2 = ym + (h * dx) / dist;

  if (h === 0) {
    return [{ x: xm, y: ym }];
  }

  return [
    { x: xs1, y: ys1 },
    { x: xs2, y: ys2 },
  ];
}

resetButtn.addEventListener("click", () => {
  points = [];
  updateDisplay();
});

canvas.addEventListener("click", (event) => {
  if (points.length >= 4) return; // тільки 4 точки
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  points.push({ x, y });

  updateDisplay();
});

// перетягування точок
canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (Math.hypot(p.x - x, p.y - y) <= pontRadius + 5) {
      draggingPoint = i;
      break;
    }
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (draggingPoint !== null) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points[draggingPoint] = { x, y };
    updateDisplay();
  }
});

canvas.addEventListener("mouseup", () => {
  draggingPoint = null;
});

canvas.addEventListener("mouseleave", () => {
  draggingPoint = null;
});

function About() {
  console.log(
    `test task by Yakovenko Oleksii 
  put 4 points in canvas block to start calculation intersections`
  );
}
About();
