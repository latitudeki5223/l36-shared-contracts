/**
 * CMS API TypeScript Type Definitions v1.0
 * Generated from CMS implementation for CVPS integration
 * Last Updated: 2025-08-19
 */

// ============================================
// Enums
// ============================================

export enum OrderStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum DeliveryMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP = 'pickup'
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  INVOICE = 'invoice'
}

// ============================================
// Commerce Types
// ============================================

export interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  product_id?: number;
  sku?: string;
}

export interface CheckoutSessionRequest {
  items: CheckoutItem[];
  email: string;
  payment_method: 'stripe' | 'paypal';
  success_url: string;
  cancel_url: string;
  shipping_method?: 'standard' | 'express' | 'pickup';
  discount_code?: string;
}

export interface CheckoutSessionResponse {
  session_id: string;
  session_url: string;
  payment_method: string;
  expires_at?: string;
}

export interface CheckoutCalculation {
  items: CheckoutItem[];
  shipping_method?: 'standard' | 'express' | 'pickup';
  discount_code?: string;
  shipping_address?: {
    postcode: string;
    state: string;
  };
}

export interface CheckoutTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  tax_details: {
    gst_amount: number;
    gst_included: boolean;
  };
}

// ============================================
// Order Types
// ============================================

export interface OrderLookupRequest {
  email: string;
  order_number: string;
}

export interface OrderItem {
  id?: number;
  product_id?: number;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  description?: string;
}

export interface OrderResponse {
  id?: number;
  order_number: string;
  customer_email: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_method?: DeliveryMethod;
  payment_method?: string;
  tracking_number?: string;
  tracking_url?: string;
  total_amount: number;
  subtotal_amount?: number;
  tax_amount?: number;
  shipping_cost?: number;
  discount_amount?: number;
  discount_code?: string;
  is_gift?: boolean;
  gift_message?: string;
  notes?: string;
  shipping_address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  timestamps?: {
    created_at: string | null;
    updated_at: string | null;
    paid_at: string | null;
    packed_at: string | null;
    shipped_at: string | null;
    estimated_delivery: string | null;
    actual_delivery: string | null;
  };
  myob_sync?: {
    invoice_number: string | null;
    invoice_uid: string | null;
    sync_status: string | null;
  };
  items: OrderItem[];
}

export interface OrderBySessionResponse {
  success: boolean;
  order: {
    id: number;
    order_number: string;
    customer_email: string;
    customer_name: string;
    status: string;
    payment_status: string;
    payment_method: string;
    total_amount: number;
    subtotal_amount: number;
    tax_amount: number;
    shipping_cost: number;
    discount_amount: number;
    currency: string;
    created_at: string | null;
    estimated_delivery: string | null;
    items: Array<{
      id: number;
      product_id: number | null;
      product_name: string;
      product_sku: string | null;
      quantity: number;
      unit_price: number;
      total_price: number;
      description: string;
      image_url: string | null;
    }>;
    shipping_address: {
      name: string;
      address_line_1: string;
      address_line_2: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      phone: string | null;
    } | null;
    tracking: {
      number: string | null;
      url: string | null;
      carrier: string | null;
    };
    email_confirmation_sent: boolean;
  };
}

// ============================================
// Customer Types
// ============================================

export interface Customer {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  is_wholesale: boolean;
  wholesale_discount?: number;
  payment_terms?: string;
  myob_customer_uid?: string;
  billing_address?: Address;
  shipping_address?: Address;
  created_at?: string;
  last_seen_at?: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface CreateCustomerRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  newsletter?: boolean;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  shipping_country?: string;
}

// ============================================
// Email Preference Types
// ============================================

export interface EmailPreferences {
  customer_id: number;
  email: string;
  preferences: {
    marketing_emails: boolean;
    order_updates: boolean;
    shipping_notifications: boolean;
    review_requests: boolean;
    newsletter: boolean;
    special_offers: boolean;
  };
  updated_at: string | null;
}

export interface EmailPreferencesUpdateRequest {
  preferences: {
    marketing_emails?: boolean;
    order_updates?: boolean;  // Note: Always true for transactional
    shipping_notifications?: boolean;  // Note: Always true for transactional
    review_requests?: boolean;
    newsletter?: boolean;
    special_offers?: boolean;
  };
}

export interface EmailHistoryItem {
  id: number;
  subject: string;
  type: string;
  type_display: string;
  sent_at: string | null;
  status: string;
  order?: {
    id: number;
    number: string;
    total: number;
    created_at: string;
  };
}

export interface EmailHistoryResponse {
  emails: EmailHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface UnsubscribeRequest {
  type?: 'all' | 'marketing' | 'newsletter' | 'reviews';
}

export interface UnsubscribeResponse {
  message: string;
  email: string;
  unsubscribed_types: string[];
  remaining_subscriptions?: string[];
}

export interface ReviewEligibilityResponse {
  can_review: boolean;
  message: string;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
  existing_review?: {
    id: number;
    rating: number;
    created_at: string;
  };
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
  customer: {
    id: number;
    company: string;
    contact: string;
    email: string;
    payment_terms: string;
    gets_wholesale_pricing: boolean;
  };
  message: string;
}

export interface WholesaleProduct {
  id: number;
  name: string;
  sku: string;
  description?: string;
  retail_price: number;
  wholesale_price: number;
  savings: number;
  savings_percentage: number;
  min_order_quantity: number;
  stock_quantity?: number;
  is_available: boolean;
  myob_sku?: string;
}

export interface WholesalePricingResponse {
  products: WholesaleProduct[];
  company: string;
  payment_terms: string;
  note: string;
}

export interface WholesaleOrder {
  id: number;
  order_number: string;
  created_at: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  items_count: number;
  myob_invoice_number?: string;
  payment_terms: string;
  due_date?: string;
}

export interface WholesaleOrdersResponse {
  orders: WholesaleOrder[];
  pagination: {
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
  summary: {
    total_orders: number;
    outstanding_balance: number;
    payment_terms: string;
    gets_wholesale_pricing: boolean;
  };
}

// ============================================
// Newsletter Types
// ============================================

export interface NewsletterSubscribeRequest {
  email: string;
  source: 'checkout' | 'signup_form' | 'footer' | 'manual';
  first_name?: string;
  last_name?: string;
}

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface NewsletterUnsubscribeResponse {
  email: string;
  unsubscribed: boolean;
  message: string;
}

export interface NewsletterStats {
  total_active: number;
  total_unsubscribed: number;
  subscribe_rate: number;
  sources: Record<string, number>;
  recent_activity: {
    subscriptions_30d: number;
    unsubscribes_30d: number;
  };
  segments: {
    customers: number;
    non_customers: number;
    wholesale: number;
  };
  export_ready: boolean;
  last_export_date?: string;
}

// ============================================
// Admin Types
// ============================================

export interface AdminOrderListResponse {
  orders: Array<{
    id: number;
    order_number: string;
    customer_email: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    total_amount: number;
    payment_method?: string;
    tracking_number?: string;
    created_at: string;
    shipped_at?: string;
    item_count: number;
    myob_sync_status?: string;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  tracking_number?: string;
}

export interface UpdateTrackingRequest {
  tracking_number: string;
}

// ============================================
// Webhook Types
// ============================================

export interface StripeWebhookEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

export interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: any;
  create_time: string;
  summary?: string;
}

// ============================================
// Error Response
// ============================================

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
}

// ============================================
// API Configuration
// ============================================

export interface CMSApiConfig {
  baseUrl: string;
  apiKey: string;
  headers?: Record<string, string>;
}

// ============================================
// Wholesale Accounts (Hardcoded)
// ============================================

export const WHOLESALE_ACCOUNTS = [
  { username: 'cliffords', company: 'Cliffords Honey Farm' },
  { username: 'kitourism', company: 'KI Tourism Alliance' },
  { username: 'kiliving', company: 'KI Living Honey' },
  { username: 'beekeepers', company: 'Island Beekeepers Co-op' },
  { username: 'adelaide', company: 'Adelaide Central Market' }
] as const;

export type WholesaleUsername = typeof WHOLESALE_ACCOUNTS[number]['username'];