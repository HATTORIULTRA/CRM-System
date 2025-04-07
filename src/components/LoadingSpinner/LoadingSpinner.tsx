import { CSSProperties } from "react";
import { Flex, Spin } from "antd";

const LoadingSpinner = () => {
  const contentStyle: CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <Flex
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </Flex>
  );
};

export default LoadingSpinner;
