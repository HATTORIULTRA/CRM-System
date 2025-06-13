import { FC, ReactNode } from "react";
import { Input } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import s from "../../pages/UsersPage/UsersPage.module.scss";

interface SearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({
  searchValue,
  setSearchValue,
}): ReactNode => {
  return (
    <Input
      allowClear={{
        clearIcon: <CloseOutlined style={{ color: "black", fontSize: 20 }} />,
      }}
      size="large"
      prefix={<SearchOutlined style={{ fontSize: 20 }} />}
      onChange={(e) => setSearchValue(e.target.value)}
      value={searchValue}
      className={s.searchInput}
      placeholder="Search..."
    />
  );
};

export default SearchBar;
