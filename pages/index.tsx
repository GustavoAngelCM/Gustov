import type { NextPage } from 'next'
import Image from 'next/image'
import Menu from '../public/hamburger_payment.png'
import Dish from '../public/croissant.png'
import Report from '../public/menu.png'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()

  const toDish = () => router.push('dish')

  const toReport = () => router.push('report')

  const toSale = () => router.push('sale')

  return (
    <div className={'flex w-full h-screen bg-red-500'}>
      <div className={'w-5/6 m-auto bg-white rounded-md p-3 text-center'}>
        <h4 className={'font-medium text-2xl select-none'}>Restaurant GUSTOV</h4>
        <hr className={'m-2'}/>
        <div className={'flex justify-around select-none'}>
          <div onClick={toDish} className={'bg-slate-700 rounded-md hover:bg-red-400 transition-all'}>
            <Image src={Dish} width={200} height={200} alt={'menu'} className={'cursor-pointer'} />
            <h4 className={'text-white'}>Platos</h4>
          </div>
          <div onClick={toSale} className={'bg-slate-700 rounded-md hover:bg-red-400 transition-all'}>
            <Image src={Menu} width={200} height={200} alt={'menu'} className={'cursor-pointer'} />
            <h4 className={'text-white'}>Venta</h4>
          </div>
          <div onClick={toReport} className={'bg-slate-700 rounded-md hover:bg-red-400 transition-all'}>
            <Image src={Report} width={200} height={200} alt={'menu'} className={'cursor-pointer'} />
            <h4 className={'text-white'}>Reportes</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
