import { FC, ReactNode, useCallback, useEffect, useState } from "react";
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
  updateUserRoles,
} from "../../store/slices/adminSlice.ts";
import { useHasRole } from "../../hooks/useHasRole.tsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.tsx";
import useDebounce from "../../hooks/useDebounce.tsx";
import SearchBar from "../../components/SearchBar/SearchBar.tsx";
import UsersFilter from "../../components/UsersFilter/UsersFilter.tsx";
import { Roles, User } from "../../types/admin.ts";
import s from "./UsersPage.module.scss";

export type FilterButtons = {
  title: string;
  isBlocked?: boolean;
};

const UsersPage: FC = (): ReactNode => {
  const [tableLoading, setTableLoading] = useState(false);

  const [activeIsBlockedFilter, setActiveIsBlockedFilter] = useState(0);
  const filterButtons: FilterButtons[] = [
    { title: "Все", isBlocked: undefined },
    { title: "Только заблокированные", isBlocked: true },
    { title: "Только активные", isBlocked: false },
  ];
  const isBlockedFilter = filterButtons[activeIsBlockedFilter].isBlocked;

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    sortBy: "id",
    sortOrder: "asc",
    limit: 10,
    offset: page - 1,
    searchValue: debouncedSearchValue,
    isBlocked: isBlockedFilter,
  });

  const { users } = useAppSelector((state) => state.admin);
  const { usersAmount } = useAppSelector((state) => state.admin);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isAdmin = useHasRole(Roles.ADMIN);

  const onChange: TableProps<User>["onChange"] = (
    tablePagination,
    __,
    sorter
  ) => {
    const nextPage = tablePagination.current ?? 1;

    let sortBy = filter.sortBy;
    let sortOrder = filter.sortOrder;

    const sortObj: SorterResult<User> = Array.isArray(sorter)
      ? sorter[0]
      : sorter;

    if (sortObj.field && sortObj.order) {
      sortBy = sortObj.field as string;
      sortOrder = sortObj.order === "ascend" ? "asc" : "desc";
    }

    setPage(nextPage);
    setFilter({
      sortBy,
      sortOrder,
      limit: filter.limit,
      offset: nextPage - 1,
      searchValue: debouncedSearchValue,
      isBlocked: filterButtons[activeIsBlockedFilter].isBlocked,
    });
  };

  const allUsersWithFilters = useCallback(
    async (filters: any) => {
      await dispatch(getAllUsers(filters));
    },
    [debouncedSearchValue, isBlockedFilter, filter]
  );

  const handleRemoveUser = (id: number) => {
    if (user && isAdmin) {
      Modal.confirm({
        title: "Are you sure you want to delete this user?",
        okText: "Yes",
        okType: "danger",
        onOk: async () => {
          await dispatch(removeUser(id));
          await allUsersWithFilters(filter);
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
        await allUsersWithFilters(filter);
      },
    });
  };

  const handleUnlockUser = async (userId: number) => {
    await dispatch(unlockUser(userId));
    await allUsersWithFilters(filter);
  };

  const handleAddRole = (userId: number, newRole: Roles, roles: Roles[]) => {
    let newRoles: Roles[] = [];
    if (roles.includes(newRole)) {
      newRoles = roles;
      notification.config({ maxCount: 3 });
      notification.error({
        message: "Ошибка",
        description: "Такая роль уже есть у пользователя!",
        placement: "bottomRight",
        duration: 3,
      });
    } else {
      newRoles = [...roles, newRole];
      Modal.confirm({
        title: `Add ${newRole} role to this user?`,
        okText: "Yes",
        onOk: async () => {
          await dispatch(updateUserRoles({ userId, roles: newRoles }));
          await allUsersWithFilters(filter);
        },
      });
    }
  };

  const handleRemoveRole = (
    userId: number,
    roleRemove: Roles,
    roles: Roles[]
  ) => {
    const newRoles = roles.filter((role) => role !== roleRemove);
    Modal.confirm({
      title: `Remove ${roles} from this user?`,
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await dispatch(updateUserRoles({ userId, roles: newRoles }));
        await allUsersWithFilters(filter);
      },
    });
  };

  const handleBlockedFilter = (filterIndex: number) => {
    const selectedFilter = filterButtons[filterIndex].isBlocked;
    setActiveIsBlockedFilter(filterIndex);
    setPage(1);
    setFilter((prev) => ({
      ...prev,
      isBlocked: selectedFilter,
      offset: 0,
    }));
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
            {user && isAdmin ? (
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
            {user && isAdmin ? (
              <Popover
                content={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Button
                      onClick={() =>
                        handleAddRole(item.id, Roles.ADMIN, item.roles)
                      }
                    >
                      Добавить роль админа
                    </Button>
                    <Button
                      onClick={() =>
                        handleAddRole(item.id, Roles.MODERATOR, item.roles)
                      }
                    >
                      Добавить роль модератора
                    </Button>
                    {item.roles &&
                      item.roles.length > 0 &&
                      item.roles
                        .filter((role: Roles) => role !== Roles.USER)
                        .map((role: Roles) => (
                          <Button
                            key={role}
                            onClick={() =>
                              handleRemoveRole(item.id, role, item.roles)
                            }
                          >
                            Убрать {role}
                          </Button>
                        ))}
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
    setFilter((prev) => ({
      ...prev,
      searchValue: debouncedSearchValue,
      isBlocked: isBlockedFilter,
    }));
  }, [debouncedSearchValue, isBlockedFilter]);

  useEffect(() => {
    setTableLoading(true);
    try {
      allUsersWithFilters(filter);
    } catch (e) {
      console.log(e);
    } finally {
      setTableLoading(false);
    }
  }, [filter]);

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
          {user && isAdmin ? (
            <UsersFilter
              filterButtons={filterButtons}
              activeFilter={activeIsBlockedFilter}
              setActiveFilter={setActiveIsBlockedFilter}
              handleBlockedFilter={handleBlockedFilter}
            />
          ) : null}
        </div>
      </div>
      <Table<User>
        pagination={{
          position: ["bottomCenter"],
          total: usersAmount,
          pageSize: 10,
          current: page,
        }}
        columns={columns}
        dataSource={users}
        rowKey="id"
        onChange={onChange}
      />
    </div>
  );
};

export default UsersPage;
