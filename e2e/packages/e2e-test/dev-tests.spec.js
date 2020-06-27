const path = require('path')
const puppeteer = require('puppeteer')
const { exec } = require('child_process')
const { createServer } = require('http-server')

const app = path.resolve(__dirname, '../e2e-app')
const args = ['--no-sandbox', '--disable-setuid-sandbox']

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
  let browser;
  const server = createServer({ root: path.join(app, 'build') })

  beforeAll((done) => {
    CompileApp().then(() => {
      return puppeteer.launch({ headless: true, args })
      .then((_) => {
        browser = _
        server.listen(3000, (err) => done(err))
      })
    }).catch(err => done(err))
  })

  afterAll((done) => {
    server.close()
    browser.close().then(() => done()).catch(err => done(err))
  })

  it('runs the page properly', async () => {
    
    const page = await browser.newPage()
    await page.goto(`http://localhost:3000`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('button')
    const el = await await page.evaluate(() => {
      return document.querySelector('button').textContent;
    });
    
    expect(el).toBe('A Button!')
    expect(await page.evaluate(() => document.querySelector('#root').outerHTML)).toMatchSnapshot()
  })
})