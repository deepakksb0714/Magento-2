import React, { useEffect, useState } from "react";

const Navdata = () => {
    //state data
    const [isInvoiceManagement, setIsInvoiceManagement] = useState(false);

    const [isAuthentication, setIsAuthentication] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isProducts, setIsProducts] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [isTransaction, setIsTransaction] = useState(false);
    
  



    const [isOrder, setIsOrder] = useState(false);
    
    const [isAuth, setIsAuth] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);

    

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id: any = item.getAttribute("sub-items");
                var menusId = document.getElementById(id);
                if (menusId){
                    (menusId.parentElement as HTMLElement).classList.remove("show");
                }
            });
            e.target.classList.add("active");
        }
    }
    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');

        
        if (iscurrentState !== 'Invoice Management') {
            setIsInvoiceManagement(false);
        }
        
        if (iscurrentState !== 'Authentication') {
            setIsAuthentication(false);
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
    }, [
        iscurrentState,       
        isInvoiceManagement,        
        isOrder,        
        isAuth,
        isProducts,
        isReport,
        isMultiLevel,
        isAuthentication,
        isPages,
        
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },        
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "las la-house-damage",
            link: "/dashboard",           

        },
        {
            label: "Pages",
            isHeader: true,
        },
        
        {
            id: "invoiceManagement",
            label: "Invoices Management",
            icon: "las la-file-invoice",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsInvoiceManagement(!isInvoiceManagement);
                setIscurrentState('Invoice Management');
                updateIconSidebar(e);
            },
            stateVariables: isInvoiceManagement,
            subItems: [
                { id: 1, label: "Invoice", link: "/invoice", parentId: "invoiceManagement" },
                { id: 2, label: "Add Invoice", link: "/invoice-add", parentId: "invoiceManagement" },
                { id: 2, label: "Invoice Details", link: "/invoice-details", parentId: "invoiceManagement" },
                { id: 3, label: "Payments", link: "/payments", parentId: "invoiceManagement" },
                { id: 4, label: "Taxes", link: "/taxes", parentId: "invoiceManagement" },
                {
                    id: "products",
                    label: "Products",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsProducts(!isProducts);                       
                    },
                    stateVariables: isProducts,
                    childItems: [
                        { id: 1, label: "Product List", link: "/product-list", parentId: "invoiceManagement" },                        
                        { id: 2, label: "Add Product", link: "/product-add", parentId: "invoiceManagement" },                        
                    ]
                },
                {
                    id: "report",
                    label: "Report",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsReport(!isReport);
                    },
                    stateVariables: isReport,
                    childItems: [
                        { id: 1, label: "Payment Summary", link: "/payment-summary", parentId: "invoiceManagement" },                        
                        { id: 2, label: "Sale Report", link: "/sale-report", parentId: "invoiceManagement" },                        
                        { id: 3, label: "Expenses Report", link: "/expenses-report", parentId: "invoiceManagement" },                        
                    ]
                },
                { id: 7, label: "Users", link: "/user", parentId: "invoiceManagement" },
                {
                    id: "transaction",
                    label: "Transaction",
                    link: "/#",
                    isChildItem: true,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsTransaction(!isTransaction);
                    },
                    stateVariables: isTransaction,
                    childItems: [
                        { id: 1, label: "Transaction List", link: "/transaction-list", parentId: "invoiceManagement" },                        
                        { id: 2, label: "New Transaction", link: "/transaction-new", parentId: "invoiceManagement" },                       
                    ]
                },
               
            ],
        },
        
        {
            id: "authentication",
            label: "Authentication",
            icon: "las la-cog",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsAuthentication(!isAuthentication);
                setIscurrentState('Authentication');
                updateIconSidebar(e);
            },
            stateVariables: isAuthentication,
            subItems: [
                {
                    id: "signin",
                    label: "Sign In",
                    link: "/auth-signin",
                    parentId: "authentication"
                },
                {
                    id: "sign up",
                    label: "Sign Up",
                    link: "/auth-signup",
                    parentId: "authentication"
                },
                {
                    id: "password-reset",
                    label: "Password Reset",
                    link: "/auth-pass-reset",
                    parentId: "authentication"
                },      
                {
                    id: "lock-screen",
                    label: "Lock Screen",
                    link: "/auth-lockscreen",
                    parentId: "authentication"
                },             
            ],
        },

    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;