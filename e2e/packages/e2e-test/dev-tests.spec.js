const path = require('path')
const puppeteer = require('puppeteer')
const { exec } = require('child_process')
const { createServer } = require('http-server')

const app = path.resolve(__dirname, '../e2e-app')

function CompileApp() {
  return new Promise((resolve, reject) => {
    exec('yarn build', { cwd: app }, (err, stdout, stderr) => {
      if (err) return reject(err)
      if (stderr.length) return reject(stderr)
      if (!stdout.includes('Compiled successfully.'))
        reject(stdout)
        
      resolve()
    })
  })
}

jest.setTimeout(300000)
describe('dev tests', () => {
  const server = createServer({ root: path.join(app, 'build') })

  beforeAll((done) => {
    server.listen(30000, () => done())
  })

  afterAll(() => {
    server.close()
  })

  it('runs the page properly', async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`http://localhost:30000`)
    await page.waitForSelector('button')
    const el = await await page.evaluate(() => {
      return document.querySelector('button').textContent;
    });
    
    expect(el).toBe('A Button!')
    expect(await page.evaluate(() => document.querySelector('#root').outerHTML)).toMatchSnapshot()

    await browser.close()
    expect(true)
  })
})