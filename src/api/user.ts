import { request } from '@/utils/request';

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  nickname: string;
  avatarUrl?: string;
  gender: number;
  birthday?: string;
  role: string;
  status: number;
  lastLoginTime?: string;
  lastLoginIp?: string;
  createTime: string;
  updateTime: string;
}

export interface UserProfile {
  id?: number;
  userId: number;
  realName?: string;
  education?: string;
  profession?: string;
  company?: string;
  bio?: string;
  interests?: string[];
  learningGoals?: string;
  address?: string;
  wechat?: string;
  qq?: string;
  website?: string;
  github?: string;
}

export interface UserStats {
  id?: number;
  userId: number;
  totalStudyTime: number;
  enrolledCourses: number;
  completedCourses: number;
  completedLessons: number;
  noteCount: number;
  favoriteCount: number;
  examCount: number;
  examPassCount: number;
  averageScore: number;
  totalPoints: number;
  currentLevel: number;
  continuousDays: number;
  maxContinuousDays: number;
  lastStudyTime?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
  phone?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: User;
}

export const userApi = {
  // 用户认证
  login: (data: LoginRequest) => {
    return request.post<LoginResponse>('/api/user/login', data);
  },

  register: (data: RegisterRequest) => {
    return request.post<User>('/api/user/register', data);
  },

  logout: () => {
    return request.post('/api/user/logout');
  },

  refreshToken: (refreshToken: string) => {
    return request.post<LoginResponse>('/api/user/refresh-token', null, {
      params: { refreshToken }
    });
  },

  // 用户信息
  getCurrentUser: () => {
    return request.get<User>('/api/user/profile');
  },

  updateCurrentUser: (data: Partial<User>) => {
    return request.put<User>('/api/user/profile', data);
  },

  // 用户资料
  getCurrentUserProfile: () => {
    return request.get<UserProfile>('/api/user/profile/detail');
  },

  updateCurrentUserProfile: (data: UserProfile) => {
    return request.put<UserProfile>('/api/user/profile/detail', data);
  },

  // 头像上传
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post<string>('/api/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 用户统计
  getCurrentUserStats: () => {
    return request.get<UserStats>('/api/user/stats');
  },

  // 用户名和邮箱检查
  checkUsername: (username: string) => {
    return request.get<boolean>('/api/user/check-username', {
      params: { username }
    });
  },

  checkEmail: (email: string) => {
    return request.get<boolean>('/api/user/check-email', {
      params: { email }
    });
  },
};
