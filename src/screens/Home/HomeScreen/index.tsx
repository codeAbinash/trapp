import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setProfile } from '../../../Redux/profile'
import store from '../../../Redux/store'
import { getBanners_f, getCurrentUser_f, getHomeLayout_f } from '../../../lib/api'
import transitions from '../../../lib/transition'
import { isLoggedIn } from '../../../lib/util'
import { Layout, NormalVideo } from '../../../types'
import { UserProfile, setProfileInfoLs } from '../../Profile/utils'
import Categories from './Categories'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import icon from '@/lib/icons'
import Button from '@/components/Button'
import { CheckIcon } from 'lucide-react'

export default function HomeScreen() {
  const navigate = useNavigate()
  const [layout, setLayout] = useState<Layout | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login', { replace: true })
    getUserData()
  }, [])

  const getUserData = useCallback(async function () {
    const userData = await getCurrentUser_f()
    if (userData.status) {
      const profile = userData?.data as UserProfile
      store.dispatch(setProfile(profile))
      setProfileInfoLs(profile)
    }
  }, [])

  const getLayout = useCallback(async function () {
    const res = await getHomeLayout_f()
    if (res.status) setLayout(res.data.data)
  }, [])

  useEffect(() => {
    getLayout()
  }, [])

  return (
    <div className='bg-bg pb-28'>
      <Banners />
      <Categories />
      <LiveNow />
      <Videos normal_videos={layout?.normal_video || null} />
      {/* <Videos normal_videos={null} /> */}
      <DrawerDemo />
    </div>
  )
}
export function DrawerDemo() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* <Button>Open Drawer</Button> */}
        <p>Open</p>
      </DrawerTrigger>
      <DrawerContent className='bg-black text-white outline-none'>
        <div className='mx-auto w-full max-w-sm'>
          {/* <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader> */}
          <div className='mt-3 flex flex-col gap-7 p-3'>
            <div className='flex w-full items-center justify-between   px-5'>
              <div className='flex items-center gap-5'>
                <img src={icon('vip.svg')} className='h-10 w-10' />
                <span className='text-xl font-semibold'>Trapp Premium</span>
              </div>
              <span className='text-2xl font-medium'>$9/m</span>
            </div>
            <div className='flex flex-col gap-2 rounded-xl bg-white/10 p-5'>
              <div className='flex items-center gap-2'>
                <CheckIcon className='h-5 w-5' />
                <span>Access all premium videos</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckIcon className='h-5 w-5' />
                <span>Access live streams</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckIcon className='h-5 w-5' />
                <span>Superchat feature enabled</span>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Continue</Button>
            </DrawerClose>
            <p className='mt-3 text-center text-xs'>
              By continuing you are accepting the <a href='#'>Terms and Conditions</a>
            </p>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
export interface Banner {
  id: number
  img_src: string
  action: string
  created_at: string
  updated_at: string
}

function Banners() {
  const [banners, setBanners] = useState<Banner[] | null>(null)

  const navigate = useNavigate()

  async function loadBanners() {
    const res = await getBanners_f()
    if (res.status) setBanners(res.data.data)
  }
  useEffect(() => {
    loadBanners()
  }, [])

  return (
    <div
      className='no-scrollbar relative mx-auto mt-2 flex w-full max-w-4xl select-none snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-1.5 lg:rounded-2xl'
      // ref={containerRef}
    >
      {banners == null ? (
        <div className='shimmer tap99 flex aspect-[2/1] w-[100%] max-w-sm shrink-0 snap-center items-center justify-center overflow-hidden rounded-2xl bg-white/10 first:ml-5 last:mr-5  md:aspect-auto'></div>
      ) : (
        banners.map((banner) => (
          <div
            key={banner.id}
            onClick={transitions(() => navigate('creator/sample/videos'))}
            className='tap99 bg-inputBg flex aspect-[1.82] w-[90%] max-w-sm shrink-0 snap-center items-center justify-center overflow-hidden rounded-xl first:ml-0 last:mr-5 md:aspect-auto'
          >
            <img className='w-full shrink-0 rounded-2xl bg-white/10' src={banner.img_src} />
          </div>
        ))
      )}
    </div>
  )
}

const LiveNowData = [
  {
    image: '/images/categories/category1.png',
    title: 'Coach Steve',
    id: 1,
  },
  {
    image: '/images/categories/category2.png',
    title: 'Coach Alex',
    id: 2,
  },
  {
    image: '/images/categories/category3.png',
    title: 'Coach Leo',
    id: 3,
  },
  {
    image: '/images/categories/category1.png',
    title: 'Coach Jamal',
    id: 4,
  },
  {
    image: '/images/categories/category2.png',
    title: 'Coach Jamal',
    id: 5,
  },
  {
    image: '/images/categories/category3.png',
    title: 'Coach Jamal',
    id: 6,
  },
]

function LiveNow() {
  const navigate = useNavigate()
  return (
    <div className='mx-auto max-w-4xl'>
      <div className='p-5'>
        <p className='text-lg font-[450]'>Live Now</p>
      </div>
      <div className='no-scrollbar relative flex w-full snap-x snap-mandatory gap-4 overflow-x-auto lg:rounded-3xl'>
        {LiveNowData.map((live) => (
          <div
            onClick={transitions(() => navigate('liveVideo/67'))}
            key={live.id}
            className='tap99 bg-inputBg flex w-[22%] max-w-[150px] shrink-0 snap-center flex-col items-center justify-center overflow-hidden shadow-sm first:ml-5 last:mr-5'
          >
            <img className='aspect-square w-full shrink-0 rounded-full border-2 border-color' src={live.image} />
            <p className='pt-2 text-[0.85rem]'>{live.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
function Videos({ normal_videos }: { normal_videos: NormalVideo[] | null }) {
  if (normal_videos == null) return <VideosShimmer />

  return (
    <div className='mx-auto max-w-4xl'>
      <div className='p-5'>
        <p className='text-lg font-[450]'>Videos</p>
      </div>
      <div className='no-scrollbar relative flex w-full snap-x snap-mandatory gap-4 overflow-x-auto lg:rounded-3xl'>
        {VideoThumbnails(normal_videos)}
      </div>
      <div className='no-scrollbar relative mt-5 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto lg:rounded-3xl'>
        {VideoThumbnails(normal_videos)}
      </div>
    </div>
  )
}

function VideosShimmer() {
  return (
    <div className='mx-auto max-w-4xl'>
      <div className='p-5'>
        <p className='text-lg font-[450]'>Videos</p>
        <div className='no-scrollbar relative mt-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto lg:rounded-3xl'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className='tap99 bg-inputBg relative flex aspect-[3/4] w-[40%] max-w-[200px] shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-sm'
            ></div>
          ))}
        </div>
        <div className='no-scrollbar relative mt-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto lg:rounded-3xl'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className='tap99 bg-inputBg relative flex aspect-[3/4] w-[40%] max-w-[200px] shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-sm'
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VideoThumbnails(videosData: NormalVideo[]) {
  const navigate = useNavigate()
  return videosData.map((videoData) => (
    <div
      key={videoData.id}
      className='tap99 bg-inputBg relative flex aspect-[3/4] w-[35%] max-w-[200px] shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-sm first:ml-5 last:mr-5'
      onClick={transitions(() => navigate(`/video/${videoData.id}`))}
    >
      <img className='h-full w-full shrink-0 object-cover' src={videoData.thumbnail} />
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pb-1.5 pt-8   text-center'>
        <p className='line-clamp-1 text-sm font-[450]'>{videoData.title}</p>
        {/* <p className='text-xs opacity-70'>{videoData.duration}</p> */}
        <p className='text-xs opacity-70'>12min 36sec</p>
      </div>
    </div>
  ))
}

// How to shuffle array
// function shuffle(array: any) {
//   var currentIndex = array.length,
//     randomIndex

//   // While there remain elements to shuffle...
//   while (currentIndex != 0) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex)
//     currentIndex--

//     // And swap it with the current element.
//     ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
//   }

//   return array
// }
