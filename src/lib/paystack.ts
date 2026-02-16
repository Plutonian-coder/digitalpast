// Paystack Integration Helper Library
// Handles client-side payment initialization and verification

export type PaystackPlan = {
    id: string;
    name: string;
    price: number; // in Naira
    priceInKobo: number; // Paystack expects kobo (price * 100)
    interval: 'monthly' | 'annually' | 'one-time';
    features: string[];
    popular?: boolean;
};

export type PaystackTransaction = {
    id: string;
    user_id: string;
    email: string;
    amount: number;
    currency: string;
    reference: string;
    status: 'pending' | 'success' | 'failed' | 'abandoned';
    plan_id: string;
    paystack_transaction_id?: string;
    authorization_url?: string;
    access_code?: string;
    paid_at?: string;
    created_at: string;
};

export type PaystackSubscription = {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'expired' | 'cancelled';
    starts_at: string;
    expires_at: string;
    transaction_reference: string;
    created_at: string;
};

// Available plans
export const PLANS: PaystackPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        priceInKobo: 0,
        interval: 'monthly',
        features: [
            'Browse all past questions',
            'View question details',
            'Save up to 5 questions',
            'Basic search & filters',
        ],
    },
    {
        id: 'student',
        name: 'Student',
        price: 20000,
        priceInKobo: 2000000,
        interval: 'annually',
        popular: true,
        features: [
            'Everything in Free',
            'Unlimited downloads',
            'Unlimited saved questions',
            'Priority access to new uploads',
            'Download history tracking',
            'Advanced search filters',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 50000,
        priceInKobo: 5000000,
        interval: 'annually',
        features: [
            'Everything in Student',
            'Full year access',
            'Exclusive study materials',
            'Early access to solutions',
            'Priority support',
            'Ad-free experience',
        ],
    },
];

// Generate a unique transaction reference
export function generateReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `DPQP_${timestamp}_${random}`.toUpperCase();
}

// Initialize a transaction via our API route
export async function initializePayment({
    email,
    amount,
    planId,
    userId,
    callbackUrl,
}: {
    email: string;
    amount: number; // in kobo
    planId: string;
    userId: string;
    callbackUrl: string;
}): Promise<{
    success: boolean;
    data?: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
    error?: string;
}> {
    try {
        const reference = generateReference();

        const response = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                amount,
                reference,
                callback_url: callbackUrl,
                metadata: {
                    plan_id: planId,
                    user_id: userId,
                    custom_fields: [
                        {
                            display_name: 'Plan',
                            variable_name: 'plan',
                            value: planId,
                        },
                    ],
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to initialize payment' };
        }

        return {
            success: true,
            data: {
                authorization_url: result.data.authorization_url,
                access_code: result.data.access_code,
                reference: reference,
            },
        };
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error' };
    }
}

// Verify a transaction via our API route
export async function verifyPayment(reference: string): Promise<{
    success: boolean;
    data?: {
        status: string;
        amount: number;
        currency: string;
        reference: string;
        paid_at: string;
        channel: string;
        transaction_id: number;
    };
    error?: string;
}> {
    try {
        const response = await fetch(`/api/paystack/verify?reference=${reference}`);
        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to verify payment' };
        }

        return {
            success: true,
            data: {
                status: result.data.status,
                amount: result.data.amount,
                currency: result.data.currency,
                reference: result.data.reference,
                paid_at: result.data.paid_at,
                channel: result.data.channel,
                transaction_id: result.data.id,
            },
        };
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error' };
    }
}

// Format price in Naira
export function formatNaira(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
}
