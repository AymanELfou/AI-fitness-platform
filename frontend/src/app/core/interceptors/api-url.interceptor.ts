import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Intercept requests targeting the hardcoded localhost API URL
  if (req.url.startsWith('http://localhost:8082')) {
    let newUrl = req.url;
    
    if (isPlatformServer(platformId)) {
      // During Server-Side Rendering (SSR), use the internal Kubernetes service URL
      // This avoids hairpin routing issues by keeping traffic inside the cluster
      const backendUrl = (typeof process !== 'undefined' && process.env['API_URL']) 
        ? process.env['API_URL'] 
        : 'http://backend-service:8082';
      
      newUrl = req.url.replace('http://localhost:8082', backendUrl);
    } else {
      // In the browser, point to the public IP of the Azure VM
      newUrl = req.url.replace('http://localhost:8082', 'http://172.162.243.16:8082');
    }
    
    const apiReq = req.clone({ url: newUrl });
    return next(apiReq);
  }
  
  return next(req);
};
