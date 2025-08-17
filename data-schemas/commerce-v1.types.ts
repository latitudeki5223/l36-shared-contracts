/**
 * L36 Commerce API TypeScript Types
 * Version: 1.0
 * Generated: 2025-01-16
 */

// ============================================
// Base Types
// ============================================

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  per_page: number;
}

// ============================================
// Payment Types
// ============================================

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number; // in cents
}

export interface CreateSessionRequest {
  cart_items: CartItem[];
  customer_email: string;
  payment_method: 'stripe' | 'paypal';
}

export interface PaymentSession {
  session_id: string;
  client_secret?: string;
  payment_method: 'stripe' | 'paypal';
}

export interface CartValidation {
  valid: boolean;
  errors: string[];
  total: number;
  tax: number;
  shipping: number;
}

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

// ============================================
// Order Types
// ============================================

export type OrderStatus = 'new' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type DeliveryMethod = 'standard' | 'express' | 'pickup' | 'international';

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_method: DeliveryMethod;
  tracking_number?: string;
  recipient_name?: string;
  company_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  packed_at?: string;
  shipped_at?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderLookupRequest {
  email: string;
  order_number: string;
}

// ============================================
// Customer Types
// ============================================

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  newsletter_opted_in: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressType = 'shipping' | 'billing';

export interface CustomerAddress {
  id: number;
  customer_id: number;
  type: AddressType;
  recipient_name?: string;
  company_name?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  is_default: boolean;
}

// ============================================
// Wholesale Types
// ============================================

export interface WholesaleLoginRequest {
  username: string;
  password: string;
}

export interface WholesaleLoginResponse {
  token: string;
  customer: Customer;
  pricing_tier: string;
}

export interface WholesalePrice {
  product_id: number;
  retail_price: number;
  wholesale_price: number;
  discount_percentage: number;
  minimum_quantity: number;
}

// ============================================
// Review Types
// ============================================

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface Review {
  id: number;
  customer_id: number;
  product_id: number;
  order_id?: number;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  moderation_status: ModerationStatus;
  helpful_votes: number;
  unhelpful_votes: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

export interface ReviewSubmission {
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment?: string;
  email: string;
  order_number?: string;
}

export type VoteType = 'helpful' | 'not_helpful';

export interface ReviewVoteRequest {
  vote_type: VoteType;
  email: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  verified_percentage: number;
  helpfulness_score: number;
}

// ============================================
// Email Types
// ============================================

export type EmailStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';
export type EmailCategory = 'transactional' | 'marketing' | 'system';

export interface EmailTemplate {
  id: number;
  template_key: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables: string[];
  category: EmailCategory;
  is_active: boolean;
}

export interface EmailQueueItem {
  id: number;
  customer_id?: number;
  template_id: number;
  email_to: string;
  email_cc?: string;
  email_bcc?: string;
  subject: string;
  status: EmailStatus;
  priority: number;
  scheduled_at?: string;
  sent_at?: string;
  attempts: number;
  error_message?: string;
}

export interface EmailPreferences {
  transactional: boolean; // Always true
  marketing: boolean;
  reviews: boolean;
  stock_alerts: boolean;
}

// ============================================
// Product Types
// ============================================

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface ProductStock {
  product_id: number;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_status: StockStatus;
  supplier_sku?: string;
}

// ============================================
// MYOB Types
// ============================================

export interface MYOBSyncResult {
  updated: number;
  created: number;
  errors: string[];
  last_sync: string;
}

export interface MYOBSale {
  order_id: string;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customer_email: string;
  total_amount: number;
}

// ============================================
// GDPR Types
// ============================================

export interface DataExport {
  customer_data: Customer;
  addresses: CustomerAddress[];
  orders: Order[];
  reviews: Review[];
  newsletter_status: boolean;
  exported_at: string;
}

export interface DataDeletionRequest {
  confirm: boolean;
}

export interface DataDeletionResult {
  deleted_records: {
    customer: boolean;
    addresses: number;
    orders: number;
    reviews: number;
    newsletter: boolean;
  };
}

// ============================================
// Admin Types
// ============================================

export interface DailyOrderReport {
  date: string;
  orders: Order[];
  totals: {
    count: number;
    revenue: number;
    average_order_value: number;
  };
  summary: {
    by_status: Record<OrderStatus, number>;
    by_payment: Record<PaymentStatus, number>;
  };
}

export interface ReviewAnalytics {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  verification_rate: number;
  average_rating: number;
}

export interface LowStockAlert {
  product_id: number;
  product_name: string;
  current_stock: number;
  threshold: number;
  sku: string;
}

// ============================================
// Newsletter Types
// ============================================

export interface NewsletterSubscriber {
  id: number;
  email: string;
  source: 'checkout' | 'signup_form' | 'manual';
  subscribed_at: string;
  unsubscribed_at?: string;
  is_active: boolean;
}

export interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}