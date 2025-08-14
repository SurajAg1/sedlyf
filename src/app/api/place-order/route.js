import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const data = await req.json();

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
      from: "your-email@gmail.com",
      to: "your-email@gmail.com", // Replace with your email
      subject: "New Order Received",
      text: `Order Details:\n\n${JSON.stringify(data, null, 2)}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}