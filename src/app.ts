import Constants from "./constants.json"

const LOOP_MAX = 1000
type Point = { x: number, y: number }

class Complex {
  constructor(
    public re: number,
    public im: number
  ) {}

  add(rhs: Complex): Complex { return new Complex(this.re + rhs.re, this.im + rhs.im) }
  mult(rhs: Complex): Complex { return new Complex(this.re * rhs.re - this.im * rhs.im, this.re * rhs.im + this.im * rhs.re) }
  sqrd(): Complex { return this.mult(this) } 
  abs(): number { return this.re * this.re + this.im * this.im }
  toPoint(): Point { return ({ x: this.re, y: this.im }) }
}

const MBtransform = (z: Complex, c: Complex): Complex => z.sqrd().add(c)

const isInnerMBSet = (c: Complex): boolean => {
  const LOOP_MAX = 300
  let z = new Complex(0, 0)
  for (let i = 0; i < LOOP_MAX; i++) {
    z = MBtransform(z, c)
    if (z.abs() > 2) { return false }
  }
  return true
}

const calculateDivergeSpeed = (c: Complex): number => {
  if (c.abs() >= 2) { return LOOP_MAX }

  let z = new Complex(0, 0)
  for (let i = 1; i < LOOP_MAX; i++) {
    z = MBtransform(z, c)
    if (z.abs() > 2) { return LOOP_MAX - i }
  }
  return 0
}

class AffineTransformer {
  constructor(
    private matrix: [[number, number, number], [number, number, number]]
  ) {}

  transform({ x: _x, y: _y }: Point): Point {
    const [[a, b, c], [d, e, f]] = this.matrix;
    return { x: a * _x + b * _y + c, y: d * _x + e * _y + f }
  }
  inverse({ x: _x, y: _y }: Point): Point {
    const [[a, b, c], [d, e, f]] = this.matrix;
    const det = a * e - b * d
    return { x: (e*_x - b*_y - c*e + b*f)/det, y: (-d*_x + a*_y + c*d - a*f)/det }
  }
}

const renderMB = (context: CanvasRenderingContext2D, centerPoint: Point, expansionRate: number) => {
  const CanvasWidth = context.canvas.width
  const CanvasHeight = context.canvas.height
  context.clearRect(0, 0, CanvasWidth, CanvasWidth);

  const canvasTF = new AffineTransformer(
    [[expansionRate, 0, CanvasWidth/2 - expansionRate * centerPoint.x], [0, -expansionRate, CanvasHeight/2 + expansionRate * centerPoint.y]]
  )

  for (let canv_x = 0; canv_x < CanvasWidth; canv_x++) {
    for (let canv_y = 0; canv_y < CanvasWidth; canv_y++) {
      const { x:re, y:im } = canvasTF.inverse({ x: canv_x, y: canv_y })
      const divergeSpeed = calculateDivergeSpeed(new Complex(re, im))
      
      switch (true) {
        case divergeSpeed === 0:
          context.fillStyle = `rgb(0, 0, 0)`; break;
        case divergeSpeed <= LOOP_MAX * 0.5:      //  1/2
          context.fillStyle = `rgb(255, 255, 255)`; break;
        case divergeSpeed <= LOOP_MAX * 0.75:     //  3/4
          context.fillStyle = `rgb(100, 250, 200)`; break;
        case divergeSpeed <= LOOP_MAX * 0.875:    //  7/8
          context.fillStyle = `rgb(80, 150, 150)`; break;
        case divergeSpeed <= LOOP_MAX * 0.9375:   // 15/16
          context.fillStyle = `rgb(50, 150, 230)`; break;
        case divergeSpeed <= LOOP_MAX * 0.96875:  // 31/32
          context.fillStyle = `rgb(0, 130, 255)`; break;
        case divergeSpeed <= LOOP_MAX - 1:
          context.fillStyle = `rgb(0, 100, 255)`; break;
        default:
          context.fillStyle = `rgb(0, 0, 255)`; break;
      }

      context.fillRect(canv_x, canv_y, 1, 1)
    }
  }
}

function onClickReload() {
  const center_x = Number.parseFloat((document.getElementById(Constants.Inputs.CenterX.ID) as HTMLInputElement).value)
  const center_y = Number.parseFloat((document.getElementById(Constants.Inputs.CenterY.ID) as HTMLInputElement).value)
  const expansionRate = Number.parseFloat((document.getElementById(Constants.Inputs.ExpansionRate.ID) as HTMLInputElement).value)

  window.location.hash = `center_x=${center_x}&center_y=${center_y}&expansionRate=${expansionRate}`
}

const pickParams = () => {
  const hash = window.location.hash.slice(1);
  const [_center_x, _center_y, _expansionRate] = hash.split("&");
  
  const center_x = Number.parseFloat(_center_x.split("=")[1])
  const center_y = Number.parseFloat(_center_y.split("=")[1])
  const expansionRate = Number.parseFloat(_expansionRate.split("=")[1])

  return { center_x, center_y, expansionRate }
}

function main() {
  document.getElementById(Constants.Inputs.Reload.ID)!.onclick = onClickReload
  window.onhashchange = main

  const { center_x, center_y, expansionRate } = window.location.hash?.length ? pickParams()
    : { center_x: 0, center_y: 0, expansionRate: 400 };

  (document.getElementById(Constants.Inputs.CenterX.ID) as HTMLInputElement).value = center_x.toString();
  (document.getElementById(Constants.Inputs.CenterY.ID) as HTMLInputElement).value = center_y.toString();
  (document.getElementById(Constants.Inputs.ExpansionRate.ID) as HTMLInputElement).value = expansionRate.toString();
  
  const canvas = document.getElementById(Constants.Canvas.ID) as HTMLCanvasElement

  renderMB(
    canvas.getContext("2d") as CanvasRenderingContext2D,
    { x: center_x , y: center_y },
    expansionRate,
  );
} 

main();