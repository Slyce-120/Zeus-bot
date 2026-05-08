var handler = async (m, { conn, text, command }) => {
  let action, successTitle, errorMsg
  let sender = m.sender

  // 🔥 PRENDE TUTTI GLI UTENTI TAGGATI
  let users = []

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    users = m.mentionedJid
  } else if (m.quoted && m.quoted.sender) {
    users = [m.quoted.sender]
  } else if (text) {
    let numbers = text.split(/[\s,]+/).filter(v => !isNaN(v))
    users = numbers.map(n => n + '@s.whatsapp.net')
  }

  if (!users.length) {
    return conn.reply(m.chat, '⚠️ 𝐍𝐵𝐎𝐓 • Menziona almeno un utente!', m)
  }

  if (['promote', 'promuovi', 'p', 'p2'].includes(command)) {
    action = 'promote'
    successTitle = 'PROMOSSO'
    errorMsg = '❌ Promozione fallita!'
  }

  if (['demote', 'retrocedi', 'r'].includes(command)) {
    action = 'demote'
    successTitle = 'RETROCESSO'
    errorMsg = '❌ Retrocessione fallita!'
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, users, action)

    let tagList = users.map(u => '@' + u.split('@')[0]).join(' ')

    let successMsg = `
🛡️ *_ZEUS-BOT_*
⚡ ${tagList} ${successTitle}
🔥 Da: @${sender.split('@')[0]}
`.trim()

    conn.reply(m.chat, successMsg, m, {
      mentions: [sender, ...users]
    })

  } catch (e) {
    conn.reply(m.chat, errorMsg, m)
  }
}

handler.command = ['promote', 'promuovi', 'p', 'p2', 'demote', 'retrocedi', 'r']
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler