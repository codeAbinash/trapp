import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DrawerWrapper, ScrollToTop } from '../../App'
import { getVideoDetails_f } from '../../lib/api'
import { niceDate } from '../../lib/util'
import VideosByCat from '../Category/VideosByCat'
import BackButton from '../Live/BackButton'
import { VideoDetails } from './components/VideoComponents'
import { Player } from 'video-react'

export default function Video() {
  const { video_id } = useParams()
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [isBackBtn, setShowBackButton] = useState(true)
  // const { setIsOpened } = useSubscriptionDrawer()
  // const profile: UserProfile = useSelector((state: any) => state.profile)
  // const isSubscribed = profile?.subscription_status?.status === 'active'

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackButton(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  function setBackButtonVisibility() {
    if (isBackBtn) return
    setShowBackButton(true)
    setTimeout(() => {
      setShowBackButton(false)
    }, 5000)
  }

  function clickOnVideo() {
    // setIsOpened(!isSubscribed)
    setBackButtonVisibility()
  }

  async function loadVideoDetails() {
    const res = await getVideoDetails_f(video_id!)
    if (!res.status) return
    console.log(res.data.data)
    setVideoDetails(res.data.data)
  }
  useEffect(() => {
    setVideoDetails(null)
    loadVideoDetails()
    // setIsOpened(!isSubscribed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video_id])
  return (
    <>
      <ScrollToTop />
      <div
        className='sticky top-0 z-10 w-full bg-bg/80 pb-2 backdrop-blur-md'
        onMouseMove={setBackButtonVisibility}
        onTouchMove={setBackButtonVisibility}
        onTouchStart={setBackButtonVisibility}
        onClick={clickOnVideo}
      >
        <BackButton show={isBackBtn} />
        <Player playsInline poster={videoDetails?.thumbnail || ''} src={videoDetails?.video_loc || ''}></Player>
        <p className='mt-2 text-center text-[0.55rem] opacity-50'>
          Uploaded by {videoDetails?.creator.channel_name} - {niceDate(videoDetails?.created_at || '')}
        </p>
      </div>
      <div className='h-dvh select-none'>
        {/* <div className='mt-3 aspect-video w-full'></div> Blank Space for the video */}
        <VideoDetails videoDetails={videoDetails} />
        <div>
          <p className='my-7 mt-2 px-5 text-base font-[450]'>Related Videos</p>
          {videoDetails?.cat_id && <VideosByCat cat_id={videoDetails?.cat_id} />}
        </div>
      </div>
      <DrawerWrapper />
    </>
  )
}

{
  /* <div className='stacked relative grid-cols-1 overflow-hidden'>
  <div className='darken_top_bottom h-full w-full '>
    <header className='absolute flex p-3'>
      <div
        className='tap95 mr-2 rounded-full p-3.5 active:bg-white/10'
        onClick={transitions(() => navigate(-1))}
      >
        <img src='/icons/other/arrow.svg' className='aspect-square w-[1.1rem] rotate-180' />
      </div>
    </header>
    <img src='/images/creator-background.png' className='aspect-[15/9] w-full object-cover' />
  </div>
  <div className='h-full w-full'>
    <div className='h-1/2 w-full bg-gradient-to-b from-bg to-black/60'></div>
    <div className='h-1/2 w-full bg-gradient-to-t from-bg to-black/60'></div>
  </div>
  <div className=''>
    <div className='flex w-full flex-col items-center justify-center gap-1.5'>
      <img src='/icons/other/play.svg' className='w-6' />
    </div>
  </div>
</div> */
}
