import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/layout/AppShell';
import AnalysisDashboard from './pages/AnalysisDashboard';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppShell>
        <AnalysisDashboard />
      </AppShell>
      <Toaster />
    </ThemeProvider>
  );
}
