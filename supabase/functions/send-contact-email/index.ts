// @ts-nocheck

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, or message" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Retrieve environment variables (Supabase Secrets)
    const zeptomailKey = Deno.env.get('ZEPTOMAIL_API_KEY')
    const smtpSender = Deno.env.get('SMTP_SENDER') || 'noreply@aparox.in'
    const contactRecipient = Deno.env.get('CONTACT_RECIPIENT') || 'aparoxpvtltd@gmail.com'

    if (!zeptomailKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: Zeptomail key is missing." }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email using Zoho Zeptomail REST API
    const response = await fetch('https://api.zeptomail.in/v1.0/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczptapikey ${zeptomailKey}`
      },
      body: JSON.stringify({
        from: {
          address: smtpSender,
          name: "Aparox AI Contact Form"
        },
        to: [
          {
            email_address: {
              address: contactRecipient,
              name: "Aparox Support"
            }
          }
        ],
        reply_to: [
          {
            address: email,
            name: name
          }
        ],
        subject: `New Inquiry: ${name}`,
        htmlbody: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fafafa;">
            <h2 style="color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">New Contact Submission</h2>
            
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4b5563; width: 100px;">Name:</td>
                <td style="padding: 6px 0; color: #1f2937;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Email:</td>
                <td style="padding: 6px 0; color: #1f2937;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
              </tr>
            </table>
            
            <div style="margin-top: 25px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Message:</h4>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; color: #374151; white-space: pre-wrap; line-height: 1.5;">${message}</div>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">Sent automatically from Aparox AI Platform</p>
          </div>
        `
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("Zeptomail HTTP Error Response:", result)
      return new Response(
        JSON.stringify({ error: result.message || "Failed to deliver message via Zeptomail." }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ message: "Inquiry successfully submitted!" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Supabase Edge Function Exception:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
