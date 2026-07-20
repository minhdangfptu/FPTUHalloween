const React = require('react')
const { Resend } = require('resend')
const {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text
} = require('@react-email/components')
const { render } = require('@react-email/render')

const getResend = () => {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(process.env.RESEND_API_KEY)
}

const getCopy = purpose => purpose === 'register'
  ? {
    subject: 'Xác nhận tài khoản FPTU Halloween',
    heading: 'Xác nhận tài khoản',
    description: 'Sử dụng mã OTP dưới đây để xác minh tài khoản FPTU Halloween của bạn.'
  }
  : {
    subject: 'Đặt lại mật khẩu FPTU Halloween',
    heading: 'Đặt lại mật khẩu',
    description: 'Sử dụng mã OTP dưới đây để tiếp tục đặt lại mật khẩu của bạn.'
  }

const OtpEmail = ({ otp, purpose }) => {
  const copy = getCopy(purpose)
  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Preview, null, `${copy.subject} — mã OTP của bạn là ${otp}`),
    React.createElement(Body, { style: styles.body },
      React.createElement(Container, { style: styles.container },
        React.createElement(Section, { style: styles.header },
          React.createElement(Text, { style: styles.brand }, 'FPTU HALLOWEEN'),
          React.createElement(Heading, { style: styles.heading }, copy.heading)
        ),
        React.createElement(Section, { style: styles.content },
          React.createElement(Text, { style: styles.description }, copy.description),
          React.createElement(Text, { style: styles.otp }, otp),
          React.createElement(Text, { style: styles.note }, 'Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu email này, bạn có thể bỏ qua.')
        ),
        React.createElement(Hr, { style: styles.hr }),
        React.createElement(Text, { style: styles.footer }, 'FPTU Halloween · Một đêm hội đáng nhớ')
      )
    )
  )
}

const sendOtpEmail = async (email, otp, purpose) => {
  const copy = getCopy(purpose)
  const html = await render(React.createElement(OtpEmail, { otp, purpose }))
  return getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'FPTU Halloween <noreply@fptuhalloween.io.vn>',
    to: [email],
    subject: copy.subject,
    html
  })
}

const styles = {
  body: { backgroundColor: '#FFFFFF', fontFamily: 'Arial, sans-serif', padding: '32px 12px' },
  container: { maxWidth: '520px', margin: '0 auto', backgroundColor: '#FFFFFF', border: '1px solid #e60000', borderRadius: '18px', overflow: 'hidden' },
  header: { backgroundColor: '#e60000', padding: '36px 28px', textAlign: 'center' },
  brand: { color: '#FFFFFF', fontSize: '13px', fontWeight: 'bold', letterSpacing: '3px', margin: '0 0 18px' },
  heading: { color: '#FFFFFF', fontSize: '26px', margin: '0' },
  content: { padding: '32px 28px', textAlign: 'center' },
  description: { color: '#e60000', fontSize: '15px', lineHeight: '24px', margin: '0 0 24px' },
  otp: { color: '#e60000', backgroundColor: '#FFFFFF', border: '1px solid #e60000', borderRadius: '12px', fontSize: '34px', fontWeight: 'bold', letterSpacing: '9px', padding: '16px 20px', margin: '0 auto 24px' },
  note: { color: '#e60000', fontSize: '13px', lineHeight: '20px', margin: '0' },
  hr: { borderColor: '#e60000', margin: '0 28px' },
  footer: { color: '#e60000', fontSize: '12px', textAlign: 'center', padding: '20px 28px', margin: '0' }
}

module.exports = { sendOtpEmail, OtpEmail }
