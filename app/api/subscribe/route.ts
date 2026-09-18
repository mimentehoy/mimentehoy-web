import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email inválido' }, { status: 400 })
    }

    const apiKey = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_KEY
    const groupId = process.env.MAILERLITE_GROUP_ID || process.env.MAILERLITE_LIST_ID

    if (apiKey && groupId) {
      // Attempt to subscribe via MailerLite v2
      const url = `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': apiKey
        },
        body: JSON.stringify({ email })
      })
      if (res.ok) return NextResponse.json({ message: 'Subscribed' })
      const data = await res.text()
      return NextResponse.json({ message: 'MailerLite error', details: data }, { status: 502 })
    }

    // Fallback: persist to local data/subscriptions.json for manual import
    const repoRoot = path.resolve('.')
    const dataDir = path.join(repoRoot, 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
    const file = path.join(dataDir, 'subscriptions.json')
    let arr: any[] = []
    if (fs.existsSync(file)) {
      try { arr = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { arr = [] }
    }
    arr.push({ email, created_at: new Date().toISOString() })
    fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf8')

    return NextResponse.json({ message: 'Saved locally' })
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
