#!/bin/bash

# CVPS Processor Endpoints Test Script
# Tests all 8 CVPS processor endpoints
# Version: 2.0
# Last Updated: 2025-08-02
# 
# Usage: ./test-cvps-endpoints.sh [environment]
# Environments: local (default), dev, prod
#
# Requirements:
# - curl installed
# - jq installed (optional, for pretty output)

set -e

# Parse environment argument
ENV="${1:-local}"

# Configuration based on environment
case "$ENV" in
    local)
        BASE_URL="http://localhost:5050/api/cvps"
        API_KEY="cvps-dev-key-2025"
        SITE_ID="latitude36.com.au"
        ;;
    dev)
        BASE_URL="https://api.latitude36.com.au/api/cvps"
        API_KEY="cvps-dev-key-2025"
        SITE_ID="latitude36.com.au"
        ;;
    prod)
        BASE_URL="https://l36.com.au/api/cvps"
        API_KEY="cvps-prod-key-2025"
        SITE_ID="latitude36.com.au"
        ;;
    *)
        echo "Invalid environment: $ENV"
        echo "Usage: $0 [local|dev|prod]"
        exit 1
        ;;
esac

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}CVPS Processor Endpoints Test${NC}"
echo -e "${BLUE}Environment: ${YELLOW}$ENV${NC}"
echo -e "${BLUE}Base URL: ${YELLOW}$BASE_URL${NC}"
echo -e "${BLUE}================================${NC}\n"

# Function to test endpoint
test_endpoint() {
    local endpoint="$1"
    local description="$2"
    local expected_status="${3:-200}"
    
    TOTAL=$((TOTAL + 1))
    
    echo -e "${BLUE}Testing:${NC} $description"
    echo -e "  Endpoint: ${YELLOW}$endpoint${NC}"
    
    # Make request with authentication headers
    response=$(curl -s -w "\n%{http_code}" -X GET \
        -H "X-API-Key: $API_KEY" \
        -H "X-Site-ID: $SITE_ID" \
        "$BASE_URL$endpoint" 2>/dev/null)
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    
    # Extract body (all except last line)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "  Status: ${GREEN}✓ $status_code${NC}"
        
        # Check if response has success flag
        if echo "$body" | grep -q '"success":true' 2>/dev/null; then
            echo -e "  Response: ${GREEN}✓ Valid JSON with success:true${NC}"
        else
            echo -e "  Response: ${YELLOW}⚠ Check response structure${NC}"
        fi
        
        PASSED=$((PASSED + 1))
        echo -e "  ${GREEN}✓ PASSED${NC}\n"
    else
        echo -e "  Status: ${RED}✗ $status_code (expected $expected_status)${NC}"
        echo -e "  ${RED}✗ FAILED${NC}\n"
        FAILED=$((FAILED + 1))
    fi
}

# Test all 8 endpoints
echo -e "${BLUE}Starting endpoint tests...${NC}\n"

# 1. Health Check
test_endpoint "/health" "Health Check"

# 2. Homepage
test_endpoint "/homepage" "Homepage Content"

# 3. Products (no params)
test_endpoint "/products" "Products List"

# 4. Products (with search)
test_endpoint "/products?search=honey" "Products Search"

# 5. Products (with category)
test_endpoint "/products?category=honey" "Products by Category"

# 6. Products (with pagination)
test_endpoint "/products?page=2&per_page=10" "Products Pagination"

# 7. Blog Posts
test_endpoint "/blog" "Blog Posts (default limit)"

# 8. Blog Posts (with limit)
test_endpoint "/blog?limit=5" "Blog Posts (limit=5)"

# 9. Categories
test_endpoint "/categories" "Category Hierarchy"

# 10. Newsletter
test_endpoint "/newsletter" "Newsletter Configuration"

# 11. Galleries List
test_endpoint "/galleries" "Galleries List"

# 12. Galleries (with limit)
test_endpoint "/galleries?limit=5" "Galleries (limit=5)"

# 13. Single Gallery (example slug)
test_endpoint "/galleries/farm-life" "Single Gallery"

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Total Tests: ${YELLOW}$TOTAL${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed${NC}"
    exit 1
fi