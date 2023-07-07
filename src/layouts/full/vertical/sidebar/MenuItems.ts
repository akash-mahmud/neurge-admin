import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconGitMerge,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconShoppingCart,
  IconAperture,
  IconLayout,
  IconSettings,
  IconHelp,
  IconZoomCode,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconBorderStyle2,
  IconAppWindow
} from '@tabler/icons-react';
import { AddOutlined } from '@mui/icons-material';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Tasks',
    icon: IconAperture,
    href: '/',
    // chip: 'New',
    chipColor: 'secondary',
  
  },
  {
    id: uniqueId(),
    title: 'Category',
    icon: IconAperture,
    href: '/category',
        // chip: 'New',
    chipColor: 'secondary',

  },

  {
    navlabel: true,
    subheader: 'Product',
  },
  {
    id: uniqueId(),
    title: 'Products',
    icon: IconShoppingCart,
    href: '/products',
  
  },
  {
    id: uniqueId(),
    title: 'Addons',
    icon: AddOutlined,
    href: '/addons',
    children: [
   
      {
        id: uniqueId(),
        title: 'View',
        icon: IconPoint,
        href: '/addons',
      },
      {
        id: uniqueId(),
        title: 'Blog Caregory',
        icon: IconPoint,
        href: '/addon-blog-category',
      },
      {
        id: uniqueId(),
        title: 'Blogs',
        icon: IconPoint,
        href: '/blog',
      },
    ]
  },


















  //These lines commented for examples
  // {
  //   id: uniqueId(),
  //   title: 'Maintenance',
  //   icon: IconSettings,
  //   href: '/auth/maintenance',
  // },

  // {
  //   navlabel: true,
  //   subheader: 'Other',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Menu Level',
  //   icon: IconBoxMultiple,
  //   href: '/menulevel/',
  //   children: [
  //     {
  //       id: uniqueId(),
  //       title: 'Level 1',
  //       icon: IconPoint,
  //       href: '/l1',
  //     },
  //     {
  //       id: uniqueId(),
  //       title: 'Level 1.1',
  //       icon: IconPoint,
  //       href: '/l1.1',
  //       children: [
  //         {
  //           id: uniqueId(),
  //           title: 'Level 2',
  //           icon: IconPoint,
  //           href: '/l2',
  //         },
  //         {
  //           id: uniqueId(),
  //           title: 'Level 2.1',
  //           icon: IconPoint,
  //           href: '/l2.1',
  //           children: [
  //             {
  //               id: uniqueId(),
  //               title: 'Level 3',
  //               icon: IconPoint,
  //               href: '/l3',
  //             },
  //             {
  //               id: uniqueId(),
  //               title: 'Level 3.1',
  //               icon: IconPoint,
  //               href: '/l3.1',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

];

export default Menuitems;
