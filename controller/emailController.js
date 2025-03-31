import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", //email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  export const sendAppointmentConfirmationEmail = async (
    email,
    userName,
    doctorName,
    appointmentDate,
    timeSlot,
    location,
    method
  ) => {
    const formattedDate = formatDate(appointmentDate);
    const emailContent =
      method === "Online"
        ? `
          <h3>Hello ${userName},</h3>
          <p>Your <b>online</b> appointment with <b>Dr. ${doctorName}</b> has been confirmed.</p>
          <p><b>Date:</b> ${formattedDate}</p>
          <p><b>Time:</b> ${timeSlot}</p>
          <p><b>Mode:</b> Online</p>
          <p>You will receive a link to join the online session before your appointment.</p>
          <br>
          <p>Thank you for choosing our service!</p>
        `
        : `
          <h3>Hello ${userName},</h3>
          <p>Your <b>offline</b> appointment with <b>Dr. ${doctorName}</b> has been confirmed.</p>
          <p><b>Date:</b> ${formattedDate}</p>
          <p><b>Time:</b> ${timeSlot}</p>
          <p><b>Location:</b> ${location}</p>
          <p>Please arrive at the clinic 10 minutes before your appointment.</p>
          <br>
          <p>Thank you for choosing our service!</p>
        `;
  
    await sendEmail(email, "Appointment Confirmation", emailContent);
  };
  
  export const sendAppointmentCancellationEmail = async (
    email,
    userName,
    doctorName,
    appointmentDate,
    timeSlot,
    location
  ) => {
    const formattedDate = formatDate(appointmentDate);
    const emailContent = `
      <h3>Hello ${userName},</h3>
      <p>We regret to inform you that your appointment at${location} with <b>Dr. ${doctorName}</b> on <b>${formattedDate}</b> at <b>${timeSlot}</b> has been cancelled.</p>
      <p>If you need to reschedule, please book a new appointment at your convenience or contact our helpline </p>
      <br>
      <p>We apologize for any inconvenience caused.</p>
    `;
  
    await sendEmail(email, "Appointment Cancellation", emailContent);
  };
  
  const sendEmail = async (email, subject, htmlContent) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: htmlContent,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`${subject} email sent successfully to`, email);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  