import type { ThemeConfig } from 'antd';

const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#3B5BDB',
    colorInfo: '#3B5BDB',
    colorSuccess: '#12805C',
    colorWarning: '#B54708',
    colorError: '#D92D20',
    colorText: '#182230',
    colorTextSecondary: '#667085',
    colorTextTertiary: '#98A2B3',
    colorBorder: '#E4E9F2',
    colorBorderSecondary: '#EDF0F5',
    colorBgLayout: '#F5F7FB',
    colorBgContainer: '#FFFFFF',
    colorFillSecondary: '#F5F7FB',
    borderRadius: 10,
    borderRadiusLG: 16,
    controlHeight: 38,
    fontSize: 14,
    fontFamily: "Inter, 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxShadowTertiary: '0 8px 30px rgba(24, 34, 48, 0.08)',
  },
  components: {
    Button: {
      borderRadius: 9,
      controlHeight: 38,
      primaryShadow: 'none',
      fontWeight: 500,
    },
    Card: {
      borderRadiusLG: 16,
      headerFontSize: 16,
      headerHeight: 56,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 9,
      activeShadow: '0 0 0 3px rgba(59, 91, 219, 0.10)',
    },
    Select: {
      borderRadius: 9,
    },
    Table: {
      headerBg: '#F8FAFD',
      headerColor: '#667085',
      headerSplitColor: 'transparent',
      rowHoverBg: '#F8FAFF',
      cellPaddingBlock: 16,
      cellPaddingInline: 18,
    },
    Menu: {
      itemBorderRadius: 9,
      itemSelectedBg: '#EEF2FF',
      itemSelectedColor: '#3B5BDB',
      itemHoverBg: '#F5F7FB',
      itemHeight: 42,
    },
    Modal: {
      borderRadiusLG: 18,
      titleFontSize: 18,
    },
    Drawer: {
      borderRadiusLG: 0,
    },
    Tabs: {
      itemSelectedColor: '#3B5BDB',
      inkBarColor: '#3B5BDB',
      titleFontSize: 14,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};

export default appTheme;
