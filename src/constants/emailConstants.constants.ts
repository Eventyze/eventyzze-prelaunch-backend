
enum MailSubjects {
  OTP = "Eventyzze OTP",
  WELCOME = "Welcome to Eventyzze",
  ACCOUNT = "Account Verification",
  LOGIN_ACTIVITY = "Activity Detected on Your Account",
  EVENT_CREATION = "Eventyzze Event Creation",
  TRANSACTION = "Transaction",
  PASSWORD_RESET_REQUEST = "Password Reset Request",
  SUCCESSFUL_PASSWORD_RESET = "Password Reset Successful"
}

const generateMessages = () => {
  return {
    OTP: (otp: string) => {
      return `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`;
    },
    WELCOME: (name: string) => {
      return `Welcome to Eventyzze, ${name}. We are excited to have you on board.`;
    },
    ACCOUNT_VERIFIED: () => {
      return `Welcome to Eventyzze, your email has been verified successfully. You can now login and start hosting your events 😊`;
    },
    NEW_USER_LOGIN: () => {
      return `<br /><br />

          We're excited to have you on board. Eventyzze is your go-to platform for discovering, organizing, and sharing amazing events. Whether you're attending or hosting, we're here to make your experience seamless and enjoyable. <br /> <br />

          If you have any questions or need help getting started, feel free to reach out to our support team. We're always here to assist you. <br /> <br />

          Let's make some unforgettable moments together!`;
    },
    EXISTING_USER_LOGIN: (fullName: string, date: string, time: string) => {
      return `Hi ${fullName ? fullName : ""},
      There was a login to your account on ${date} by ${time}.<br /><br /> If you did not initiate this login, contact our support team to restrict your account. If it was you, please ignore.`;
    },
    EVENT_CREATION: (userName: string) => {
        return `Hello ${userName}, your event has been created, please do not forget to join on the selected date`
    },
    REFUND_TRANSACTION_DESCRIPTION: (event_title:string) => {
        return `Refund from ${event_title} cancellation`
    },
    PASSWORD_RESET_OTP: (otp:string) => {
        return `Your password reset OTP is ${otp}. It expires in 5 minutes.`
    },
    PASSWORD_RESET_SUCCESSFUL: () => {
        return `Your password has been reset successfully.`
    }
  };
};

export default {
    MailSubjects,
  generateMessages,
};
