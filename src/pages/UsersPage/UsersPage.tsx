import { FC, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Tooltip,
  Modal,
  Space,
  Table,
  Tag,
  Button,
  Popover,
  TableProps,
  notification,
} from "antd";
import { SorterResult } from "antd/es/table/interface";
import {
  PhoneOutlined,
  DeleteOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts";
import {
  getAllUsers,
  removeUser,
  blockUser,
  unlockUser,
  addRoleToUser,
  resetUserRoles,
  removeRoleFromUser,
} from "../../store/slices/adminSlice.ts";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.tsx";
import useDebounce from "../../hooks/useDebounce.tsx";
import SearchBar from "../../components/SearchBar/SearchBar.tsx";
import UsersFilter from "../../components/UsersFilter/UsersFilter.tsx";
import { Roles, User } from "../../types/IAdmin.ts";
import s from "./UsersPage.module.scss";

export type FilterButtons = {
  title: string;
  isBlocked: boolean | string;
};

const UsersPage: FC = (): ReactNode => {
  const [tableLoading, setTableLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const { users } = useAppSelector((state) => state.admin);
  const { user } = useAppSelector((state) => state.auth);
  const debouncedValue = useDebounce(searchValue, 1000);
  const dispatch = useAppDispatch();

  const filterButtons: FilterButtons[] = [
    { title: "Все", isBlocked: "" },
    { title: "Только заблокированные", isBlocked: true },
    { title: "Только активные", isBlocked: false },
  ];
  const currentFilter = filterButtons[activeFilter].isBlocked;

  const onChange: TableProps<User>["onChange"] = async (
    _,
    __,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    console.log("params", sorter);
    const sortObj: SorterResult<User> = Array.isArray(sorter)
      ? sorter[0]
      : sorter;

    if (sortObj.order && sortObj.field) {
      const sortOrderSlice =
        sortObj.order === "ascend"
          ? "asc"
          : sortObj.order === "descend"
            ? "desc"
            : "asc";
      setSortOrder(sortOrderSlice);
      setSortBy(sortObj.field as string);
      await dispatch(
        getAllUsers({
          searchValue: debouncedValue,
          isBlocked: currentFilter,
          sortBy: sortObj.field as string,
          sortOrder: sortOrderSlice,
        })
      );
    } else {
      await dispatch(
        getAllUsers({
          searchValue: debouncedValue,
          isBlocked: currentFilter,
          sortBy: "id",
          sortOrder: "asc",
        })
      );
    }
  };

  const allUsersWithFilters = async () => {
    await dispatch(
      getAllUsers({
        searchValue: debouncedValue,
        isBlocked: currentFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
      })
    );
  };

  const handleRemoveUser = (id: number) => {
    if (user && user.roles.includes(Roles.ADMIN)) {
      Modal.confirm({
        title: "Are you sure you want to delete this user?",
        okText: "Yes",
        okType: "danger",
        onOk: async () => {
          await dispatch(removeUser(id));
          await allUsersWithFilters();
        },
      });
    } else {
      notification.config({ maxCount: 3 });
      notification.error({
        message: "Ошибка",
        description: "Недостаточно прав!",
        placement: "bottomRight",
        duration: 3,
      });
    }
  };

  const handleBlockUser = (userId: number) => {
    Modal.confirm({
      title: "Are you sure you want to block this user?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await dispatch(blockUser(userId));
        await allUsersWithFilters();
      },
    });
  };

  const handleUnlockUser = async (userId: number) => {
    await dispatch(unlockUser(userId));
    await allUsersWithFilters();
  };

  const handleAddRole = (userId: number, role: Roles) => {
    Modal.confirm({
      title: `Add ${role} role to this user?`,
      okText: "Yes",
      onOk: async () => {
        await dispatch(addRoleToUser({ userId, role }));
        await allUsersWithFilters();
      },
    });
  };

  const handleRemoveRole = (userId: number, role: Roles) => {
    Modal.confirm({
      title: `Remove ${role} from this user?`,
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await dispatch(removeRoleFromUser({ userId, role }));
        await allUsersWithFilters();
      },
    });
  };

  const handleResetRoles = async (userId: number) => {
    Modal.confirm({
      title: `Remove all roles from the user?`,
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await dispatch(resetUserRoles(userId));
        await allUsersWithFilters();
      },
    });
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: true,
      render: (item, { id }) => {
        return (
          <Space size={"small"}>
            {item}
            <Tooltip title="User profile">
              <Link to={`/users/${id}`}>
                <UserOutlined />
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        new Date(date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Blocked",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (_, { isBlocked }) => {
        if (isBlocked) {
          return <Tag color={"red"}>Blocked</Tag>;
        } else {
          return <Tag color={"green"}>Active</Tag>;
        }
      },
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (_, { roles }) => {
        if (!roles || roles.length === 0) {
          return "no roles";
        }
        return (
          <>
            {roles.map((role) => {
              let color = role.length > 5 ? "geekblue" : "green";
              if (role === Roles.ADMIN) {
                color = "volcano";
              }
              return (
                <Tag color={color} key={role}>
                  {role.toUpperCase()}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => {
        return (
          <>
            <PhoneOutlined /> {phoneNumber}
          </>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (item) => {
        return (
          <Space size={"middle"}>
            {user && user.roles.includes(Roles.ADMIN) ? (
              <Tooltip title="Delete user">
                <DeleteOutlined
                  onClick={() => handleRemoveUser(item.id)}
                  style={{ color: "red", fontSize: "16px" }}
                />
              </Tooltip>
            ) : null}

            {!item.isBlocked ? (
              <Tooltip title="Block user">
                <StopOutlined
                  onClick={() => handleBlockUser(item.id)}
                  style={{ color: "red", fontSize: "16px" }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Unblock user">
                <a onClick={() => handleUnlockUser(item.id)}>Unlock</a>
              </Tooltip>
            )}
            {user && user.roles.includes(Roles.ADMIN) ? (
              <Popover
                content={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Button onClick={() => handleAddRole(item.id, Roles.ADMIN)}>
                      Добавить роль админа
                    </Button>
                    <Button
                      onClick={() => handleAddRole(item.id, Roles.MODERATOR)}
                    >
                      Добавить роль модератора
                    </Button>
                    {item.roles.length > 0 &&
                      item.roles
                        .filter((role: Roles) => role !== Roles.USER)
                        .map((role: Roles) => (
                          <Button
                            key={role}
                            onClick={() => handleRemoveRole(item.id, role)}
                          >
                            Убрать {role}
                          </Button>
                        ))}
                    <Button onClick={() => handleResetRoles(item.id)}>
                      Убрать все доп. роли
                    </Button>
                  </div>
                }
                title="Дополнительные действия"
                trigger="click"
                placement="right"
              >
                <Button>More</Button>
              </Popover>
            ) : null}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    setTableLoading(true);
    const initializeTable = async () => {
      try {
        const initialFilter = filterButtons[activeFilter].isBlocked;
        await dispatch(
          getAllUsers({
            searchValue: debouncedValue,
            isBlocked: initialFilter,
            sortBy: sortBy,
            sortOrder: sortOrder,
          })
        );
      } catch (e) {
        console.log(e);
        setTableLoading(false);
      } finally {
        setTableLoading(false);
      }
    };
    initializeTable();
  }, [debouncedValue]);

  if (tableLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <h1 className={s.title}>Users</h1>
        <div className={s.searchBlock}>
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          {user && user.roles.includes(Roles.ADMIN) ? (
            <UsersFilter
              filterButtons={filterButtons}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          ) : null}
        </div>
      </div>
      <Table<User>
        pagination={{ position: ["bottomCenter"] }}
        columns={columns}
        dataSource={users}
        rowKey="id"
        onChange={onChange}
      />
    </div>
  );
};

export default UsersPage;
