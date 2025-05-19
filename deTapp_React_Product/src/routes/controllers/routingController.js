
//   import { getCookie } from "../../../utilities/cookieServices/cookieServices";
//   import { isUserIdCookieName, titleCaseFirstWord } from "../../../utilities/generals";
//   import { decodeData } from "../../../utilities/securities/encodeDecode";

import { get } from "../../views/utilities/apiservices/apiServices";

// Cache for dynamic pages to avoid unnecessary API calls
let dynamicPagesCache = null;
let lastFetchTime = 0;

// Function to clear the cache and force a refresh on next call
export const clearDynamicPagesCache = () => {
  console.log("Clearing dynamic pages cache");
  dynamicPagesCache = null;
  lastFetchTime = 0;
};

export const getDynamicPages = async (forceRefresh = false) => {
    try {
      // Check if we have cached data and it's not a forced refresh
      const now = Date.now();
      const cacheAge = now - lastFetchTime;
      const cacheExpired = cacheAge > 60000; // Cache expires after 1 minute
      
      // Also check localStorage for new page creation
      const shouldRedirect = localStorage.getItem('redirectToNewPage');
      const newPagePath = localStorage.getItem('newPagePath');
      const newPageCreated = shouldRedirect === 'true' && newPagePath;
      
      // Force refresh if a new page was created
      const shouldForceRefresh = forceRefresh || newPageCreated;
      
      if (dynamicPagesCache && !shouldForceRefresh && !cacheExpired) {
        console.log("Using cached dynamic pages data");
        return dynamicPagesCache;
      }
      
      if (shouldForceRefresh) {
        console.log("Forcing refresh of dynamic pages due to new page creation or explicit request");
      } else if (cacheExpired) {
        console.log("Cache expired, fetching fresh dynamic pages data");
      } else {
        console.log("No cache available, fetching dynamic pages from API...");
      }
      
      // Send the GET request to the API endpoint
      const response = await get("gpt/getGeneratedPageDetails", "python");
      console.log("API response:", response);
      
      // Handle different response formats
      let pages = [];
      
      if (response && response.data) {
        // New API format with data property
        pages = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response
        pages = response;
      } else if (response && typeof response === 'object') {
        // Object response with potential data
        pages = response.pages || response.dynamicPages || [];
      }
      
      // Ensure we have an array
      if (!Array.isArray(pages)) {
        console.warn("Invalid dynamic pages format, expected array but got:", typeof pages);
        return [];
      }
      
      // Process and normalize the pages
      const processedPages = pages.map(page => {
        // Ensure page is an object
        if (!page || typeof page !== 'object') {
          return null;
        }
        
        // Extract route path and normalize it
        let routePath = page.routePath || '';
        
        // Ensure route path starts with a slash
        if (!routePath.startsWith('/')) {
          routePath = '/' + routePath;
        }
        
        // Remove trailing slash if present
        if (routePath.endsWith('/') && routePath.length > 1) {
          routePath = routePath.slice(0, -1);
        }
        
        // Determine file path based on available properties
        let filePath = page.file_path || '';
        
        if (!filePath && page.filePath) {
          filePath = page.filePath;
        } else if (!filePath) {
          // Generate a file path based on the route path
          const routeSegments = routePath.split('/').filter(Boolean);
          const lastSegment = routeSegments[routeSegments.length - 1] || 'index';
          filePath = `/views/generatedPages/${lastSegment}/${lastSegment}`;
        }
        
        // Return the normalized page object
        return {
          ...page,
          routePath,
          file_path: filePath
        };
      }).filter(Boolean); // Remove null entries
      
      // Filter out entries with empty route paths
      const validPages = processedPages.filter(page => page.routePath);
      
      console.log("Valid dynamic pages:", validPages);
      
      // Update the cache
      dynamicPagesCache = validPages;
      lastFetchTime = Date.now();
      
      return validPages;
    } catch (error) {
      console.error("Error fetching dynamic pages:", error);
      // Return empty array instead of throwing to prevent router from breaking
      return [];
    }
  };
  