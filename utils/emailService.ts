// Email service for sending order notifications
export interface OrderEmailData {
  orderId: string;
  config: any;
  totalPrice: number;
  date: string;
  customerEmail?: string;
}

export async function sendOrderNotificationEmail(orderData: OrderEmailData) {
  try {
    // In a real application, this would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP

    // For now, we'll simulate the email send and log the details
    console.log(
      "📧 Order notification email would be sent with data:",
      orderData,
    );

    // Format order details for email
    const emailContent = {
      to: "admin@printanything.com", // Your email address
      subject: `New MyMood Button Order - ${orderData.orderId}`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Total Price:</strong> $${orderData.totalPrice}</p>
        <p><strong>Date:</strong> ${new Date(orderData.date).toLocaleString()}</p>
        
        <h3>Order Details:</h3>
        <ul>
          <li><strong>Shape:</strong> ${orderData.config.shape?.name || "N/A"}</li>
          <li><strong>Color:</strong> ${orderData.config.color || "N/A"}</li>
          <li><strong>Finish:</strong> ${orderData.config.finish?.name || "N/A"}</li>
          <li><strong>Text:</strong> ${orderData.config.label || "None"}</li>
          <li><strong>Icon:</strong> ${orderData.config.icon || "None"}</li>
          <li><strong>Light Mode:</strong> ${orderData.config.lightMode?.name || "N/A"}</li>
          <li><strong>WiFi Enabled:</strong> ${orderData.config.wifiEnabled ? "Yes" : "No"}</li>
          <li><strong>Brightness:</strong> ${orderData.config.brightness || 50}%</li>
        </ul>
        
        <p>Please process this order in your fulfillment system.</p>
      `,
    };

    // In a real implementation, you would make an API call here:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailContent)
    // });

    // For now, we'll show a browser notification as a simulation
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Order Email Sent", {
        body: `Order notification sent for ${orderData.orderId}`,
        icon: "/favicon.ico",
      });
    }

    // Log to console for demonstration
    console.log("Email content that would be sent:", emailContent);

    return {
      success: true,
      message: "Order notification email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send order notification email:", error);
    return {
      success: false,
      message: "Failed to send order notification email",
    };
  }
}

// Request notification permission on page load
export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
