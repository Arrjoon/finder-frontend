// AUTH ROUTES
export const LOGIN = "auth/login/";
export const VERIFY_TOKEN = "auth/login/verify/";
export const REFRESH_TOKEN = "auth/login/refresh/";
export const LOGOUT = "auth/logout/";
export const RESET_PASSWORD = "auth/reset-password/";
export const FORGET_PASSWORD = "auth/forgot-password/";
export const CHANGE_PASSWORD = "auth/change-password/";
export const FETCH_CSRF_TOKEN = "auth/get-csrftoken/";
export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || "http://localhost:3000";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1/";

// USER
export const USER_PROFILE = "/auth/profile";
export const USER_PROFILE_UPDATE = "/auth/profile/";

// COMPANY
export const FETCH_COMPANY_LIST = "tenants/";
export const FETCH_COMPANY_DETAILS = (id: number) => `tenants/${id}`;
export const CREATE_COMPANY = "tenants/";
export const UPDATE_COMPANY = (id: number | string) => `tenants/${id}/`;
export const DELETE_COMPANY = (id: number | string) => `tenants/${id}/`;

// COMPANY MEMBERS
export const FETCH_COMPANY_MEMBERS_LIST = (id: number | string) =>
  `users/tenant/${id}/`;
export const CREATE_COMPANY_USERS = "users/";
export const UPDATE_COMPANY_USER = (id: number | string) => `users/${id}/`;
export const DELETE_COMPANY_USER = (id: number | string) => `users/${id}/`;
export const ACTIVATE_MEMBER = (id: number | string) =>
  `auth/activate-user/${id}/`;
export const DEACTIVATE_MEMBER = (id: number | string) =>
  `auth/deactivate-user/${id}/`;

// CHANNEL CONFIGURATION
export const FETCH_CHANNELS_LIST = "external/channels/";
export const CREATE_CHANNEL = "external/channels/";
export const CONNECT_CHANNEL = (id: number | string) =>
  `external/channels/${id}/connect/`;
export const GENERATE_INSTAGRAM_ACCESS_TOKEN = `instagram/token/`;
export const UPDATE_CHANNEL_STATUS = (id: number) =>
  `external/channels/${id}/deactivate_channel/`;
export const UPDATE_AI_MODE = (channel_id: number) =>
  `external/channels/${channel_id}/edit-ai-reply-mode/`;
export const DISCONNECT_CHANNEL = (id: number) =>
  `knowledge-bases/${id}/disconnect-channels/`;

// CHAT ROOM
export const CHECK_EMAIL = "email/get_email/";
export const FETCH_CHAT_ROOM_LIST = "external/chat-rooms/";
export const FETCH_CHAT_ROOM_MESSAGES = (id: number) =>
  `external/chat-rooms/${id}/`;
export const SEND_MESSAGE = (id: number) =>
  `external/chat-rooms/${id}/send-message/`;
export const MARK_AS_READ = (id: number) =>
  `external/chat-rooms/${id}/mark_read/`;
export const CREATE_GROUP_CHAT = "external/chat-group/add_chatroom/";
export const REMOVE_FROM_GROUP_CHAT = (chat_group_id: number) =>
  `external/chat-group/${chat_group_id}/remove_chatroom/`;
export const GET_CHAT_GROUP_DETAILS = (chat_group_id: number) =>
  `external/chat-group/${chat_group_id}/get_chatrooms/`;

// NOTIFICATIONS
export const FETCH_NOTIFICATIONS = "auth/notification/";
export const READ_NOTIFICATION = (id: number) =>
  `auth/notification/${id}/seen/`;
export const READ_ALL_NOTIFICATIONS = "auth/notification/seen-all/";

// DASHBOARD
export const FETCH_DASHBOARD_METRICS = "dashboard/";

// KNOWLEDGE BASE
export const FETCH_KB_LIST = "knowledge-bases/";
export const ADD_KB = "knowledge-bases/";
export const UPDATE_KB = (id: number) => `knowledge-bases/${id}`;
export const CONNECT_KB = `knowledge-bases/bulk-connect/`;

export const GET_SUGGESTIONS = (chat_room_id: number, tenant_id: number) =>
  `ml/suggestions/?chat_room_id=${chat_room_id}&tenant_id=${tenant_id}`;
