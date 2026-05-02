-- =========================================================
-- SAFE SEED FILE (MODULE 7: PAYMENT & ESCROW)
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Currency Rates
-- ---------------------------------------------------------
INSERT INTO currency_rates (base_currency, target_currency, exchange_rate, source_api)
VALUES
('USD', 'USD', 1.0, 'manual'),
('EUR', 'USD', 1.08, 'manual'),
('PKR', 'USD', 0.0036, 'manual');

-- ---------------------------------------------------------
-- 2. Wallets (ASSUMES users with id 1 and 2 exist)
-- ---------------------------------------------------------
INSERT INTO wallets (user_id, currency_code, available_balance)
VALUES
(1, 'USD', 1000),
(2, 'USD', 500);

-- ---------------------------------------------------------
-- 3. Payment Methods
-- ---------------------------------------------------------
INSERT INTO payment_methods (
    user_id, method_type, provider_name, account_title,
    account_number_masked, iban_or_wallet_id, country_code,
    is_verified, is_default
)
VALUES
(1, 'bank', 'HBL', 'Taha Salam', '****1234', 'PK00HBL123456789', 'PK', TRUE, TRUE),
(2, 'digital_wallet', 'PayPal', 'Client User', '****5678', 'client@paypal.com', 'US', TRUE, TRUE);

-- ---------------------------------------------------------
-- 4. Escrow Accounts (ASSUMES project id = 1 exists)
-- ---------------------------------------------------------
INSERT INTO escrow_accounts (
    project_id, client_user_id, freelancer_user_id,
    currency_code, total_amount, funded_amount, escrow_status
)
VALUES
(1, 2, 1, 'USD', 300, 300, 'funded');

-- ---------------------------------------------------------
-- 5. Milestone Payments (ASSUMES milestone id = 1 exists)
-- ---------------------------------------------------------
INSERT INTO milestone_payments (
    escrow_id, milestone_id, title, amount,
    approval_status, release_status
)
VALUES
(1, 1, 'Initial Milestone', 300, 'approved', 'not_released');

-- ---------------------------------------------------------
-- 6. Invoice
-- ---------------------------------------------------------
INSERT INTO invoices (
    invoice_number, milestone_payment_id, project_id,
    client_user_id, freelancer_user_id,
    gross_amount, platform_fee, tax_amount, net_amount,
    currency_code
)
VALUES
('INV-001', 1, 1, 2, 1, 300, 30, 0, 270, 'USD');

-- ---------------------------------------------------------
-- 7. Transaction
-- ---------------------------------------------------------
INSERT INTO transactions (
    wallet_id, escrow_id, invoice_id,
    sender_user_id, receiver_user_id,
    transaction_type, amount, currency_code, status
)
VALUES
(1, 1, 1, 2, 1, 'payment', 300, 'USD', 'completed');

-- ---------------------------------------------------------
-- 8. Withdrawal Request
-- ---------------------------------------------------------
INSERT INTO withdrawal_requests (
    user_id, wallet_id, payment_method_id,
    transaction_id, amount, net_amount, currency_code, status
)
VALUES
(1, 1, 1, 1, 200, 195, 'USD', 'pending');

-- ---------------------------------------------------------
-- 9. Refund Request (optional example)
-- ---------------------------------------------------------
INSERT INTO refund_requests (
    transaction_id, escrow_id, milestone_payment_id,
    requested_by, reason, refund_amount, status
)
VALUES
(1, 1, 1, 2, 'Client not satisfied', 50, 'pending');

-- ---------------------------------------------------------
-- 10. Platform Fee Log
-- ---------------------------------------------------------
INSERT INTO platform_fee_logs (
    transaction_id, project_id, fee_type,
    fee_percentage, fee_amount, currency_code
)
VALUES
(1, 1, 'service_fee', 0.10, 30, 'USD');

-- ---------------------------------------------------------
-- 11. Notification
-- ---------------------------------------------------------
INSERT INTO payment_notifications (
    transaction_id, recipient_id,
    notification_type, title, message
)
VALUES
(1, 1, 'payment', 'Payment Received', 'You have received a payment of $300');

COMMIT;