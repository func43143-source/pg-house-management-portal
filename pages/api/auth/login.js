const cookie = require('cookie')

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body
  if (username === 'admin' && password === 'admin123') {
    res.setHeader('Set-Cookie', cookie.serialize('pg_admin', '1', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24
    }))
    return res.json({ ok: true })
  }
  return res.status(401).json({ ok: false, message: 'Invalid credentials' })
}
