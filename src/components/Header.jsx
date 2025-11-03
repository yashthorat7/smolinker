import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Link2, LogOut } from 'lucide-react';
import { UrlState } from '@/context';
import useFetch from '@/hooks/use-fetch';
import { logout } from '@/utils/apiAuth';
import { PulseLoader } from 'react-spinners';

const Header = () => {
  const navigate = useNavigate();

  const { user, fetchUser } = UrlState();
  const { loading, fn: fnLogout } = useFetch(logout);

  return (
    <nav className="flex items-center justify-between py-4">
      <Link to="/">
        <div className="text-3xl font-extrabold text-zinc-800">SMOLINK</div>
      </Link>
      <div>
        {!user ? (
          <Button onClick={() => navigate('/auth')}>Login</Button>
        ) : loading ? (
          <PulseLoader className="mb-4" color="#000000" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.user_metadata?.profile_pic} className="object-fill" />
                <AvatarFallback>PA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard" className="flex">
                  <Link2 className="mr-2 h-4 w-4" />
                  My Links
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOut className="mr-0 h-4 w-4" />
                <span
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate('/');
                    });
                  }}
                >
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
