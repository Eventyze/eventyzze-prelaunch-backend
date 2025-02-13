//================= USER ================//
interface subscriptionDetails {
    type: string;
    hasPaid: boolean;
    dateOfPayment: Date;
    dateOfExpiry: Date;
    autoRenew: boolean;
}


export interface UserAttributes {
    id: string;
    phone: string;
    fullName: string;
    userName: string;
    eventyzzeId: string;
    email: string;
    isInitialHostingOfferExhausted: boolean;
    password:string;
    role: Roles;
    refreshToken: string;
    numberOfEventsHosted: number;
    numberOfEventsAttended: number;
    bio: string;
    userImage: string;
    country: string;
    state: string;
    address: string;
    subscriptionPlan: SubscriptionPlans;
    accountStatus: AccountStatus;
    interests: any;
    isVerified: boolean;
    isBlacklisted: boolean;
    isInitialProfileSetupDone: boolean;
    noOfFollowers: number;
    noOfFollowings: number;
    otp: Record<string, any>;
    subScriptionId: string;
    activeDeviceId: any;
    subscriptionDetails: subscriptionDetails;
    freeHoursLeft:number
    newlyUpgraded: boolean;
    provider: SignupProvider;
    oauthId:string;
    oauthAccessToken:string;
    oauthRefreshToken:string;
    oauthTokenExpiresAt:string;
}

export enum SignupProvider {
    Email = "email",
    Google = "google",
    Facebook = "facebook"
}

export enum Roles {
    User = "User",
    Host = "Host",
    Event = "Event",
    SuperAdmin = "SuperAdmin",
    FinanceAdmin = "FinanceAdmin",
    PeopleAdmin = "PeopleAdmin",
    ProcessAdmin = "ProcessAdmin"
}

export enum SubscriptionPlans {
    Free = "Free",
    Bronze = "Bronze",
    Silver = "Silver",
    Gold = "Gold",
    Platinum = "Platinum"
}

export enum AccountStatus {
    Active = "Active",
    Frozen = "Frozen",
    Deactivated = "Deactivated"
}



//===========OTP=============//

export interface OtpAttributes {
    id: string
    userId: string;
    otp: string;
    expiresAt: Date
    used: boolean
  }


//=============== WALLETS ================//

export interface WalletAttributes {
    id: string
    ownerId: string;
    totalBalance: number;
    ledgerBalance: number;
    walletType: string;
  }

//=============== FOLLOWERS && FOLLOWINGS =============//

export interface FollowerAttributes {
    id: string;
    userId: string;
    followers: string[];
}

export interface FollowingAttributes {
    id: string;
    userId: string;
    followings: string[];
}

//====================SUBSCRIPTION PLAN ================//

export interface SubscriptionPlanAttributes {
    id: string;
    permissions: string[];
    name: string;
    attendeeLimit: number;
    streamingLimitHours: number;
}


//================= EVENTS ======================//

export interface EventAttributes {
    id: string;
    eventTitle: string;
    userId: string;
    description: string;
    date: string;
    startTime: string;
    duration: string;
    cost: string;
    currency: string;
    eventAd: string;
    coverImage: string;
    hostJoinTime: string;
    endTime: string;
    noOfLikes: number;
    noOfDislikes: number;
    isLive: boolean;
    isHosted: boolean;
    dyteDetails: DyteDetials;
    videoUrl: string;
    category: string[]
    isRecorded: boolean;
    ownerName: string;
}

export interface DyteDetials {
    meetingId: string;
    meetingTitle: string;
    createdAt: Date;
    updatedAt: Date;
}



//================== SUNSCRIPTION TRANSACTIONS ===================//

export interface SubscriptionTransactionAttributes {
    id: string;
    userId: string;
    subscriptionPlanId: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    paymentMethod: "credit_card" | "bank_transfer" | "wallet" | "paypal"
    reference: string;
    autoRenew: boolean;
    dateOfPayment: Date;
    dateOfExpiry?: Date | null;
  }
  



//========================== TRANSACTIONS =========================//

export interface TransactionAttributes {
    id: string;
    // userId: string;
    amount: number;
    type: "credit" | "debit";
    status: "pending" | "completed" | "failed";
    reference: string;
    description: string;
    userUUId: string;
    userEventyzzeId: string;
    date: Date;
  }


//================================ PAYMENT ===========================//

export interface PaymentAttributes {
    id: string;
    userId: string;
    eventId: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    paymentMethod?: string;
    transactionId?: string;
    paidAt?: Date;
  }
  


//============================ ATTENDANCE ============================//
export interface AttendanceAttributes {
    id: string;
    userId: string;
    eventId: string;
    attendedAt?: Date;
  }
  
  