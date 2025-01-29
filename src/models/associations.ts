import User from "./users/usersModel";
import Events from "./events/eventsModel";
import Wallet from "./wallets/walletModel";
import Otp from "./otp/otpModel";
import Followers from "./followers/followersModel";
import Followings from "./followings/followingsModel";
import Attendance from "./attendance/attendanceModel";
import Payment from "./payment/paymentModel";
import Like from "./likes/likesModel";
import Dislike from "./dislikes/dislikesModel";


// **User ↔ Likes**
User.hasMany(Like, { foreignKey: "userId", as: "userLikes" });
Like.belongsTo(User, { foreignKey: "userId", as: "liker" });

// **User ↔ Dislikes**
User.hasMany(Dislike, { foreignKey: "userId", as: "userDislikes" });
Dislike.belongsTo(User, { foreignKey: "userId", as: "disliker" });

// **Events ↔ Likes**
Events.hasMany(Like, { foreignKey: "eventId", as: "eventLikes" });
Like.belongsTo(Events, { foreignKey: "eventId", as: "likedEvent" });

// **Events ↔ Dislikes**
Events.hasMany(Dislike, { foreignKey: "eventId", as: "eventDislikes" });
Dislike.belongsTo(Events, { foreignKey: "eventId", as: "dislikedEvent" });

// **User ↔ Payments**
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "payer" });

// **Events ↔ Payments**
Events.hasMany(Payment, { foreignKey: "eventId", as: "eventPayments" });
Payment.belongsTo(Events, { foreignKey: "eventId", as: "paidEvent" });

// **User ↔ Attendance**
User.hasMany(Attendance, { foreignKey: "userId", as: "attendances" });
Attendance.belongsTo(User, { foreignKey: "userId", as: "attendee" });

// **Events ↔ Attendance**
Events.hasMany(Attendance, { foreignKey: "eventId", as: "eventAttendances" });
Attendance.belongsTo(Events, { foreignKey: "eventId", as: "attendedEvent" });

// User ↔ OTP
User.hasMany(Otp, { foreignKey: "userId", as: "userOtp" });
Otp.belongsTo(User, { foreignKey: "userId", as: "otpUser" });

// User ↔ Wallet
User.hasOne(Wallet, { foreignKey: "ownerId", as: "wallet" });
Wallet.belongsTo(User, { foreignKey: "ownerId", as: "walletUser" });

// User ↔ Followers
User.hasOne(Followers, { foreignKey: "userId", as: "userFollowers" });
Followers.belongsTo(User, { foreignKey: "userId", as: "followerUser" });

// User ↔ Followings
User.hasOne(Followings, { foreignKey: "userId", as: "userFollowings" });
Followings.belongsTo(User, { foreignKey: "userId", as: "followingUser" });

// User ↔ Events
User.hasMany(Events, { foreignKey: "userId", as: "userEvents" });
Events.belongsTo(User, { foreignKey: "userId", as: "events" });

// Events ↔ Wallet
Events.hasOne(Wallet, { foreignKey: "ownerId", as: "eventWallet" });
Wallet.belongsTo(Events, { foreignKey: "ownerId", as: "walletEvent" });