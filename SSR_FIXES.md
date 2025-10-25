# SSR Fixes Applied

## Issue
The application was throwing "window is not defined" errors during Server-Side Rendering (SSR). This is a common issue when Vue components or composables try to access browser APIs like `window`, `document`, or `localStorage` during the server-side rendering phase.

## Root Cause
Several composables and components were accessing browser APIs without checking if they were running in a browser environment:

1. **ScrollToTop.vue** - Accessing `window.matchMedia` during initialization
2. **useYouTubeConsent.ts** - Accessing `localStorage` without guards
3. **useModal.ts** - Accessing `document.body` without guards
4. **YouTubeEmbed.vue** - Using undefined `event` variable

## Fixes Applied

### 1. ScrollToTop.vue
**Problem**: `window.matchMedia` was called during component initialization, before checking if window exists.

**Solution**:
- Moved `prefersReducedMotion` to a ref and set it in `onMounted`
- Added `typeof window === 'undefined'` check at the start of `onMounted`
- Added SSR guards to `scrollToTop()` and `handleScroll()` functions
- Changed `scrollBehavior` to a computed property

**Code Changes**:
```typescript
// Before (SSR error)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// After (SSR safe)
const prefersReducedMotion = ref(false);
const scrollBehavior = computed(() => prefersReducedMotion.value ? 'auto' : 'smooth');

onMounted(() => {
  if (typeof window === 'undefined') return;
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ... rest of code
});
```

### 2. useYouTubeConsent.ts
**Problem**: `localStorage` and `document` were accessed without SSR guards.

**Solution**:
- Added `typeof window === 'undefined'` checks before accessing `localStorage`
- Added `typeof document === 'undefined'` check in `loadIframe`
- Early return from functions if running on server

**Code Changes**:
```typescript
// Before (SSR error)
const checkConsent = () => {
  hasConsent.value = localStorage.getItem(STORAGE_KEY) === 'true';
  return hasConsent.value;
};

// After (SSR safe)
const checkConsent = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  hasConsent.value = localStorage.getItem(STORAGE_KEY) === 'true';
  return hasConsent.value;
};
```

### 3. useModal.ts
**Problem**: `document.body` and `document.addEventListener` were accessed without SSR guards.

**Solution**:
- Wrapped all `document` access in `typeof document !== 'undefined'` checks
- Ensured event listeners are only added/removed in browser environment

**Code Changes**:
```typescript
// Before (SSR error)
const open = () => {
  isOpen.value = true;
  document.body.style.overflow = 'hidden';
};

// After (SSR safe)
const open = () => {
  isOpen.value = true;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};
```

### 4. YouTubeEmbed.vue
**Problem**: Using undefined `event` variable in event handlers.

**Solution**:
- Added proper event parameter to `onImageLoad` and `onImageError` functions
- Added SSR guard to `loadIframeIntoContainer`

**Code Changes**:
```typescript
// Before (error)
const onImageLoad = () => {
  const img = event?.target as HTMLImageElement;
  if (img) img.style.opacity = '1';
};

// After (fixed)
const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img) img.style.opacity = '1';
};
```

## SSR Best Practices Applied

1. **Always check for browser environment** before accessing browser APIs:
   - `typeof window !== 'undefined'` for window APIs
   - `typeof document !== 'undefined'` for document APIs
   - `typeof localStorage !== 'undefined'` for localStorage

2. **Use lifecycle hooks** for browser-only code:
   - `onMounted()` - Runs only in browser
   - `onUnmounted()` - Cleanup in browser

3. **Move initialization to appropriate lifecycle**:
   - Browser-specific initialization → `onMounted()`
   - Server-safe initialization → `<script setup>` top level

4. **Use reactive state** for values that depend on browser APIs:
   - Ref for values set in `onMounted`
   - Computed for derived values

## Testing

To verify SSR works correctly:

1. **Build the application**:
   ```bash
   pnpm run build
   ```

2. **Preview the production build**:
   ```bash
   pnpm run preview
   ```

3. **Check server logs** for any SSR errors

4. **Verify hydration** - components should hydrate without errors in browser console

## Components Affected

- ✅ `src/components/ui/ScrollToTop.vue`
- ✅ `src/composables/useYouTubeConsent.ts`
- ✅ `src/composables/useModal.ts`
- ✅ `src/components/YouTubeEmbed.vue`

All components now properly handle SSR while maintaining full browser functionality.
