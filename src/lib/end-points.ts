// AUTH ROUTES
export const LOGIN = "accounts/login/";

export const VERIFY_TOKEN = "accounts/token/verify/";
export const REFRESH_TOKEN = "accounts/token/refresh/";
export const LOGOUT = "accounts/logout/";
export const RESET_PASSWORD = "accounts/reset-password/";
export const FORGET_PASSWORD = "accounts/forgot-password/";
export const CHANGE_PASSWORD = "accounts/change-password/";


export const FETCH_CSRF_TOKEN = "accounts/get-csrftoken/";
export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || "http://localhost:3000";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/";

// USER
export const USER_PROFILE = "/accounts/me";
export const USER_PROFILE_UPDATE = "/accounts/me/";

// Category 
export const FETCH_CATEGORIES_LIST = "categories/";
export const FETCH_CATEGORY_DETAILS = (id: number) => `categories/${id}`;
export const CREATE_CATEGORY = "categories/";
export const UPDATE_CATEGORY = (id: number | string) => `categories/${id}/`;
export const DELETE_CATEGORY = (id: number | string) => `categories/${id}/`;

// Business

export const FETCH_BUSINESS_LIST = "businesses/";
export const FETCH_BUSINESS_DETAILS = (slug: string) => `businesses/${slug}/`;
export const CREATE_BUSINESS = "businesses/";
export const UPDATE_BUSINESS = (slug: string) => `businesses/${slug}/`;
export const DELETE_BUSINESS = (slug: string) => `businesses/${slug}/`;


// // CHANNEL CONFIGURATION
// export const FETCH_CHANNELS_LIST = "external/channels/";
// export const CREATE_CHANNEL = "external/channels/";
// export const CONNECT_CHANNEL = (id: number | string) =>
//   `external/channels/${id}/connect/`;
// export const GENERATE_INSTAGRAM_ACCESS_TOKEN = `instagram/token/`;
// export const UPDATE_CHANNEL_STATUS = (id: number) =>
//   `external/channels/${id}/deactivate_channel/`;
// export const UPDATE_AI_MODE = (channel_id: number) =>
//   `external/channels/${channel_id}/edit-ai-reply-mode/`;
// export const DISCONNECT_CHANNEL = (id: number) =>
//   `knowledge-bases/${id}/disconnect-channels/`;

// // CHAT ROOM
// export const CHECK_EMAIL = "email/get_email/";
// export const FETCH_CHAT_ROOM_LIST = "external/chat-rooms/";
// export const FETCH_CHAT_ROOM_MESSAGES = (id: number) =>
//   `external/chat-rooms/${id}/`;
// export const SEND_MESSAGE = (id: number) =>
//   `external/chat-rooms/${id}/send-message/`;
// export const MARK_AS_READ = (id: number) =>
//   `external/chat-rooms/${id}/mark_read/`;
// export const CREATE_GROUP_CHAT = "external/chat-group/add_chatroom/";
// export const REMOVE_FROM_GROUP_CHAT = (chat_group_id: number) =>
//   `external/chat-group/${chat_group_id}/remove_chatroom/`;
// export const GET_CHAT_GROUP_DETAILS = (chat_group_id: number) =>
//   `external/chat-group/${chat_group_id}/get_chatrooms/`;

// // NOTIFICATIONS
// export const FETCH_NOTIFICATIONS = "auth/notification/";
// export const READ_NOTIFICATION = (id: number) =>
//   `auth/notification/${id}/seen/`;
// export const READ_ALL_NOTIFICATIONS = "auth/notification/seen-all/";

// // DASHBOARD
// export const FETCH_DASHBOARD_METRICS = "dashboard/";

// // KNOWLEDGE BASE
// export const FETCH_KB_LIST = "knowledge-bases/";
// export const ADD_KB = "knowledge-bases/";
// export const UPDATE_KB = (id: number) => `knowledge-bases/${id}`;
// export const CONNECT_KB = `knowledge-bases/bulk-connect/`;

// export const GET_SUGGESTIONS = (chat_room_id: number, tenant_id: number) =>
//   `ml/suggestions/?chat_room_id=${chat_room_id}&tenant_id=${tenant_id}`;
