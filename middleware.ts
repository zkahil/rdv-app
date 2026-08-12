export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/vendeurs/:path*', '/produits/:path*', '/disponibilites/:path*', '/rendez-vous/:path*'],
};
