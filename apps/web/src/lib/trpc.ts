import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/trpc`,
      headers: () => {
        const token = localStorage.getItem('token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
