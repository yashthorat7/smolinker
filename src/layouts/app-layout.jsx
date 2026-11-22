import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';

const AppLayout = () => {
  const { user, showTable, toggleTable, setSession } = useAuth();
  const location = useLocation();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden px-4 selection:bg-orange-500/30 selection:text-white">
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-6 text-[14px]">
        <Link 
          to="/" 
          className="font-medium text-white tracking-tight select-none hover:text-zinc-300 transition-colors duration-200"
        >
          smolinker
        </Link>

        <nav className="flex items-center gap-5 text-[14px]">
          {user ? (
            <>
              {location.pathname === '/' && (
                <button 
                  type="button"
                  onClick={toggleTable}
                  className={`transition-colors duration-200 cursor-pointer outline-none select-none ${
                    showTable ? 'text-orange-400 font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Toggle shortened links"
                >
                  {showTable ? 'hide links' : 'links'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSession(null)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 cursor-pointer outline-none select-none"
                title={`Signed in as ${user.email}. Click to sign out.`}
              >
                sign out
              </button>
            </>
          ) : (
            location.pathname !== '/auth' && (
              <Link 
                to="/auth" 
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                sign in
              </Link>
            )
          )}
        </nav>
      </header>

      <div className="relative z-10 flex-1 flex flex-col">
        <Outlet />
      </div>
    </main>
  );
};

export default AppLayout;
