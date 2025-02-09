import { FC, ReactNode, Key, useState } from "react";
import { Link, Route, Routes } from "react-router";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { OrderedListOutlined, UserOutlined } from "@ant-design/icons";

import TodoPage from "./pages/TodoPage/TodoPage.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import logotype from "./assets/logoImg.png";

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

const items: MenuItem[] = [
	getItem(<Link to="/">Todos</Link>, "1", <OrderedListOutlined />),
	getItem(<Link to="/profile">My Profile</Link>, "2", <UserOutlined />),
];

const App: FC = (): ReactNode => {
	const [collapsed, setCollapsed] = useState<boolean>(false);

	return (
		<div className="app">
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
						<Routes>
							<Route path="/" element={<TodoPage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Routes>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
};

export default App;
