import { FC, Key, ReactNode, useLayoutEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import { Layout, Menu, type MenuProps } from "antd";
import { UserOutlined, FormOutlined } from "@ant-design/icons";

import logotype from "../../assets/logoImg.png";
import { useAppDispatch } from "../../hooks/redux.ts";
import { getMe } from "../../store/slices/authSlice.ts";

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

const MainPage: FC = (): ReactNode => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(getMe());
  }, []);

  const items: MenuItem[] = [
    getItem(<Link to="/">Todos</Link>, "1", <FormOutlined />),
    getItem(<Link to="/profile">My Profile</Link>, "2", <UserOutlined />),
  ];

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
          defaultSelectedKeys={["1"]}
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

export default MainPage;
