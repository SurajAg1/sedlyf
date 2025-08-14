import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const data = await req.json(); // Parse the request body
    const { emailTemplate, shippingInfo } = data;

    // Configure Nodemailer (use your email credentials or service)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: shippingInfo.email || process.env.EMAIL_USER, // Use customer's email if provided
      subject: "Order Confirmation - Your T-Shirt Store",
      html: emailTemplate, // Use the HTML template
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}