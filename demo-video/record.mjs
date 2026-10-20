import { spawnSync } from 'node:child_process'
import { mkdirSync, renameSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.dirname(fileURLToPath(import.meta.url))
const rawDir = path.join(root, 'raw')
const appUrl = 'http://127.0.0.1:5173/'
const webmPath = path.join(root, 'centr-roz-demo.webm')
const mp4Path = path.join(root, 'centr-roz-demo.mp4')

function pause(page, ms) {
  return page.waitForTimeout(ms)
}

async function smoothScroll(locator) {
  await locator.evaluate((element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
  await locator.page().waitForTimeout(1100)
}

async function waitForReadyHome(page) {
  await page.goto(appUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('heading', { name: 'Здравствуйте, Анна' }).waitFor()
  await page.getByRole('img', { name: 'Дисконт Центр Роз' }).first().waitFor()
  await page.getByText('Цветы говорят за вас').waitFor()
  await page.getByRole('link', { name: /Бонусный баланс/ }).waitFor()
  await page.waitForFunction(() => {
    const images = [...document.images].filter((image) => {
      const box = image.getBoundingClientRect()
      return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight
    })
    return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0)
  })
  await pause(page, 400)
}

async function record() {
  rmSync(rawDir, { recursive: true, force: true })
  mkdirSync(rawDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    screen: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    locale: 'ru-RU',
    hasTouch: true,
    isMobile: true,
    colorScheme: 'light',
    recordVideo: {
      dir: rawDir,
      size: { width: 390, height: 844 },
    },
  })
  const recordingStarted = Date.now()
  const page = await context.newPage()

  try {
    await page.addInitScript(() => {
      localStorage.removeItem('centr-roz-demo')
    })
    await waitForReadyHome(page)
    const trimStart = Math.max(0, (Date.now() - recordingStarted) / 1000)

    await pause(page, 2800)
    await smoothScroll(page.getByRole('heading', { name: 'Выбрано с любовью' }))
    await pause(page, 2800)

    await page.getByRole('link', { name: 'Каталог', exact: true }).click()
    await page.getByRole('heading', { name: 'Каталог', exact: true }).waitFor()
    await page.getByRole('button', { name: /Букет «Волшебный»/ }).waitFor()
    await pause(page, 2200)
    await smoothScroll(page.getByRole('button', { name: /Букет «История любви»/ }))
    await pause(page, 1400)
    await page.getByRole('button', { name: /Букет «История любви»/ }).click()
    await page.getByRole('dialog', { name: 'История любви' }).waitFor()
    await page.getByRole('link', { name: 'Открыть на сайте магазина' }).waitFor()
    await pause(page, 2800)
    await page.getByRole('button', { name: 'Закрыть' }).click()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await pause(page, 700)
    await page.getByRole('button', { name: 'Добавить «История любви» в избранное' }).click()
    await page.getByRole('button', { name: 'Убрать «История любви» из избранного' }).waitFor()
    await pause(page, 1400)

    await page.getByRole('link', { name: 'Моя карта', exact: true }).click()
    await page.getByRole('heading', { name: 'Моя карта' }).waitFor()
    await page.getByRole('main').getByText('840', { exact: true }).waitFor()
    await page.getByText('Покажите карту флористу').waitFor()
    await pause(page, 6500)

    await page.getByRole('button', { name: 'Панель сотрудника' }).click()
    const staff = page.getByRole('dialog', { name: 'Панель сотрудника' })
    await staff.waitFor()
    await pause(page, 1200)
    await staff.getByLabel('Сумма покупки, ₽').fill('3000')
    await staff.getByText('Начислим 150 бонусов').waitFor()
    await pause(page, 1600)
    await staff.getByText('Начисление', { exact: true }).click()
    await pause(page, 900)
    await staff.getByRole('button', { name: 'Подтвердить' }).click()
    await staff.getByText('Начислено 150 бонусов. Баланс: 990.').waitFor()
    await pause(page, 2200)
    await staff.getByRole('button', { name: 'Закрыть' }).click()
    await staff.waitFor({ state: 'hidden' })
    await page.getByRole('main').getByText('990', { exact: true }).waitFor()
    await smoothScroll(page.getByText('+150', { exact: true }))
    await pause(page, 2400)

    await page.getByRole('link', { name: 'Важные даты', exact: true }).click()
    await page.getByRole('heading', { name: 'Важные даты' }).waitFor()
    await page.getByRole('main').getByText('День рождения мамы').waitFor()
    await pause(page, 6200)

    await page.getByRole('link', { name: 'Главная', exact: true }).click()
    await page.getByRole('heading', { name: 'Здравствуйте, Анна' }).waitFor()
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
    await pause(page, 4200)

    const video = page.video()
    await context.close()
    await browser.close()
    if (!video) throw new Error('Запись видео не создана')
    const source = await video.path()
    return { source, trimStart }
  } catch (error) {
    await context.close().catch(() => {})
    await browser.close().catch(() => {})
    throw error
  }
}

function runFfmpeg(args) {
  const result = spawnSync('ffmpeg', args, { stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`ffmpeg завершился с кодом ${result.status}`)
  }
}

function probeDuration(file) {
  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    { encoding: 'utf8' },
  )
  if (result.status !== 0) throw new Error(result.stderr || 'ffprobe не прочитал длительность')
  return Number.parseFloat(result.stdout.trim())
}

const { source, trimStart } = await record()
const rawCopy = path.join(rawDir, 'capture.webm')
renameSync(source, rawCopy)
const fullDuration = probeDuration(rawCopy)
const keep = Math.max(0, fullDuration - trimStart - 0.15)

runFfmpeg([
  '-y',
  '-ss',
  trimStart.toFixed(3),
  '-i',
  rawCopy,
  '-t',
  keep.toFixed(3),
  '-an',
  '-c:v',
  'libvpx-vp9',
  '-b:v',
  '0',
  '-crf',
  '34',
  webmPath,
])

runFfmpeg([
  '-y',
  '-i',
  webmPath,
  '-an',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  '-vf',
  'scale=390:844:force_original_aspect_ratio=decrease:flags=lanczos,pad=390:844:(ow-iw)/2:(oh-ih)/2',
  mp4Path,
])

const webmStat = statSync(webmPath)
const mp4Stat = statSync(mp4Path)
const webmDuration = probeDuration(webmPath)
const mp4Duration = probeDuration(mp4Path)
console.log(
  JSON.stringify(
    {
      trimStart,
      fullDuration,
      webmDuration,
      mp4Duration,
      webmBytes: webmStat.size,
      mp4Bytes: mp4Stat.size,
      webmPath,
      mp4Path,
    },
    null,
    2,
  ),
)
