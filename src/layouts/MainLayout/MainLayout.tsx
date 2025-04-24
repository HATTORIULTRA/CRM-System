import { FC, Key, ReactNode, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Layout, Menu, type MenuProps } from "antd";
import {
  UserOutlined,
  FormOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import { Roles } from "../../types/IAdmin.ts";
import logotype from "../../assets/logoImg.png";
import { getUserProfile } from "../../store/slices/authSlice.ts";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const MainLayout: FC = (): ReactNode => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const indexOfPages = [
    { path: "/", index: "1" },
    { path: "/profile", index: "2" },
    { path: "/users", index: "3" },
  ];

  const selectedPage = useMemo(
    () =>
      indexOfPages.find((item) => item.path === location.pathname)?.index ||
      "1",
    [location]
  );

  const items: MenuItem[] = [
    getItem(<Link to="/">Todos</Link>, "1", <FormOutlined />),
    getItem(<Link to="/profile">My Profile</Link>, "2", <UserOutlined />),
  ];

  if (
    (user && user.roles.includes(Roles.ADMIN)) ||
    (user && user.roles.includes(Roles.MODERATOR))
  ) {
    items.push(
      getItem(<Link to="/users">Users</Link>, "3", <OrderedListOutlined />)
    );
  }

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        onDoubleClick={() => setCollapsed((prev) => !prev)}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical">
          <img width={45} src={logotype} alt="logotype" />
          {!collapsed && <h1 className="logoText">CRM</h1>}
        </div>
        <Menu
          style={{ userSelect: "none" }}
          theme="dark"
          defaultSelectedKeys={[selectedPage]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
