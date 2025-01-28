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
    role: string;
    refreshToken: string;
    numberOfEventsHosted: number;
    numberOfEventsAttended: number;
    bio: string;
    userImage: string;
    country: string;
    state: string;
    address: string;
    subscriptionPlan: string;
    accountStatus: string;
    interests: any;
    isVerified: boolean;
    isBlacklisted: boolean;
    noOfFollowers: number;
    noOfFollowings: number;
    otp: Record<string, any>;
    subScriptionId: string;
    subscriptionDetails: subscriptionDetails;
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
    attendees: string[];
    description: string;
    date: Date;
    startTime: Date;
    duration: string;
    cost: number;
    eventAd: string;
    coverImage: string;
    hostJoinTime: string;
    endTime: string;
    noOfLikes: number;
    noOfDislikes: number;
    likers: string[]
    dislikers: string[]
    isHosting: boolean;
    isHosted: boolean;
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
  