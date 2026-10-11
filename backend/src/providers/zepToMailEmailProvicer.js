const fs = require('fs')
const path = require('path')
const { SendMailClient } = require('zeptomail')
const QRCode = require('qrcode')

const getZeptoMail = () => {
    if (!process.env.ZEPTOMAIL_API_KEY) throw new Error('ZEPTOMAIL_API_KEY is not configured')
    if (!process.env.ZEPTOMAIL_FROM_EMAIL) throw new Error('ZEPTOMAIL_FROM_EMAIL is not configured')
    return new SendMailClient({
        url: process.env.ZEPTOMAIL_API_URL || 'https://cpaas.zoho.com/v1.1/email',
        token: process.env.ZEPTOMAIL_API_KEY
    })
}

const DEFAULT_EVENT = { name: 'FPTU Halloween 2026', date: 'Thứ bảy, 31 tháng 10, 2026', time: '18:00 - 22:00', location: 'Đại học FPT Hà Nội' }

const getAvatarBase64 = () => {
    const avatarPath = path.resolve(__dirname, '../../assets/avatar.jpg')
    return fs.readFileSync(avatarPath).toString('base64')
}

const getTicketImageBase64 = () => {
    const ticketImagePath = path.resolve(__dirname, '../../assets/ticket_website.png')
    return fs.readFileSync(ticketImagePath).toString('base64')
}

const escapeHtml = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
const formatCurrency = value => Number.isFinite(Number(value)) ? `${Number(value).toLocaleString('vi-VN')} đ` : '—'

const createSingleTicketEmailHtml = async ({ recipient, ticket, event = {}, qrCid = 'qr-image' }) => {
    const eventInfo = { ...DEFAULT_EVENT, ...event }
    const avatar = 'cid:avatar-image'
    const ticketImage = 'cid:ticket-website-image'
    const recipientName = escapeHtml(recipient?.name || recipient?.fullName || 'bạn')
    const recipientPhone = escapeHtml(recipient?.phone || '—')
    const ticketName = escapeHtml(ticket?.name || ticket?.ticketTypeName || 'Vé tham dự sự kiện')
    const ticketCode = escapeHtml(ticket?.code || ticket?.ticketCode || ticket?.qrCodeData || '—')
    const qrCodeData = String(ticket?.qrCodeData || ticket?.code || ticket?.ticketCode || '').trim()
    const qrDataUri = qrCodeData ? `cid:${qrCid}` : ''
    const qrImage = qrDataUri ? `<img src="${qrDataUri}" alt="Mã QR check-in" width="220" style="display:block;width:220px;height:220px;margin:0 auto">` : '<div style="padding:32px;background:#fff;color:#111">QR chưa được tạo</div>'

    return `<!doctype html><html><body style="margin:0;background:#121214;color:#f5f5f5;font-family:Arial,Helvetica,sans-serif"><div style="max-width:620px;margin:0 auto;background:#202124"><div style="padding:32px 28px 24px;background:#171719"><img src="${avatar}" alt="FPTU Halloween" width="56" height="56" style="display:block;width:56px;height:56px;border-radius:50%;object-fit:cover;margin-bottom:24px"><p style="margin:0 0 12px;color:#b9b9bd;font-size:14px">Xác nhận đăng ký thành công</p><h1 style="margin:0;color:#fff;font-size:30px;line-height:1.2">${escapeHtml(eventInfo.name)}</h1></div><div style="padding:36px 32px"><h2 style="margin:0 0 28px;font-size:24px;line-height:1.35;color:#fff">Xin chào ${recipientName} - ${recipientPhone}, bạn đã đăng ký mua vé sự kiện thành công.</h2><div style="text-align:center;margin:0 0 32px"><img src="${avatar}" alt="FPTU Halloween" width="260" style="display:inline-block;width:260px;max-width:100%;height:auto;border-radius:18px"></div><h2 style="margin:0 0 22px;font-size:23px;line-height:1.3;color:#fff">${escapeHtml(eventInfo.name)}</h2><div style="border-bottom:1px solid #444;padding-bottom:24px;margin-bottom:26px;color:#c7c7ca;font-size:16px;line-height:2"><div>📅 ${escapeHtml(eventInfo.date)}</div><div>🕕 ${escapeHtml(eventInfo.time)}</div><div>📍 ${escapeHtml(eventInfo.location)}</div></div><h3 style="margin:0 0 18px;font-size:20px;color:#fff">Vé của bạn</h3><div style="background:#f3f4f6;color:#151517;border-radius:14px;padding:18px 20px;margin-bottom:28px"><strong style="font-size:18px">${ticketName}</strong><div style="margin-top:8px;color:#555">Giá vé: ${formatCurrency(ticket?.price || ticket?.ticketTypePrice)}</div><div style="margin-top:8px;color:#555">Mã vé: <strong>${ticketCode}</strong></div></div><h3 style="margin:0 0 12px;font-size:20px;color:#fff">Mã check-in</h3><p style="margin:0 0 20px;color:#c7c7ca;line-height:1.6">Vui lòng cung cấp mã QR này để check-in và tham gia sự kiện.</p><div style="text-align:center;background:#fff;border-radius:12px;padding:20px;margin-bottom:16px">${qrImage}</div><p style="margin:0 0 28px;text-align:center;color:#fff;font-size:22px;font-weight:bold;letter-spacing:3px;word-break:break-all">${ticketCode}</p><div style="border-top:1px solid #444;padding-top:24px;color:#c7c7ca;line-height:1.7">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.</div></div><div style="padding:24px 32px;background:#171719;color:#999;font-size:13px;line-height:1.6">Trân trọng,<br><strong style="color:#fff">Đội ngũ FPTU Halloween</strong><br>FPTU Halloween — Một đêm hội đáng nhớ</div></div></body></html>`
}

const createTicketEmailHtml = async ({ recipient, tickets, ticket, event }) => {
    const ticketList = Array.isArray(tickets) && tickets.length ? tickets : [ticket]
    const documents = await Promise.all(ticketList.map((item, index) => createSingleTicketEmailHtml({ recipient, ticket: item, event, qrCid: `qr-image-${index}` })))
    if (documents.length === 1) return documents[0]

    const contentPattern = /<div style="padding:36px 32px">([\s\S]*?)<\/div><div style="padding:24px 32px/
    const sections = documents.map(document => document.match(contentPattern)?.[1]).filter(Boolean)
    return documents[0].replace(contentPattern, `<div style="padding:36px 32px">${sections.join('<hr style="border:0;border-top:1px solid #444;margin:32px 0">')}</div><div style="padding:24px 32px`)
}

const addTicketLinksAndRemoveEventDetailsLegacy = html => html
    .replace('src="cid:avatar-image" alt="FPTU Halloween" width="260"', 'src="cid:ticket-website-image" alt="Vé điện tử FPTU Halloween" width="560"')
    .replace('style="display:inline-block;width:260px;max-width:100%;height:auto;border-radius:18px"', 'style="display:inline-block;width:390px;max-width:100%;height:auto;border-radius:18px"')
    .replace(/<h2 style="margin:0 0 22px;font-size:23px;line-height:1.3;color:#fff">[\s\S]*?<\/h2>/, '')
    .replace(/#121214/g, '#f3f4f6')
    .replace(/#202124/g, '#ffffff')
    .replace(/#171719/g, '#ffffff')
    .replace(/#f5f5f5/g, '#111827')
    .replace(/color:#fff/g, 'color:#111827')
    .replace(/#b9b9bd/g, '#6b7280')
    .replace(/#c7c7ca/g, '#4b5563')
    .replace(/#999/g, '#6b7280')
    .replace(
        /<div style="border-bottom:1px solid #444;[\s\S]*?<\/div><h3 style="margin:0 0 18px;font-size:20px;color:#111827">/g,
        '<div style="border-bottom:1px solid #e5e7eb;padding-bottom:24px;margin-bottom:26px;color:#374151;font-size:15px;line-height:1.8"></div><h3 style="margin:0 0 18px;font-size:20px;color:#111827">'
    )

const addTicketLinksAndRemoveEventDetails = html => addTicketLinksAndRemoveEventDetailsLegacy(html)
    .replace(/Đội ngũ FPTU Halloween/g, 'Ban tổ chức FPTU Halloween 2026')
    .replace(/src="cid:avatar-image" alt="FPTU Halloween" width="260"/g, 'src="cid:ticket-website-image" alt="Electronic FPTU Halloween ticket" width="560"')
    .replace(/style="display:inline-block;width:260px;max-width:100%;height:auto;border-radius:18px"/g, 'style="display:inline-block;width:390px;max-width:100%;height:auto;border-radius:18px"')
    .replace(/<h2 style="margin:0 0 22px;font-size:23px;line-height:1.3;color:#fff">[\s\S]*?<\/h2>/g, '')
    .replace(/(<img src="cid:ticket-website-image"[\s\S]*?<\/div>)<h2[\s\S]*?<\/h2>/g, '$1')

const addTicketLinks = html => html.replace(
    /(<p style="margin:0 0 28px;text-align:center;color:#111827;font-size:22px;font-weight:bold;letter-spacing:3px;word-break:break-all">[\s\S]*?<\/p>)(<div style="border-top:1px solid #444)/g,
    '$1<div style="margin:0 0 28px;text-align:left;font-size:15px;line-height:2"><div>👉 <a href="https://fptuhalloween.io.vn/my-ticket" style="color:#b91c1c;font-weight:bold;text-decoration:underline">Xem vé online trên hệ thống</a></div><div>👉 <a href="https://www.facebook.com/fptuhalloween" style="color:#b91c1c;font-weight:bold;text-decoration:underline">Theo dõi fanpage FPTU Halloween</a></div></div>$2'
)

const sendTicketEmail = async ({ recipient, tickets, ticket, event }) => {
    if (!recipient?.email) throw new Error('Recipient email is required')
    const ticketList = Array.isArray(tickets) && tickets.length ? tickets : [ticket]
    const inlineImages = [
        { content: getAvatarBase64(), name: 'avatar.jpg', cid: 'avatar-image', mime_type: 'image/jpeg' },
        { content: getTicketImageBase64(), name: 'ticket_website.png', cid: 'ticket-website-image', mime_type: 'image/png' }
    ]
    for (const [index, item] of ticketList.entries()) {
        const qrCodeData = String(item?.qrCodeData || item?.code || item?.ticketCode || '').trim()
        if (!qrCodeData) continue
        const qrDataUri = await QRCode.toDataURL(qrCodeData, { width: 260, margin: 2, errorCorrectionLevel: 'M' })
        inlineImages.push({
            content: qrDataUri.replace(/^data:image\/png;base64,/, ''),
            name: `ticket-qr-${index + 1}.png`,
            cid: `qr-image-${index}`,
            mime_type: 'image/png'
        })
    }
    return getZeptoMail().sendMail({
        from: {
            address: process.env.ZEPTOMAIL_FROM_EMAIL,
            name: process.env.ZEPTOMAIL_FROM_NAME || 'FPTU Halloween'
        },
        to: [{ email_address: { address: recipient.email, name: recipient.name || recipient.fullName || 'Buyer' } }],
    subject: `[FPTUHalloween2026] Đăng ký vé thành công - "${recipient.name || recipient.fullName || 'Người mua'}" - "${ticketList.length} vé"`,
        htmlbody: addTicketLinks(addTicketLinksAndRemoveEventDetails(await createTicketEmailHtml({ recipient, tickets: ticketList, event }))),
        inline_images: inlineImages
    })
}

module.exports = { createTicketEmailHtml, sendTicketEmail }
