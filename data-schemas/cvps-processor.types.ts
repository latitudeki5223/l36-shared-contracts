/**
 * CVPS Processor TypeScript Type Definitions
 * Version: 1.0
 * Last Updated: 2025-07-31
 */

// Common Types
export interface MediaItem {
  url: string;
  alt: string;
}

export interface VideoItem extends MediaItem {
  title: string;
  provider?: 'youtube' | 'vimeo' | 'direct';
  poster?: string;
  thumbnail?: string;
  duration?: number;
}

export interface CTAButton {
  text: string;
  link: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CacheInfo {
  cached_at: string;
  version?: string;
}

// Authentication
export interface CVPSAuthHeaders {
  'X-API-Key': string;
  'X-Site-ID': string;
}

// Homepage Types
export interface HomepageHero {
  title: string;
  subtitle: string;
  backgroundImage: MediaItem;
  backgroundVideo?: VideoItem;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
}

export interface TextSlider {
  text: string;
}

export interface WelcomeBanner {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface Features {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface Section {
  title: string;
  subtitle: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  image: MediaItem;
}

export interface Testimonials extends Section {
  items: TestimonialItem[];
}

export interface HomepageData {
  hero: HomepageHero;
  textSlider: TextSlider;
  welcomeBanner: WelcomeBanner;
  features: Features;
  categoryGrid: Section;
  featuredProducts: Section;
  testimonials: Testimonials;
  blogSection: Section;
  pressSection: Pick<Section, 'title'>;
  seo: SEOMetadata;
}

export interface HomepageResponse extends CacheInfo {
  success: boolean;
  data: HomepageData;
}

// Product Types
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage extends MediaItem {
  id: number;
  is_primary: boolean;
}

export interface ProductVideo extends VideoItem {
  id: number;
}

export interface ProductSize {
  size: string;
  price: number;
  weight: string;
}

export interface Recipe {
  id: number;
  name: string;
  percentage: number;
}

export interface RecipeGroup {
  id: number;
  name: string;
  serving_size: string;
  recipes: Recipe[];
}

export interface NutritionalInfo {
  energy: string;
  protein: string;
  fat_total: string;
  carbohydrates: string;
  [key: string]: string; // Allow additional nutritional fields
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  gross_weight: string;
  category: ProductCategory;
  images: ProductImage[];
  videos: ProductVideo[];
  sizes: ProductSize[];
  recipe_groups: RecipeGroup[];
  nutritional_info: NutritionalInfo;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse extends CacheInfo {
  success: boolean;
  products: Product[];
  pagination: PaginationInfo;
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
}

// Blog Types
export interface BlogAuthor {
  name: string;
  bio: string;
  avatar: MediaItem;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

// Blog content blocks for structured content
export interface TextBlock {
  type: 'text';
  content: string;
}

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

export interface ImageBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export interface VideoBlock {
  type: 'video';
  url: string;
  title: string;
  provider?: 'youtube' | 'vimeo' | 'direct';
  aspectRatio?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export type BlogContentBlock = TextBlock | HeadingBlock | ImageBlock | VideoBlock;

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string | BlogContentBlock[]; // Can be HTML string or block array
  author: BlogAuthor;
  featured_image: MediaItem;
  categories: BlogCategory[];
  tags: string[];
  seo: SEOMetadata;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogResponse extends CacheInfo {
  success: boolean;
  posts: BlogPost[];
  total: number;
}

export interface BlogQueryParams {
  limit?: number;
}

// Category Types
export interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id: number | null;
  image?: MediaItem;
  product_count: number;
  children: CategoryNode[];
}

export interface CategoriesResponse extends CacheInfo {
  success: boolean;
  categories: CategoryNode[];
}

// Newsletter Types
export interface NewsletterFormFields {
  emailPlaceholder: string;
  buttonText: string;
  successMessage: string;
  errorMessage: string;
}

export interface NewsletterContent {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  formFields: NewsletterFormFields;
  privacyText?: string;
  privacyLink?: string;
}

export interface NewsletterResponse extends CacheInfo {
  success: boolean;
  content: NewsletterContent;
}

// Gallery Types
export interface GalleryImage extends MediaItem {
  id: number;
  caption?: string;
  order: number;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: MediaItem;
  images: GalleryImage[];
  total_images: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface GalleriesResponse extends CacheInfo {
  success: boolean;
  galleries: Gallery[];
  total: number;
}

export interface GalleryResponse extends CacheInfo {
  success: boolean;
  gallery: Gallery;
}

export interface GalleryQueryParams {
  limit?: number;
}

// Error Response
export interface ErrorResponse {
  error: string;
  message: string;
  code: number;
  details?: Record<string, any>;
}

// Health Check
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  service: string;
  database: string;
  cache: {
    enabled: boolean;
    type?: string;
  };
  version: string;
  timestamp: string;
}

// Rate Limit Headers
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}

// Cache Headers
export interface CacheHeaders {
  'Cache-Control': string;
  'ETag': string;
  'X-Cache-Status': 'HIT' | 'MISS';
  'X-Cache-TTL': string;
  'Expires': string;
}

// API Client Interface
export interface CVPSApiClient {
  // Homepage
  getHomepage(): Promise<HomepageResponse>;
  
  // Products
  getProducts(params?: ProductQueryParams): Promise<ProductsResponse>;
  
  // Blog
  getBlogPosts(params?: BlogQueryParams): Promise<BlogResponse>;
  
  // Categories
  getCategories(): Promise<CategoriesResponse>;
  
  // Newsletter
  getNewsletterConfig(): Promise<NewsletterResponse>;
  
  // Galleries
  getGalleries(params?: GalleryQueryParams): Promise<GalleriesResponse>;
  getGalleryBySlug(slug: string): Promise<GalleryResponse>;
  
  // Health
  checkHealth(): Promise<HealthCheckResponse>;
}