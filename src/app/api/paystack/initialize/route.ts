import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function POST(request: NextRequest) {
    try {
        if (!PAYSTACK_SECRET_KEY) {
            return NextResponse.json(
                { status: false, message: 'Paystack secret key not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { email, amount, reference, callback_url, metadata } = body;

        // Validate required fields
        if (!email || !amount) {
            return NextResponse.json(
                { status: false, message: 'Email and amount are required' },
                { status: 400 }
            );
        }

        // Call Paystack Initialize Transaction API
        const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount, // Amount in kobo
                reference,
                callback_url,
                metadata,
                currency: 'NGN',
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            return NextResponse.json(
                { status: false, message: paystackData.message || 'Failed to initialize transaction' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            status: true,
            message: 'Transaction initialized',
            data: paystackData.data,
        });

    } catch (error: any) {
        console.error('Paystack initialization error:', error);
        return NextResponse.json(
            { status: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
