let handler = async (m, { conn }) => {
    let staff = `*⋆｡˚✦『 𝐒𝐓𝐀𝐅𝐅 ℤ𝕖𝕦𝕤 𝔹𝕠𝕥 』✦˚｡⋆*

*╭───────────────╮*
*│ 🤖 𝐁𝐨𝐭:* ${global.ℤ𝕖𝕦𝕤}
*│ 🆚 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞:* ${global.versione}
*╰───────────────╯*

*╭─── 👑 𝐂𝐑𝐄𝐀𝐓𝐎𝐑𝐄 ───╮*
*│ ✦ 𝐍𝐨𝐦𝐞:* ℨ𝔢𝔲𝔰
*│ ✦ 𝐑𝐮𝐨𝐥𝐨:* Creatore / Developer
*│ ✦ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* @393762257368
*╰────────────────────╯*

*╭─── 🔱 𝐂𝐎-𝐎𝐖𝐍𝐄𝐑 ───╮*
*│ ✦ slyce*
*│   ├ 𝐑𝐮𝐨𝐥𝐨:* Co-Owner/ Lead Developer
*│   └ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* @12368910153
*╰────────────────────╯*

> *ℤ𝕖𝕦𝕤 𝔹𝕠𝕥*`

    await conn.reply(
        m.chat,
        staff.trim(),
        m,
        {
            contextInfo: {
                mentionedJid: [
                    '393762257368@s.whatsapp.net',
                    '12368910153@s.whatsapp.net',
                    
                ]
            }
        }
    )

    await conn.sendMessage(m.chat, {
        contacts: {
            contacts: [
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Slyce
ORG:ℤ𝕖𝕦𝕤 𝔹𝕠𝕥 - Creatore / Dev
TEL;type=CELL;type=VOICE;waid=393762257368:393762257368
END:VCARD`
                },
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Bonzino
ORG:ℤ𝕖𝕦𝕤 𝔹𝕠𝕥 - Co-Owner
TEL;type=CELL;type=VOICE;waid=12368910153:+12368910153
END:VCARD`
                
            
                }
            ]
        }
    }, { quoted: m })

    m.react('👑')
}

handler.help = ['staff']
handler.tags = ['main']
handler.command = ['staff', 'moderatori', 'collaboratori']

export default handler