import { ReactNode } from 'react';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: 'url(/assets/generated/bg-dashboard-texture.dim_1600x900.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/otc-signal-lab-logo.dim_512x512.png" 
                alt="OTC Signal Lab" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight">OTC Signal Lab</h1>
                <p className="text-xs text-muted-foreground">1-Minute Binary Trading Analyzer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated && userProfile && (
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="text-foreground font-medium">{userProfile.name}</span>
                </span>
              )}
              <LoginButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Built with ❤️ using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
