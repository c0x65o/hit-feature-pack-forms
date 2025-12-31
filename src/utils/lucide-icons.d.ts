/**
 * Type declarations for direct lucide-react icon imports.
 * 
 * lucide-react doesn't provide individual type declarations for each icon file,
 * but all icons have the same LucideProps interface.
 */
declare module 'lucide-react/dist/esm/icons/*' {
  import { LucideProps } from 'lucide-react';
  const Icon: React.FC<LucideProps>;
  export default Icon;
}
