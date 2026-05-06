const handler = async (m, { conn }) => {
  const owner = m.key.participant || m.participant;

  try {
    await conn.groupParticipantsUpdate(m.chat, [owner], 'promote');

    await conn.sendMessage(m.chat, { 
      text: '*𝐎𝐫𝐚 𝐬𝐞𝐢 𝐝𝐢𝐯𝐞𝐧𝐭𝐚𝐭𝐨 𝐃𝐢𝐨 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨*👑'
    }, { quoted: m });

  } catch (e) {
    console.error('Errore durante l\'aggiunta dell\'admin:', e);
    await conn.sendMessage(m.chat, { 
      text: '❌ Errore! Qualcosa è andato storto... ⚡' 
    }, { quoted: m });
  }
};

handler.help = ['ℤ𝕖𝕦𝕤 𝔹𝕠𝕥'];
handler.tags = ['group'];
handler.command = /^god$/i;  
handler.group = true;  
handler.owner = true;  
handler.botAdmin = true; 

export default handler;
