import Constants from "./constants.json"

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

  const { x: edge_x1, y: edge_y1 } = canvasTF.inverse({ x: 0, y: 0 })
  const { x: edge_x2, y: edge_y2 } = canvasTF.inverse({ x: CanvasWidth, y: CanvasHeight })

  const max_x = Math.max(edge_x1, edge_x2)
  const max_y = Math.max(edge_y1, edge_y2)
  const min_x = Math.min(edge_x1, edge_x2)
  const min_y = Math.min(edge_y1, edge_y2)

  const delta_x = (max_x - min_x) / CanvasWidth
  const delta_y = (max_y - min_y) / CanvasHeight

  for (let x = min_x; x < max_x; x += delta_x) {    
    for (let y = min_y; y < max_y; y += delta_y) {
      if (isInnerMBSet(new Complex(x, y))) {
        const { x: _x, y: _y } = canvasTF.transform({ x, y })
        context.fillRect(_x, _y, 1, 1)
      }
    }
  }
}

function onClickReload() {
  const center_x = Number.parseFloat((document.getElementById(Constants.Inputs.CenterX.ID) as HTMLInputElement).value)
  const center_y = Number.parseFloat((document.getElementById(Constants.Inputs.CenterY.ID) as HTMLInputElement).value)
  const expansionRate = Number.parseFloat((document.getElementById(Constants.Inputs.ExpansionRate.ID) as HTMLInputElement).value)

  const canvas = document.getElementById(Constants.Canvas.ID) as any

  renderMB(canvas.getContext("2d") as CanvasRenderingContext2D, { x: center_x, y: center_y }, expansionRate)
}

function main() {
  document.getElementById(Constants.Inputs.Reload.ID)!.onclick = onClickReload

  const expansionRate = 400
  const canvas = document.getElementById(Constants.Canvas.ID) as any

  renderMB(canvas.getContext("2d") as CanvasRenderingContext2D, { x: 0, y: 0 }, expansionRate)
} 

main();