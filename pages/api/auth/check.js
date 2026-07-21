const cookie = require('cookie')

export default function handler(req, res) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  if (cookies && cookies.pg_admin === '1') {
    return res.json({ ok: true })
  }
  return res.json({ ok: false })
}
