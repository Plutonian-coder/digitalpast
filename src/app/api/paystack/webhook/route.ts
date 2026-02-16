import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Verify webhook signature from Paystack
function verifyWebhookSignature(body: string, signature: string): boolean {
    if (!PAYSTACK_SECRET_KEY) return false;
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex');
    return hash === signature;
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-paystack-signature') || '';

        // Verify the webhook is genuinely from Paystack
        if (!verifyWebhookSignature(rawBody, signature)) {
            console.error('Webhook signature verification failed');
            return NextResponse.json(
                { status: false, message: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event = JSON.parse(rawBody);

        console.log('Paystack webhook received:', event.event);

        // Handle different event types
        switch (event.event) {
            case 'charge.success': {
                const data = event.data;
                console.log('Payment successful:', {
                    reference: data.reference,
                    amount: data.amount,
                    email: data.customer.email,
                    plan: data.metadata?.plan_id,
                    userId: data.metadata?.user_id,
                });

                // TODO: Update user subscription in Supabase
                // This is where you'd call Supabase to:
                // 1. Record the payment in a `payments` table
                // 2. Update or create a `subscriptions` record
                // 3. Upgrade the user's plan

                break;
            }

            case 'charge.failed': {
                const data = event.data;
                console.log('Payment failed:', {
                    reference: data.reference,
                    email: data.customer.email,
                });
                break;
            }

            case 'transfer.success': {
                console.log('Transfer successful:', event.data);
                break;
            }

            case 'transfer.failed': {
                console.log('Transfer failed:', event.data);
                break;
            }

            default:
                console.log('Unhandled event type:', event.event);
        }

        // Always respond with 200 to acknowledge receipt
        return NextResponse.json({ status: true, message: 'Webhook received' });

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        // Still return 200 to prevent Paystack from retrying
        return NextResponse.json({ status: true, message: 'Webhook received' });
    }
}
