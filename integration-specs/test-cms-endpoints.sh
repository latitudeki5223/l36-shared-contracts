#!/bin/bash

# CMS API Endpoint Test Script
# Tests all CMS endpoints with proper authentication
# Usage: ./test-cms-endpoints.sh [local|dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV="${1:-local}"
case $ENV in
    local)
        BASE_URL="http://localhost:5050"
        API_KEY="l36-cms-dev-2025"
        ;;
    dev)
        BASE_URL="https://api-latitude36.com.au"
        API_KEY="l36-cms-dev-2025"
        ;;
    prod)
        BASE_URL="https://api.latitude36.com.au"
        API_KEY="l36-cms-prod-2025"
        ;;
    *)
        echo "Usage: $0 [local|dev|prod]"
        exit 1
        ;;
esac

echo -e "${BLUE}=== CMS API Endpoint Tests ===${NC}"
echo -e "Environment: ${YELLOW}$ENV${NC}"
echo -e "Base URL: $BASE_URL"
echo ""

# Test results
TOTAL=0
PASSED=0
FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local data=$3
    local expected_status=$4
    local description=$5
    local auth_header=$6
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "Testing $method $path - $description... "
    
    # Build curl command
    CURL_CMD="curl -s -w '\n%{http_code}' -X $method"
    CURL_CMD="$CURL_CMD -H 'Content-Type: application/json'"
    
    # Add auth header if provided
    if [ -n "$auth_header" ]; then
        CURL_CMD="$CURL_CMD -H '$auth_header'"
    else
        CURL_CMD="$CURL_CMD -H 'X-API-Key: $API_KEY'"
    fi
    
    # Add data if provided
    if [ -n "$data" ]; then
        CURL_CMD="$CURL_CMD -d '$data'"
    fi
    
    CURL_CMD="$CURL_CMD $BASE_URL$path"
    
    # Execute and get response
    RESPONSE=$(eval $CURL_CMD 2>/dev/null || echo "CURL_ERROR")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    # Check status code
    if [ "$HTTP_CODE" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} ($HTTP_CODE)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} (Expected $expected_status, got $HTTP_CODE)"
        if [ -n "$BODY" ]; then
            echo "  Response: $BODY" | head -n 1
        fi
        FAILED=$((FAILED + 1))
    fi
}

echo -e "${YELLOW}=== Commerce Module Tests ===${NC}"

# Checkout endpoints
test_endpoint "POST" "/api/cms/commerce/checkout/calculate" \
    '{"items":[{"price":10,"quantity":2}],"shipping_method":"standard"}' \
    "200" "Calculate checkout totals"

# Order endpoints
test_endpoint "POST" "/api/cms/commerce/orders/lookup" \
    '{"email":"test@example.com","order_number":"L36-2025-0001"}' \
    "404" "Order lookup (not found expected)"

test_endpoint "GET" "/api/cms/commerce/orders/999999" \
    "" \
    "404" "Get order details (not found expected)"

echo ""
echo -e "${YELLOW}=== Customer Module Tests ===${NC}"

# Customer endpoints
test_endpoint "POST" "/api/cms/customers/create-or-get" \
    '{"email":"test@example.com","first_name":"Test","last_name":"User"}' \
    "200" "Create or get customer"

test_endpoint "GET" "/api/cms/customers/1" \
    "" \
    "200" "Get customer details"

# Newsletter endpoints
test_endpoint "POST" "/api/cms/customers/newsletter/subscribe" \
    '{"email":"newsletter@example.com","source":"test"}' \
    "200" "Newsletter subscription"

test_endpoint "GET" "/api/cms/customers/newsletter/unsubscribe/invalid-token" \
    "" \
    "404" "Newsletter unsubscribe (invalid token)"

echo ""
echo -e "${YELLOW}=== Wholesale Module Tests ===${NC}"

# Test wholesale login
echo -n "Testing wholesale login... "
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"cliffords","password":"cliffords2025"}' \
    $BASE_URL/api/cms/customers/wholesale/login 2>/dev/null)

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓${NC}"
    PASSED=$((PASSED + 1))
    
    # Extract JWT token
    JWT_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    # Test authenticated endpoints
    test_endpoint "GET" "/api/cms/customers/wholesale/pricing" \
        "" \
        "200" "Get wholesale pricing" \
        "Authorization: Bearer $JWT_TOKEN"
    
    test_endpoint "GET" "/api/cms/customers/wholesale/orders" \
        "" \
        "200" "Get wholesale orders" \
        "Authorization: Bearer $JWT_TOKEN"
    
    test_endpoint "GET" "/api/cms/customers/wholesale/account" \
        "" \
        "200" "Get wholesale account" \
        "Authorization: Bearer $JWT_TOKEN"
else
    echo -e "${RED}✗${NC} (Login failed)"
    FAILED=$((FAILED + 1))
fi

TOTAL=$((TOTAL + 4))

echo ""
echo -e "${YELLOW}=== Marketing Module Tests ===${NC}"

# These require admin auth, so they should return 401
test_endpoint "GET" "/api/cms/marketing/newsletter/export" \
    "" \
    "401" "Export newsletter (admin required)"

test_endpoint "GET" "/api/cms/marketing/newsletter/stats" \
    "" \
    "401" "Newsletter stats (admin required)"

test_endpoint "POST" "/api/cms/marketing/newsletter/manual-subscribe" \
    '{"email":"admin-add@example.com"}' \
    "401" "Manual subscribe (admin required)"

echo ""
echo -e "${YELLOW}=== Admin Module Tests ===${NC}"

# Admin endpoints (should return 401 without proper admin auth)
test_endpoint "GET" "/api/cms/admin/orders" \
    "" \
    "401" "List orders (admin required)"

test_endpoint "PATCH" "/api/cms/admin/orders/1/status" \
    '{"status":"shipped"}' \
    "401" "Update order status (admin required)"

test_endpoint "PATCH" "/api/cms/admin/orders/1/tracking" \
    '{"tracking_number":"AP123456789AU"}' \
    "401" "Add tracking number (admin required)"

echo ""
echo -e "${BLUE}=== Webhook Tests ===${NC}"

# Webhook endpoints (these need proper signatures, so expect errors)
test_endpoint "POST" "/api/cms/commerce/webhooks/stripe" \
    '{"type":"payment_intent.succeeded"}' \
    "400" "Stripe webhook (signature required)"

test_endpoint "POST" "/api/cms/commerce/webhooks/paypal" \
    '{"event_type":"PAYMENT.CAPTURE.COMPLETED"}' \
    "400" "PayPal webhook (verification required)"

echo ""
echo -e "${BLUE}=== Test Summary ===${NC}"
echo -e "Total tests: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed${NC}"
    exit 1
fi