// Plugin aggiorna by 𝕯𝖊ⱥ𝖉𝖑𝐲 e Bonzino

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const BACKUP_DIR = path.resolve('./db-backup')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function truncate(text = '', max = 3500) {
  const str = String(text || '')
  return str.length > max ? str.slice(0, max) + '\n...' : str
}

function ensureBackupDir() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

function getTimestamp() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

function cleanupOldBackups() {
  ensureBackupDir()

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      path: path.join(BACKUP_DIR, file),
      time: fs.statSync(path.join(BACKUP_DIR, file)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time)

  for (let i = 1; i < files.length; i++) {
    try {
      fs.unlinkSync(files[i].path)
    } catch {}
  }
}

function createDatabaseBackup() {
  ensureBackupDir()
  cleanupOldBackups()

  const dbData = global.db?.data || { users: {}, chats: {}, settings: {} }
  const fileName = `database_backup_${getTimestamp()}.json`
  const filePath = path.join(BACKUP_DIR, fileName)

  fs.writeFileSync(filePath, JSON.stringify(dbData, null, 2))
  return { fileName, filePath }
}

let handler = async (m, { conn, command }) => {
  try {
    await conn.reply(m.chat, '*🔄 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐨 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐦𝐞𝐧𝐭𝐢...*', m)

    execSync('git fetch origin', { encoding: 'utf-8' })

    const diffStat = execSync('git diff --stat HEAD origin/main', {
      encoding: 'utf-8'
    })

    const diffStatus = execSync('git diff --name-status HEAD origin/main', {
      encoding: 'utf-8'
    })

    const statMap = {}
    diffStat
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('|'))
      .forEach(line => {
        const [file, changesRaw] = line.split('|').map(s => s.trim())
        const plus = (changesRaw.match(/\+/g) || []).length
        const minus = (changesRaw.match(/-/g) || []).length
        statMap[file] = { plus, minus }
      })

    const updatedFiles = diffStatus
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split('\t')
        const status = parts[0]
        const oldPath = parts[1]
        const newPath = parts[2]

        if (status.startsWith('R')) {
          const stats = statMap[newPath] || statMap[oldPath] || { plus: 0, minus: 0 }
          return `🔁 ${oldPath} → ${newPath} (+${stats.plus}/-${stats.minus})`
        }

        if (status === 'A') {
          const stats = statMap[oldPath] || { plus: 0, minus: 0 }
          return `✅ ${oldPath} (+${stats.plus}/-${stats.minus})`
        }

        if (status === 'D') {
          const stats = statMap[oldPath] || { plus: 0, minus: 0 }
          return `❌ ${oldPath} (+${stats.plus}/-${stats.minus})`
        }

        const stats = statMap[oldPath] || { plus: 0, minus: 0 }
        return `📄 ${oldPath} (+${stats.plus}/-${stats.minus})`
      })

    let backupDone = false
    if (updatedFiles.length > 0) {
      createDatabaseBackup()
      backupDone = true
    }

    execSync('git reset --hard origin/main && git pull', {
      encoding: 'utf-8'
    })

    await sleep(1500)

    let resultMsg = `*✅ 𝐀𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐦𝐞𝐧𝐭ο 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐨!*`

    if (updatedFiles.length > 0) {
      resultMsg += `\n\n📦 *𝐅𝐢𝐥𝐞 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐢:* ${updatedFiles.length}\n\n${updatedFiles.join('\n')}`
    } else {
      resultMsg += '\n\nℹ️ *𝐍𝐞𝐬𝐬𝐮𝐧 𝐟𝐢𝐥𝐞 𝐝𝐚 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐫𝐞*'
    }

    if (backupDone) {
      resultMsg += `\n\n✅ *𝐁𝐚𝐜𝐤𝐮𝐩 𝐃𝐁 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐚𝐦𝐞𝐧𝐭𝐞*`
    }

    resultMsg += `\n\n> ℤ𝕖𝕦𝕤 𝔹𝕠𝕥`

    await conn.reply(m.chat, truncate(resultMsg), m)
    await m.react('✅')

  } catch (err) {
    await conn.reply(
      m.chat,
      `*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐦𝐞𝐧𝐭𝐨:*\n\n${err.message}\n\n> ℤ𝕖𝕦𝕤 𝔹𝕠𝕥`,
      m
    )
    await m.react('❌')
  }
}

handler.help = ['aggiorna']
handler.tags = ['owner']
handler.command = /^(aggiorna|update|aggiornabot)$/i
handler.owner = true

export default handler