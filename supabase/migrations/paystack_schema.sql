-- ============================================
-- Paystack Payment Integration Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Payments Table
-- Records every payment transaction from Paystack
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reference TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- Amount in kobo
    currency TEXT DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    channel TEXT, -- card, bank, ussd, etc.
    paid_at TIMESTAMPTZ,
    paystack_transaction_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscriptions Table
-- Tracks user subscription status
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'student', 'premium')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    transaction_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for payments
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Only the system (service role) can insert payments
-- But we'll also allow authenticated users to insert their own
CREATE POLICY "Users can insert own payments"
    ON payments FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 5. RLS Policies for subscriptions
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
    ON subscriptions FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
    ON subscriptions FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- 7. Auto-update timestamp trigger for subscriptions
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscription_timestamp
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_updated_at();

-- 8. Summary
-- After running this SQL:
-- - payments table: stores all Paystack transaction records
-- - subscriptions table: tracks active user plans
-- - RLS ensures users can only see/modify their own data
-- - Indexes optimize common queries
