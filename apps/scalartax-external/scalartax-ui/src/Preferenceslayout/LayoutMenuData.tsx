import React, { useEffect, useState } from 'react';

const Navdata = () => {
  const [isPreference, setIsPreference] = useState(false);
  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateIconSidebar(e: any) {
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
  }
  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');

    if (iscurrentState !== 'Preference') {
      setIsPreference(false);
    }
  }, [iscurrentState, isPreference]);

  const menuItems: any = [
    {
      label: '',

      isHeader: true,
    },
    {
      id: 'Preferences',
      label: 'Dashboard',
      icon: 'las la-house-damage',
      link: '/dashboard',
    },
    {
      label: '',

      isHeader: true,
    },
    {
      id: 'subscrption',
      label: 'Subscrptions',
      icon: 'bx bx-credit-card fs-15 align-middle me-1',
      link: '/subscriptions',
    },
    {
      label: '',

      isHeader: true,
    },
    
    {
      id: 'pereference',

      label: 'Preferences',
      icon: 'las la-cog',
      link: '/#',
      click: function (e: any) {
        e.preventDefault();
        setIsPreference(!isPreference);
        setIscurrentState('Preference');
        updateIconSidebar(e);
      },
      stateVariables: isPreference,
      subItems: [
        {
          id: 'general',
          label: 'General',
          link: '/preferences/general',

          parentId: 'prefrence',
        },
        {
          id: 'privacy',
          label: 'Privacy & Security',

          link: '/preferences/privacy',
          parentId: 'prefrence',
        },

        {
          id: 'display',
          label: 'Theme Settings',
          link: '/preferences/theme',

          parentId: 'preference',
        },
      ],
    },
  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
