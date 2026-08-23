import React from "react";

const ManageSidebarContext = React.createContext(null);

const ManageSidebarProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const toggleSidebar = React.useCallback(() => {
    setIsSidebarCollapsed((value) => !value);
  }, []);
  const contextValue = React.useMemo(
    () => ({ isSidebarCollapsed, toggleSidebar }),
    [isSidebarCollapsed, toggleSidebar],
  );

  return (
    <ManageSidebarContext.Provider value={contextValue}>
      {children}
    </ManageSidebarContext.Provider>
  );
};

const useManageSidebar = () => {
  const context = React.useContext(ManageSidebarContext);

  if (!context) {
    throw new Error("useManageSidebar must be used within ManageSidebarProvider");
  }

  return context;
};

export { ManageSidebarProvider, useManageSidebar };
