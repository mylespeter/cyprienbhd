// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      )
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    console.log('📩 Nouveau message de contact:', { name, email, phone })

    // Email pour l'administrateur
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a3a6b; color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 20px; border-left: 4px solid #ff6b00; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1a3a6b; font-size: 14px; text-transform: uppercase; }
          .value { margin-top: 5px; padding: 10px; background: white; border: 1px solid #e0e0e0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouveau Message de Contact</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nom Complet</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Téléphone</div>
              <div class="value">${phone || 'Non renseigné'}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Ce message a été envoyé depuis le formulaire de contact du site</p>
            <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Email de confirmation pour le client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b00; color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 20px; border: 1px solid #e0e0e0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nous avons bien reçu votre message</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Nous vous remercions de nous avoir contactés. Notre équipe a bien reçu votre message et vous répondra dans les plus brefs délais (généralement sous 24 heures).</p>
            <p><strong>Rappel de votre message :</strong></p>
            <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ff6b00; margin: 15px 0;">
              ${message.replace(/\n/g, '<br>')}
            </blockquote>
            <p>Si vous avez des questions urgentes, n'hésitez pas à nous appeler :</p>
            <p>
              📞 +243 997 760 063<br>
              📞 +243 811 832 687
            </p>
            <p>Cordialement,<br><strong>L'équipe Sylwak Construction</strong></p>
          </div>
          <div class="footer">
            <p>Sylwak Construction - Lubumbashi, Haut-Katanga, RDC</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Envoyer l'email à l'administrateur
    const adminEmail = process.env.ADMIN_EMAIL || 'yumbawakumwanza@gmail.com'
    const adminResult = await sendEmail(
      adminEmail,
      `Nouveau message de ${name} - Sylwak Construction`,
      adminEmailHtml
    )

    // Envoyer l'email de confirmation au client
    const clientResult = await sendEmail(
      email,
      'Confirmation de réception - Sylwak Construction',
      clientEmailHtml
    )

    if (adminResult.success && clientResult.success) {
      console.log('✅ Emails envoyés avec succès')
      return NextResponse.json({ 
        success: true, 
        message: 'Message envoyé avec succès' 
      })
    } else if (adminResult.success) {
      console.warn('⚠️ Email admin envoyé mais email client échoué')
      return NextResponse.json({ 
        success: true, 
        message: 'Message envoyé avec succès' 
      })
    } else {
      throw new Error('Échec de l\'envoi des emails')
    }

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi du message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}