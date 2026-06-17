import { prisma } from "@/lib/prisma"; // Import Prisma client for database operations
import nodemailer from "nodemailer"; // Import Nodemailer to send emails

// Handle POST request for sending OTP email
export async function POST(req: Request) {
  try {
    // Extract email from request body
    const { email } = await req.json();

    // Validate email input
    if (!email) {
      return Response.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (5 minutes from now)
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP in database
    // If user exists → update OTP
    // If user does not exist → create user record
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

    // Create email transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Sender email
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Send OTP email
    await transporter.sendMail({
      // Email sender information
      from: `"CineTrack" <${process.env.EMAIL_USER}>`,

      // Receiver email
      to: email,

      // Email subject
      subject: `${otp} is your CineTrack verification code 🎬`,

      // Plain text fallback for unsupported email clients
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,

      // Styled HTML email template
      html: `
        <!DOCTYPE html>
        <html>
        <head>

          <!-- Configure character encoding -->
          <meta charset="utf-8">

          <!-- Responsive email scaling -->
          <meta name="viewport" content="width=device-width, initial-scale=1.0">

          <style>

            /* Entire email body styling */
            body { 
              background-color: #09070f; 
              color: #eae7f2; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              text-align: center; 
              padding: 40px 10px; 
              margin: 0; 
              -webkit-font-smoothing: antialiased;
            }

            /* Main email card */
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

            /* Logo container */
            .logo-wrapper {
              text-align: center;
              margin-bottom: 35px;
            }

            /* Brand logo */
            .logo { 
              font-size: 26px; 
              font-weight: 900; 
              color: #ffffff; 
              letter-spacing: 3px; 
              text-transform: uppercase; 
              display: inline-block;
            }

            /* Highlight color for logo text */
            .logo span { 
              color: #ED80E9; 
            }

            /* Main heading */
            .title { 
              color: #ffffff; 
              font-size: 22px; 
              font-weight: 800; 
              margin-bottom: 12px; 
              letter-spacing: -0.5px;
            }

            /* Description text */
            .text { 
              color: #b3aed1; 
              font-size: 14px; 
              line-height: 1.6; 
              margin-bottom: 30px; 
              margin-top: 0;
            }

            /* OTP display box */
            .otp-container {
              background: linear-gradient(135deg, #181429 0%, #1e1933 100%);
              border: 1px solid #362f54;
              border-radius: 14px;
              padding: 24px;
              text-align: center;
              margin-bottom: 25px;
            }

            /* OTP number styling */
            .otp-code { 
              font-size: 42px; 
              font-weight: 800; 
              color: #ED80E9; 
              letter-spacing: 8px; 
              margin: 0; 
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
              text-shadow: 0 0 20px rgba(237, 128, 233, 0.2);
            }

            /* Footer styling */
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

            <!-- Brand section -->
            <div class="logo-wrapper">
              <div class="logo">Cine<span>Track</span></div>
            </div>

            <!-- Email title -->
            <div class="title">Verification Code</div>

            <!-- Email description -->
            <p class="text">
              Confirm your identity to securely access your workspace.
            </p>

            <!-- OTP display -->
            <div class="otp-container">
              <h1 class="otp-code">${otp}</h1> 
            </div>

            <!-- Expiry warning -->
            <p style="color: #9b94be; font-size: 13px; text-align: center;">
              ⏳ This verification link expires in <strong>5 minutes</strong>.
            </p>

            <!-- Footer -->
            <div class="footer">
              Ignore this email if you did not request it.
            </div>

          </div>

        </body>
        </html>
      `,
    });

    // Return success response
    return Response.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    // Log server error
    console.error("SEND OTP ERROR:", error);

    // Return failure response
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
