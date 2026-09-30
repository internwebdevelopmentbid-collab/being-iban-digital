import { Toaster as HotToaster } from "react-hot-toast";

const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3500,

        style: {
          background: "#11120F",
          color: "#F5F3EE",
          border: "1px solid #292722",
          borderRadius: "2px",
          padding: "14px 18px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "13px",
          letterSpacing: "0.01em",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)",
        },

        success: {
          duration: 3500,

          iconTheme: {
            primary: "#C9A66B",
            secondary: "#080907",
          },
        },

        error: {
          duration: 4000,

          iconTheme: {
            primary: "#C9A66B",
            secondary: "#080907",
          },
        },
      }}
      containerStyle={{
        top: "98px",
        right: "24px",
        zIndex: 100001,
      }}
    />
  );
};

export default Toaster;
