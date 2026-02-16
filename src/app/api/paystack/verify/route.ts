import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function GET(request: NextRequest) {
    try {
        if (!PAYSTACK_SECRET_KEY) {
            return NextResponse.json(
                { status: false, message: 'Paystack secret key not configured' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json(
                { status: false, message: 'Transaction reference is required' },
                { status: 400 }
            );
        }

        // Call Paystack Verify Transaction API
        const paystackResponse = await fetch(
            `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            return NextResponse.json(
                { status: false, message: paystackData.message || 'Failed to verify transaction' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            status: true,
            message: 'Transaction verified',
            data: paystackData.data,
        });

    } catch (error: any) {
        console.error('Paystack verification error:', error);
        return NextResponse.json(
            { status: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
