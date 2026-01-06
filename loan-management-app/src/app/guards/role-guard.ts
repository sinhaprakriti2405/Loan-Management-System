import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const expectedRoles = route.data['roles'] as string[];
  const userRole = authService.getRole();

  if (authService.isLoggedIn() && expectedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

