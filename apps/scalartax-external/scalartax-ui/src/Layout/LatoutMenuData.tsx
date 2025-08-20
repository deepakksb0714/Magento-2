/* eslint-disable @typescript-eslint/prefer-for-of */
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Navdata = () => {
  const navigate = useNavigate();
  const [isInvoiceManagement, setIsInvoiceManagement] = useState(false);
  const [isSales, setIsSales] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthentication, setIsAuthentication] = useState(false);
  const [isExemptions, setIsExemptions] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isReturns, setIsReturns] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isProducts, setIsProducts] = useState(false);
  const [isCustomers, setIsCustomers] = useState(false);
  const [isCertificates, setIsCertificates] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [isEntity, setIsEntity] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isNexus, setIsNexus] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateSubMenu(item: any) {
    try {
      const svgElement = item?.querySelector('svg'); // Get current transform
      const currentTransform = window?.getComputedStyle(svgElement)?.transform;
      if (
        currentTransform === 'none' ||
        currentTransform === 'matrix(1, 0, 0, 1, 0, 0)'
      ) {
        // If no transform is applied or transform is 0 degrees (identity matrix), rotate to 90 degrees
        svgElement.style.transform = 'rotate(90deg)';
      } else {
        // Otherwise, reset to 0 degrees
        svgElement.style.transform = 'rotate(0deg)';
      }
      svgElement.style.transition = 'transform 0.3s ease-in-out';
    } catch (err) {
      console.log('error  ', err);
    }
  }
  function updateRest(elem: any) {
    try {
      const elems: HTMLElement | null = document.getElementById('navbar-nav');
      if (elems) {
        const children = elems.children;
        for (let i = 0; i < children.length; i++) {
          const navLink = children[i].getElementsByClassName(
            'nav-link second'
          )[0] as HTMLElement;
          if (navLink) {
            const svgElement = navLink.querySelector('svg');
            queueMicrotask(() => {
              if (navLink.nextElementSibling) {
                navLink.nextElementSibling.classList.remove('show');
              }
            });
            if (svgElement) {
              svgElement.style.transform = 'rotate(0deg)';
              svgElement.style.transition = 'transform 0.3s ease-in-out';
              // navLink.classList.remove('active');
              navLink.setAttribute('aria-expanded', "false");
            }
          }

          const anchor: HTMLElement | null = children[i].querySelector(
            'a.nav-link.menu-link.first'
          );
          if (anchor && anchor.nextElementSibling) {
            anchor.nextElementSibling.classList.remove('show');
          }
          if (anchor && !anchor.classList.contains('active')) {
            const svgElement = anchor.querySelector('svg');
            if (svgElement) {
              svgElement.style.transform = 'rotate(0deg)';
              // anchor.classList.remove('active');
            }
            queueMicrotask(() => {
              anchor.classList.remove('show');
            });
          }
          if (anchor) {
            const svgElement = anchor.querySelector('svg');
            if (svgElement) {
              svgElement.style.transform = 'rotate(0deg)';
              anchor.setAttribute('aria-expanded', "false");
              // anchor.classList.remove('active');
            }
          }
        }
      }
    } catch (err) { }
  }

  function updateIconSidebar(e: any) {
    try {
      updateRest(e.target);
      updateSubMenu(e.target.parentElement);
      if (e && e.target && e.target.getAttribute('sub-items')) {
        const ul: any = document.getElementById('two-column-menu');
        const iconItems: any = ul.querySelectorAll('.nav-icon.active');
        let activeIconItems = [...iconItems];
        activeIconItems.forEach((item) => {
          item.classList.remove('active');
          var id: any = item.getAttribute('sub-items');
          var menusId = document.getElementById(id);
          if (menusId) {
            (menusId.parentElement as HTMLElement).classList.remove('show');
          }
        });
        e.target.classList.add('active');
      }
    } catch { }
  }
  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');

    if (iscurrentState !== 'Invoice Management') {
      setIsInvoiceManagement(false);
    }

    if (iscurrentState !== 'Sales') {
      setIsSales(false);
    }

    if (iscurrentState !== 'Admin') {
      setIsAdmin(false);
    }

    if (iscurrentState !== 'Admin' && !isLocation) {
      setIsLocation(false);
    }

    if (iscurrentState !== 'Authentication') {
      setIsAuthentication(false);
    }
    if (iscurrentState !== 'Exemptions') {
      setIsExemptions(false);
    }
    if (iscurrentState !== 'Returns') {
      setIsReturns(false);
    }

    if (iscurrentState !== 'Pages') {
      setIsPages(false);
    }

    if (iscurrentState !== 'Orders') {
      setIsOrder(false);
    }

    if (iscurrentState !== 'Auth') {
      setIsAuth(false);
    }

    if (iscurrentState !== 'Reports') {
      setIsReports(false);
    }
    if (iscurrentState !== 'Dashboard') {
      setIsDashboard(false);
    }
  }, [
    iscurrentState,
    isSales,
    isAdmin,
    isOrder,
    isAuth,
    isProducts,
    isCustomers,
    isCertificates,
    isReport,
    isMultiLevel,
    isAuthentication,
    isPages,
    isDashboard,
  ]);

  const menuItems: any = [
    {
      label: '',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'las la-house-damage',
      link: '/dashboard',
      click: function (e: any) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState('Dashboard');
        updateIconSidebar(e);
        navigate('/dashboard');
      },
    },
    {
      label: '',
      isHeader: true,
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: 'las la-chart-line',
      link: '/#',
      click: function (e: any) {
        e.preventDefault();
        setIsSales(!isSales);
        setIscurrentState('Sales');
        updateIconSidebar(e);
      },
      stateVariables: isSales,

      subItems: [
        {
          id: 'transaction',
          label: 'Transaction',
          link: '/transaction-list',
          parentId: 'admin',
        },
        // { id: 2, label: "Tax Calculator", link: "/calculate_tax"},
        // { id: 3, label: 'Calculator', link: '/calculate_tax' },
      ],
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: 'las la-user-cog',
      link: '/#',
      click: function (e: any) {
        e.preventDefault();
        setIsAdmin(!isAdmin);
        setIscurrentState('Admin');
        setIsLocation(false);
        updateIconSidebar(e);
      },
      stateVariables: isAdmin,
      subItems: [
        {
          id: 'nexus',
          label: 'Where you collect tax',
          link: '/nexus',
          parentId: 'admin',
        },
        {
          id: 'products',
          label: 'Products',
          link: '/product-list',
          parentId: 'products',
        },
        {
          id: 'user',
          label: 'Users',
          link: '/users',
          parentId: 'admin',
        },
        {
          id: 'entity',
          label: 'Entities',
          link: '/entities',
          parentId: 'admin',
        },
        {
          id: "customrules",
          label: "Custom Rules",
          link: "/tax-rules",
          parentId: "customrules"
        },
        {
          id: "location",
          label: "Locations",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            updateSubMenu(e.target);
            setIsLocation(!isLocation);
          },
          stateVariables: isLocation,
          childItems: [
            {
              id: 6,
              label: 'Locations',
              link: '/locations',
              parentId: 'admin',
            },
            {
              id: 7,
              label: 'Marketplaces',
              link: '/marketplaces',
              parentId: 'admin',
            },
            {
              id: 8,
              label: 'Add Location',
              link: '/add-location',
              parentId: 'admin',
            },
            {
              id: 9,
              label: 'Import Locations',
              link: '/import-locations',
              parentId: 'admin',
            },
            // { id: 10, label: "Export Locations", link: "/Export-locations", parentId: "admin" },
            {
              id: 11,
              label: 'Import history',
              link: '/import-locations-history',
              parentId: 'admin',
            },
          ],
        },
      ],
    },

    {
      id: 'exemptions',
      label: 'Exemptions',
      icon: 'las la-shield-alt',
      link: '/#',
      click: function (e: any) {
        e.preventDefault();
        setIsExemptions(!isExemptions);
        setIscurrentState('Exemptions');
        updateIconSidebar(e);
      },
      stateVariables: isExemptions,
      subItems: [
        {
          id: 'customers',
          label: 'Customers',
          link: '/customers',
          parentId: 'customers',
        },
        {
          id: 'certificates',
          label: 'Certificates',
          link: '/certificates',
          parentId: 'exemptions',
        },
      ],
    },

    {
      id: 'reports',
      label: 'Reports',
      icon: 'las la-newspaper',
      link: '/#',
      click: function (e: any) {
        e.preventDefault();
        setIsReports(!isReports);
        setIscurrentState('Reports');
        updateIconSidebar(e);
      },
      stateVariables: isReports,
      subItems: [
        {
          id: 'favorites',
          label: 'Favorites',
          link: '/favorites',
          parentId: 'reports',
        },
        {
          id: 'transaction_reports',
          label: 'Transaction reports',
          link: '/transaction-reports',
          parentId: 'reports',
        },
        {
          id: 'liability_&_tax_return_reports',
          label: 'Liability & tax return reports',
          link: '/liability-&-tax-return-reports',
          parentId: 'reports',
        },
        {
          id: 'exemption_reports',
          label: 'Exemption reports',
          link: '/exemption-reports',
          parentId: 'reports',
        },
      ],
    },

    {
      id: 'returns',
      label: 'Returns',
      icon: 'las la-undo',
      link: '/#',
      click: function (e: any) {
        e.preventDefault();
        setIsReturns(!isReturns);
        setIscurrentState('Returns');
        updateIconSidebar(e);
      },
      stateVariables: isReturns,
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
