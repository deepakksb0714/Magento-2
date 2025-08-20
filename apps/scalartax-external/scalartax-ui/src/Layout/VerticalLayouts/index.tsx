import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withRouter from '../../Common/withRouter';
import { Collapse } from 'react-bootstrap';
import { FaAngleRight } from 'react-icons/fa6';

import { withTranslation } from 'react-i18next';

// Import Data
import navdata from '../LatoutMenuData';
import { Link } from 'react-router-dom';

const VerticalLayout = (props: any) => {
  const path = props.router.location.pathname;
  const navData = navdata().props.children;

  useEffect(() => {
    const initMenu = () => {
      const pathName = process.env.PUBLIC_URL + path;
      const ul: any = document.getElementById('navbar-nav');
      const items = ul.getElementsByTagName('a');
      const itemsArray = [...items]; // converts NodeList to Array
      const matchingMenuItem = itemsArray.find((x) => {
        return x.pathname === pathName;
      });
      removeActivation(itemsArray, matchingMenuItem);
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    if (path !== '/dashboard') {
      initMenu();
      document
        .querySelector('a[href="/dashboard"]')
        ?.classList.remove('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (props.layoutType === 'vertical') {
      initMenu();
    }
  }, [path, props.layoutType]);

  function activateParentDropdown(item: any) {
    item.classList.add('active');
    try {
      let parentCollapseDiv = item.closest('.collapse.menu-dropdown');

      if (parentCollapseDiv) {
        // to set aria expand true remaining
        parentCollapseDiv.classList.add('show');
        parentCollapseDiv.parentElement.children[0].classList.add('active');
        parentCollapseDiv.parentElement.children[0].setAttribute(
          'aria-expanded',
          'true'
        );
        parentCollapseDiv.parentElement.children[0].querySelector(
          'svg'
        ).style.transform = 'rotate(90deg)';
        const targetElement =
          parentCollapseDiv.parentElement.children[0].parentElement
            .parentElement.parentElement.parentElement;
        const anchorElement = targetElement.querySelector(
          'a.nav-link.menu-link.first.active'
        );
        if (anchorElement) {
          anchorElement.querySelector('svg').style.transform = 'rotate(90deg)';
        }
        queueMicrotask(() => {
          const anchorElement = targetElement.querySelector(
            'a.nav-link.menu-link.first.active'
          );
          anchorElement.querySelector('svg').style.transform = 'rotate(90deg)';
        });
        if (
          parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')
        ) {
          parentCollapseDiv.parentElement
            .closest('.collapse')
            .classList.add('show');
          if (
            parentCollapseDiv.parentElement.closest('.collapse')
              .previousElementSibling
          )
            parentCollapseDiv.parentElement
              .closest('.collapse')
              .previousElementSibling.classList.add('active');
        }
        return false;
      }
      return false;
    } catch (err) {}
  }

  const removeActivation = (items: any, matchingMenuItem: any) => {
    try {
      let actiItems = items.filter((x: any) => x.classList.contains('active'));
      actiItems.forEach((item: any) => {
        if (item.classList.contains('menu-link')) {
          if (!item.classList.contains('active')) {
            item.setAttribute('aria-expanded', false);
          }
          if (item.nextElementSibling) {
            item.nextElementSibling.classList.remove('show');
          }
          if (item?.querySelector('svg')) {
            item.querySelector('svg').style.transform = 'rotate(0deg)';
          }
        }
        if (item.classList.contains('nav-link')) {
          if (item.nextElementSibling) {
            item.nextElementSibling.classList.remove('show');
          }
          item.setAttribute('aria-expanded', false);
        }
        item.classList.remove('active');
      });
    } catch (err) {
      console.log('error ' + err);
    }
  };

  return (
    <React.Fragment>
      {/* menu Items */}
      {(navData || []).map((item: any, key: number) => {
        return (
          <React.Fragment key={key}>
            {/* Main Header */}
            {item['isHeader'] ? (
              <li className="menu-title">
                <span>{props.t(item.label)} </span>
              </li>
            ) : item.subItems ? (
              <li className="nav-item">
                <Link
                  to={item.link ? item.link : '/'}
                  onClick={item.click}
                  className="nav-link menu-link first"
                  data-bs-toggle="collapse"
                >
                  <FaAngleRight />
                  <i className={item.icon}></i>
                  <span data-key="t-apps">{props.t(item.label)}</span>
                  {item.badgeName ? (
                    <span
                      className={'badge badge-pill bg-soft-' + item.badgeColor}
                      data-key="t-new"
                    >
                      {item.badgeName}
                    </span>
                  ) : null}
                </Link>
                <Collapse
                  className="menu-dropdown"
                  // className="menu-dropdown"
                  in={item.stateVariables}
                >
                  <div id="example-collapse-text">
                    <ul
                      className="nav nav-sm flex-column"
                      style={{
                        marginLeft: '10%',
                      }}
                    >
                      {/* subItms  */}
                      {item.subItems &&
                        (item.subItems || []).map(
                          (subItem: any, key: number) => (
                            <React.Fragment key={key}>
                              {!subItem.isChildItem ? (
                                <li className="nav-item">
                                  <Link
                                    to={subItem.link ? subItem.link : '/'}
                                    className="nav-link"
                                  >
                                    {props.t(subItem.label)}
                                    {subItem.badgeName ? (
                                      <span
                                        className={
                                          'badge badge-pill bg-soft-' +
                                          subItem.badgeColor
                                        }
                                        data-key="t-new"
                                      >
                                        {subItem.badgeName}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ) : (
                                <li className="nav-item">
                                  <Link
                                    to="/"
                                    onClick={subItem.click}
                                    className="nav-link second"
                                    data-bs-toggle="collapse"
                                  >
                                    <FaAngleRight />
                                    {props.t(subItem.label)}
                                  </Link>
                                  <Collapse
                                    className="menu-dropdown"
                                    in={subItem.stateVariables}
                                  >
                                    <div>
                                      <ul className="nav nav-sm flex-column">
                                        {/* child subItms  */}
                                        {subItem.childItems &&
                                          (subItem.childItems || []).map(
                                            (childItem: any, key: number) => (
                                              <React.Fragment key={key}>
                                                {!childItem.childItems ? (
                                                  <li className="nav-item">
                                                    <Link
                                                      to={
                                                        childItem.link
                                                          ? childItem.link
                                                          : '/'
                                                      }
                                                      className="nav-link"
                                                    >
                                                      {props.t(childItem.label)}
                                                    </Link>
                                                  </li>
                                                ) : (
                                                  <li className="nav-item">
                                                    <Link
                                                      to="/"
                                                      onClick={childItem.click}
                                                      className="nav-link third"
                                                      data-bs-toggle="collapse"
                                                    >
                                                      {props.t(childItem.label)}
                                                    </Link>
                                                    <Collapse
                                                      className="menu-dropdown"
                                                      in={
                                                        childItem.stateVariables
                                                      }
                                                    >
                                                      <div>
                                                        <ul className="nav nav-sm flex-column">
                                                          {childItem.childItems.map(
                                                            (
                                                              subChildItem: any,
                                                              key: number
                                                            ) => (
                                                              <li
                                                                className="nav-item"
                                                                key={key}
                                                              >
                                                                <Link
                                                                  to={
                                                                    subChildItem.link
                                                                  }
                                                                  className="nav-link"
                                                                >
                                                                  {props.t(
                                                                    subChildItem.label
                                                                  )}
                                                                </Link>
                                                              </li>
                                                            )
                                                          )}
                                                        </ul>
                                                      </div>
                                                    </Collapse>
                                                  </li>
                                                )}
                                              </React.Fragment>
                                            )
                                          )}
                                      </ul>
                                    </div>
                                  </Collapse>
                                </li>
                              )}
                            </React.Fragment>
                          )
                        )}
                    </ul>
                  </div>
                </Collapse>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  to={item.link ? item.link : '/'}
                  onClick={item?.click}
                  className="nav-link menu-link first"
                >
                  <i className={item.icon}></i>{' '}
                  <span>{props.t(item.label)}</span>
                  {item.badgeName ? (
                    <span
                      className={
                        'badge badge-pill badge-soft-' + item.badgeColor
                      }
                      data-key="t-new"
                    >
                      {item.badgeName}
                    </span>
                  ) : null}
                </Link>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));

function Helper({ flag, item, children }: any) {
  const [isActive, setActive] = useState(false);
  useEffect(() => {
    if (flag === 'first') {
      // setActive(!isActive);
    }
    return () => {
      setActive(!isActive);
    };
  }, [isActive]);
  if (flag === 'first') {
    return (
      <div
        onClick={() => {
          setActive(!isActive);
        }}
      >
        <Link
          to={item.link ? item.link : '/'}
          onClick={item.click}
          className="nav-link menu-link first"
          data-bs-toggle="collapse"
        >
          <FaAngleRight
            style={{
              transform: isActive ? 'rotate(90deg)' : '',
            }}
          />
          {children}
        </Link>
      </div>
    );
  } else if (flag === 'second') {
  } else if (flag === 'third') {
  }
}
