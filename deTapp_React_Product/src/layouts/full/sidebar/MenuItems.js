import {
  IconLayoutDashboard, IconLogin, IconUser
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Table creation',
    icon: IconLayoutDashboard,
    href: '/table-creation',
  },
  {
    navlabel: true,
    subheader: 'User Management',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUser,
    href: '/users',
  },
  {
    id: uniqueId(),
    title: 'Roles',
    icon: IconUser,
    href: '/roles',
  },
  {
    id: uniqueId(),
    title: 'Role Permissons',
    icon: IconUser,
    href: '/role-permissions',
  },
  {
    navlabel: true,
    subheader: 'Menu Management',
  },
  {
    id: uniqueId(),
    title: 'Menu',
    icon: IconUser,
    href: '/menu',
  },
  {
    id: uniqueId(),
    title: 'SubMenu',
    icon: IconUser,
    href: '/subMenu',
  },
  {
    navlabel: true,
    subheader: 'Chat Interface',
  },
  {
    id: uniqueId(),
    title: 'Chat',
    icon: IconUser,
    href: '/auth/login',
  },
  {
    navlabel: true,
    subheader: 'Logout',
  },
  {
    id: uniqueId(),
    title: 'Logout',
    icon: IconLogin,
    href: '/auth/login',
  },
];

export default Menuitems;
