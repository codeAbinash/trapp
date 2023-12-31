import { app } from '../constants'
import ls from './util'

const API_URL = app.api

type defaultHeaders = {
  'Content-Type': 'application/json'
  Accept: 'application/json'
  secret?: string
}
export const defaultHeaders: defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  //   secret: app.secret,
}

type formDataHeaders = {
  ContentType: 'multipart/form-data'
  Accept: 'application/json'
  //   secret: string
}
export const formDataHeaders: formDataHeaders = {
  //   secret: app.secret,
  Accept: 'application/json',
  ContentType: 'multipart/form-data',
}

export function authorizedHeader(header: formDataHeaders | defaultHeaders) {
  return { ...header, Authorization: `Bearer ${ls.get('token')}` }
}

export type apiResponse = {
  status: boolean
  message: string
  data?: any
}

type errors = {
  [key: string]: string[]
}
export function getError(errors: errors) {
  const key = Object.keys(errors)[0]
  const value = errors[key][0]
  return value
}

async function returnResponse(res: any): Promise<apiResponse> {
  const data = await res.json()
  if (data.status === true) return { status: true, message: data.message, data: data }
  else if (data.message === 'Unauthenticated.') {
    ls.clear()
    window.location.href = ''
    return { status: false, message: data.message || 'Network Error' }
  } else if (!data.errors) return { status: false, message: data.message || 'Network Error', data }
  return { status: false, message: getError(data.errors) || data.message || 'Network Error', data }
}

function catchError(err: any): apiResponse {
  console.log(err)
  return { status: false, message: 'Network Error' }
}

const API = {
  send_otp_login: `${API_URL}/auth/login/send_otp`,
  verify_otp_login: `${API_URL}/auth/login`,
  send_otp_signup: `${API_URL}/auth/signup/send_otp`,
  verify_otp_signup: `${API_URL}/auth/signup`,
  user: {
    current: {
      get: `${API_URL}/user/get_current_user`,
      update: `${API_URL}/user/update_user`,
    },
  },
  banners: {
    get: `${API_URL}/banner/get_all`,
  },
  home: {
    layout: `${API_URL}/home/get_layout`,
  },
  get_video_details: `${API_URL}/video/get_v_details`,
  creator: {
    follow_unfollow: `${API_URL}/creator/follow`,
  },
  video: {
    like_unlike: `${API_URL}/video/like`,
    dislike_undislike: `${API_URL}/video/dislike`,
  },
  categories: {
    get_all: `${API_URL}/video/get_cat_list`,
    video_by_cat: `${API_URL}/video/get_vid_by_cat`,
  },
  liveChat: {
    message: `${API_URL}/livechat/messages`,
    fetch: `${API_URL}/livechat/fetch`,
  },
}

export default API

// All API calls

export async function fetch_live_chat_f(video_id: string): Promise<apiResponse> {
  try {
    const res = await fetch(API.liveChat.fetch, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ video_id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function live_chat_message_f(message: string, video_id: string): Promise<apiResponse> {
  try {
    const res = await fetch(API.liveChat.message, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ message, video_id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function getVideosByCategory_f(cat_id: number, page: number): Promise<apiResponse> {
  try {
    const res = await fetch(API.categories.video_by_cat + '?page=' + page, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ cat_id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function getCategories_f(): Promise<apiResponse> {
  try {
    const res = await fetch(API.categories.get_all, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function like_unlike_f(id: string, creator_id: string): Promise<apiResponse> {
  try {
    const res = await fetch(API.video.like_unlike, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ video_id: id, creator_id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function dislike_undislike_f(id: string, creator_id: string): Promise<apiResponse> {
  try {
    const res = await fetch(API.video.dislike_undislike, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ video_id: id, creator_id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function follow_unfollow_f(id: string): Promise<apiResponse> {
  try {
    const res = await fetch(API.creator.follow_unfollow, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ creator_id: id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function getVideoDetails_f(id: string): Promise<apiResponse> {
  try {
    const res = await fetch(API.get_video_details, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
      body: JSON.stringify({ video_id: id }),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function getHomeLayout_f(): Promise<apiResponse> {
  try {
    const res = await fetch(API.home.layout, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function getBanners_f(): Promise<apiResponse> {
  try {
    const res = await fetch(API.banners.get, {
      method: 'POST',
      headers: authorizedHeader(defaultHeaders),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function getCurrentUser_f(): Promise<apiResponse> {
  const headers = authorizedHeader(defaultHeaders)
  try {
    const res = await fetch(API.user.current.get, {
      method: 'POST',
      headers: headers,
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function verifyOtp_f(
  phone: string,
  country_code: string,
  otp: string,
  type: 'login' | 'signup',
): Promise<apiResponse> {
  const link = type === 'login' ? API.verify_otp_login : API.verify_otp_signup
  const body = { phone, country_code, otp }
  try {
    const res = await fetch(link, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function sendOtpSignup_f(phone: string, country_code: string, name: string): Promise<apiResponse> {
  try {
    const body = { phone, country_code, name }
    const res = await fetch(API.send_otp_signup, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}

export async function sendOtpLogin_f(phone: string, country_code: string): Promise<apiResponse> {
  try {
    const body = { phone, country_code }
    const res = await fetch(API.send_otp_login, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    })
    return await returnResponse(res)
  } catch (err) {
    return catchError(err)
  }
}
