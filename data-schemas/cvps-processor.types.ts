/**
 * CVPS Processor TypeScript Type Definitions
 * 
 * Version: 3.2 - Fixed Price Type Consistency
 * Last Updated: 2025-01-22
 * 
 * These types define the complete API contract between MVPS CVPS Processor
 * and the CVPS frontend at latitude36.com.au
 */

// ===== COMMON TYPES =====

export interface BaseResponse {
  success: boolean;
  cached_at: string;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface MediaImage {
  url: string;  // Relative path starting with /media/
  alt: string;
}

export interface MediaVideo {
  url: string;  // Relative path starting with /media/
  poster?: string;
  autoplay?: boolean;
}

export interface ProductImages {
  main: MediaImage | null;
  thumbnails: MediaImage[];
}

export interface ProductVideos {
  id: string;
  url: string;
  title: string;
  duration?: number;
  provider: 'direct' | 'youtube' | 'vimeo';
  thumbnail?: string;
  poster?: string;
  variants?: {
    optimized?: {
      url: string;
      platform: string;
      resolution?: string;
    };
  };
  streamingUrls?: {
    hls?: string;
    dash?: string;
  };
}

export interface Price {
  website: number | null;
  wholesale: number | null;
}

// ===== TAGGING SYSTEM TYPES =====

export interface TagCategory {
  name: string;
  description: string;
  color: string;  // Hex color code
  tags: string[];
}

export interface ProductTagMetadata {
  [categoryName: string]: string[];
}

export interface FilterOptions {
  tags: string[];
  tag_categories: TagCategory[];
  price_range: {
    min: number;
    max: number;
    average: number;
  };
}

export interface SearchParams {
  q?: string;
  tags: string[];
  categories: string[];
  priceRange: {
    min?: number;
    max?: number;
  };
  sortBy?: 'name' | 'price' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// ===== PRODUCT TYPES =====

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  is_primary?: boolean;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  price: Price;
  category: {
    name: string;
    slug: string;
  };
  images: ProductImages;
  videos: ProductVideos[];
  isActive: boolean;
  // Enhanced tagging fields
  tags: string[];
  searchTerms: string[];
  tagCategories: ProductTagMetadata;
}

export interface ProductDetail extends ProductSummary {
  number: string;
  categories: ProductCategory[];
  primaryCategory: ProductCategory | null;
}

export interface ProductsResponse extends BaseResponse {
  products: ProductSummary[];
  pagination: PaginationInfo;
  filters?: FilterOptions;
}

export interface ProductSearchResponse extends BaseResponse {
  products: ProductSummary[];
  pagination: PaginationInfo;
  filters: FilterOptions;
  searchParams: SearchParams;
}

export interface SingleProductResponse extends BaseResponse {
  product: ProductDetail;
}

// ===== HOMEPAGE TYPES =====

export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: MediaImage;
  backgroundVideo?: MediaVideo;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
}

export interface WelcomeBanner {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface Features {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface TestimonialItem {
  text: string;
  author: string;
  role: string;
  location: string;
}

export interface Testimonials {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface CategoryGrid {
  title: string;
  subtitle: string;
}

export interface FeaturedProducts {
  title: string;
  subtitle: string;
}

export interface BlogSection {
  title: string;
  subtitle: string;
}

export interface PressSection {
  title: string;
}

export interface SEOData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface HomepageData {
  hero: HeroSection;
  textSlider: {
    text: string;
  };
  welcomeBanner: WelcomeBanner;
  features: Features;
  testimonials: Testimonials;
  categoryGrid: CategoryGrid;
  featuredProducts: FeaturedProducts;
  blogSection: BlogSection;
  pressSection: PressSection;
  seo: SEOData;
}

export interface HomepageResponse extends BaseResponse {
  data: HomepageData;
  version: string;
}

// ===== BLOG TYPES =====

export interface BlogSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: MediaImage;
  publishedAt: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
}

export interface BlogDetail extends BlogSummary {
  content: any;  // Rich content object
  updatedAt: string;
  galleries: Array<{ id: number }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface BlogResponse extends BaseResponse {
  posts: BlogSummary[];
  total: number;
}

export interface SingleBlogResponse extends BaseResponse {
  post: BlogDetail;
}

// ===== CATEGORY TYPES =====

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  level: number;
  productCount: number;
  children: CategorySummary[];
}

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  level: number;
  description: string;
  image: string | null;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    product_count: number;
  }>;
}

export interface CategoryProduct {
  id: number;
  name: string;
  slug: string;
  number: string;
  shortDescription: string;
  price: number | null;  // NOTE: Category products return website price as single number
  mainImage: string | null;
  thumbnail: string | null;
  isActive: boolean;
  // Include tags for category products
  tags: string[];
  searchTerms: string[];
}

export interface CategoriesResponse extends BaseResponse {
  categories: CategorySummary[];
}

export interface SingleCategoryResponse extends BaseResponse {
  category: CategoryDetail;
  products: CategoryProduct[];
  total: number;
}

// ===== NEWSLETTER TYPES =====

export interface NewsletterSettings {
  enabled: boolean;
  doubleOptIn: boolean;
  confirmationRequired: boolean;
}

export interface NewsletterContent {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
  settings: NewsletterSettings;
}

export interface NewsletterResponse extends BaseResponse {
  content: NewsletterContent;
}

// ===== GALLERY TYPES =====

export interface GalleryImage {
  id: number;
  url: string;  // Relative path starting with /media/
  alt: string;
  caption: string;
  order: number;
  dimensions?: {
    width: number;
    height: number;
  };
  fileType?: string;
  size?: number;  // File size in bytes
  aspectRatio?: number;
}

export interface GallerySummary {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageCount: number;
  images: GalleryImage[];
}

export interface GalleryDetail extends GallerySummary {
  layout: string;
  columns: number;
  showCaptions: boolean;
  spacing: string;
  publishedAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface GalleriesResponse extends BaseResponse {
  galleries: GallerySummary[];
  total: number;
}

export interface SingleGalleryResponse extends BaseResponse {
  gallery: GalleryDetail;
}

// ===== HEALTH CHECK TYPES =====

export interface CacheStats {
  enabled: boolean;
  type: string;
  hit_rate?: number;
  memory_usage?: number;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  service: 'cvps_processor';
  database: 'connected' | 'disconnected';
  cache: CacheStats;
  version: string;
  endpoints_available: number;
  features: string[];
  timestamp: string;
}

// ===== ERROR TYPES =====

export interface ErrorResponse {
  error: string;
  message: string;
  code: number;
  details?: any;
  service?: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  details: {
    [field: string]: string[];
  };
}

// ===== API CLIENT INTERFACES =====

export interface CVPSProcessorClient {
  // Homepage
  getHomepage(): Promise<HomepageResponse>;
  
  // Products
  getProducts(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
  }): Promise<ProductsResponse>;
  
  searchProducts(params: {
    q?: string;
    search?: string;
    tags?: string[];
    categories?: string[];
    price_min?: number;
    price_max?: number;
    page?: number;
    per_page?: number;
    sort_by?: 'name' | 'price' | 'created' | 'popularity';
    sort_order?: 'asc' | 'desc';
  }): Promise<ProductSearchResponse>;
  
  getProductById(id: number): Promise<SingleProductResponse>;
  getProductBySlug(slug: string): Promise<SingleProductResponse>;
  
  // Blog
  getBlogPosts(params?: { limit?: number }): Promise<BlogResponse>;
  getBlogPostById(id: number): Promise<SingleBlogResponse>;
  getBlogPostBySlug(slug: string): Promise<SingleBlogResponse>;
  
  // Categories
  getCategories(): Promise<CategoriesResponse>;
  getCategoryById(id: number): Promise<SingleCategoryResponse>;
  getCategoryBySlug(slug: string): Promise<SingleCategoryResponse>;
  
  // Newsletter
  getNewsletterContent(): Promise<NewsletterResponse>;
  
  // Galleries
  getGalleries(params?: { limit?: number }): Promise<GalleriesResponse>;
  getGalleryBySlug(slug: string): Promise<SingleGalleryResponse>;
  
  // Health
  getHealth(): Promise<HealthResponse>;
}

// ===== FRONTEND HOOK TYPES =====

export interface UseProductSearchOptions {
  initialQuery?: string;
  initialTags?: string[];
  initialCategories?: string[];
  initialPriceRange?: { min?: number; max?: number };
  autoSearch?: boolean;
}

export interface UseProductSearchReturn {
  // State
  products: ProductSummary[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: FilterOptions;
  searchParams: SearchParams;
  
  // Actions
  search: (query: string) => void;
  setTags: (tags: string[]) => void;
  setCategories: (categories: string[]) => void;
  setPriceRange: (range: { min?: number; max?: number }) => void;
  setSorting: (sortBy: string, sortOrder: string) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
  
  // Computed
  hasFilters: boolean;
  resultCount: number;
}

export interface UseProductTagsReturn {
  // Available tags organized by category
  tagCategories: TagCategory[];
  allTags: string[];
  
  // Selected tags
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  
  // Tag utilities
  getTagsInCategory: (categoryName: string) => string[];
  getTagCategory: (tag: string) => TagCategory | null;
  clearTags: () => void;
}

// ===== COMPONENT PROP TYPES =====

export interface ProductCardProps {
  product: ProductSummary;
  onClick?: (product: ProductSummary) => void;
  showTags?: boolean;
  showPrice?: boolean;
  showCategory?: boolean;
}

export interface ProductFilterProps {
  filters: FilterOptions;
  searchParams: SearchParams;
  onSearchChange: (query: string) => void;
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onPriceRangeChange: (range: { min?: number; max?: number }) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onClearFilters: () => void;
}

export interface TagSelectorProps {
  tagCategories: TagCategory[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  showCategories?: boolean;
}

export interface PriceRangeFilterProps {
  priceRange: { min: number; max: number; average: number };
  selectedRange: { min?: number; max?: number };
  onRangeChange: (range: { min?: number; max?: number }) => void;
}

// ===== UTILITY TYPES =====

export type SortField = 'name' | 'price' | 'created' | 'popularity';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  query?: string;
  tags: string[];
  categories: string[];
  priceRange: { min?: number; max?: number };
  sortBy: SortField;
  sortOrder: SortOrder;
}

// ===== CACHE TYPES =====

export interface CacheKey {
  endpoint: string;
  params: Record<string, any>;
}

export interface CachedResponse<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

// ===== ENVIRONMENT CONFIGURATION =====

export interface CVPSEnvironmentConfig {
  apiBaseUrl: string;
  mediaBaseUrl: string;
  apiKey: string;
  siteId: string;
  cacheTimeout: number;
  retryAttempts: number;
}

export const DEFAULT_CVPS_CONFIG: CVPSEnvironmentConfig = {
  apiBaseUrl: 'http://localhost:5050/api/cvps',
  mediaBaseUrl: 'http://localhost:5050',
  apiKey: 'cvps-dev-key-2025',
  siteId: 'latitude36.com.au',
  cacheTimeout: 300000, // 5 minutes
  retryAttempts: 3
};

// ===== EXPORT ALL TYPES =====

export * from './cvps-processor.types';

// Version information
export const CVPS_API_VERSION = '3.2';
export const SUPPORTED_FEATURES = [
  'product_tagging',
  'enhanced_search',
  'price_filtering',
  'multi_category_support',
  'tag_categories',
  'relative_urls',
  'cache_headers',
  'pagination',
  'sorting'
] as const;

export type CVPSFeature = typeof SUPPORTED_FEATURES[number];