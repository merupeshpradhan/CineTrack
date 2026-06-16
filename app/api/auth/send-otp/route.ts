import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    // 1. Generate a secure 6-digit OTP string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Set an expiration timestamp (5 minutes from now)
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    // 3. Save directly to the User model using an upsert action
    await prisma.user.upsert({
      where: { email },
      update: {
        otp: otp,
        otpExpiry: expiryTime,
      },
      create: {
        email,
        otp: otp,
        otpExpiry: expiryTime,
      },
    });

    // 4. Configure your Nodemailer transport setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Send out the generated verification code via email with your custom styling template
    await transporter.sendMail({
      from: `"CineTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${otp} is your CineTrack verification code 🎬`,
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`, // Plain text fallback

      // HIGH-CONTRAST ULTRA PREMIUM METROPOLIS DESIGN LAYER
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              background-color: #09070f; 
              color: #eae7f2; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              text-align: center; 
              padding: 40px 10px; 
              margin: 0; 
              -webkit-font-smoothing: antialiased;
            }
            .container { 
              max-width: 460px; 
              margin: 0 auto; 
              background-color: #120f1d; 
              border: 1px solid #252038; 
              border-radius: 20px; 
              padding: 45px 35px; 
              box-shadow: 0 30px 60px rgba(0,0,0,0.6); 
              text-align: left;
            }
            .logo-wrapper {
              text-align: center;
              margin-bottom: 35px;
            }
            .logo { 
              font-size: 26px; 
              font-weight: 900; 
              color: #ffffff; 
              letter-spacing: 3px; 
              text-transform: uppercase; 
              display: inline-block;
            }
            .logo span { 
              color: #ED80E9; 
            }
            .title { 
              color: #ffffff; 
              font-size: 22px; 
              font-weight: 800; 
              margin-bottom: 12px; 
              letter-spacing: -0.5px;
            }
            .text { 
              color: #b3aed1; 
              font-size: 14px; 
              line-height: 1.6; 
              margin-bottom: 30px; 
              margin-top: 0;
            }
            .otp-container {
              background: linear-gradient(135deg, #181429 0%, #1e1933 100%);
              border: 1px solid #362f54;
              border-radius: 14px;
              padding: 24px;
              text-align: center;
              margin-bottom: 25px;
            }
            .otp-code { 
              font-size: 42px; 
              font-weight: 800; 
              color: #ED80E9; 
              letter-spacing: 8px; 
              margin: 0; 
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
              text-shadow: 0 0 20px rgba(237, 128, 233, 0.2);
            }
            .footer { 
              margin-top: 40px; 
              font-size: 12px; 
              color: #615a80; 
              border-top: 1px solid #211c33; 
              padding-top: 24px; 
              line-height: 1.5; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Center Aligned Header Brand Signature -->
            <div class="logo-wrapper">
              <div class="logo">Cine<span>Track</span></div>
            </div>

            <div class="title">Verification Code</div>
            <p class="text">Confirm your identity to securely access your workspace. Copy and paste this authorization code into your active browser tab window.</p>
            
            <!-- Styled High Contrast Code Presenter Panel -->
            <div class="otp-container">
              <h1 class="otp-code">${otp}</h1> 
            </div>
            
            <!-- FIXED SPACING WARNING PARAGRAPH -->
            <p style="color: #9b94be; font-size: 13px; text-align: center; margin: 20px 0 10px 0; padding: 0; line-height: 1.4;">
              ⏳ This verification link is temporary and will automatically expire in&nbsp;<strong>5 minutes</strong>.
            </p>

            <div class="footer">
              This message was sent automatically upon an access request matching your account credentials. If you did not make this action request, please ignore this email.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return Response.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
