import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GET_DISHES } from '../graphql/querys'
import Image from 'next/image'
import Loading from '../public/loading.gif'
import Menu from '../public/hamburger.png'
import PlusDish from '../public/dishwasher.png'
import Dishes from '../public/list.png'
import AddDish from '../components/forms/AddDish'
import AddMenu from '../components/forms/AddMenu'

const Dish: NextPage = () => {
  const { data, loading } = useQuery(GET_DISHES)
  const [ step, setStep ] = useState<1|2|3>(1)
  const router = useRouter()

  const toHome = () => router.push('/')

  const toListDish = () => setStep(1)

  const stepDishes = () => {
    if (loading) {
      return  <Image src={Loading} width={50} alt={'cargando...'} />
    }
    return (
      <ul className={'lg:w-6/12 md:w-6/12 xs:w-full'}>
        {data.getDishes.map((dish: any) => (
          <li key={dish.id} className={'p-1 border-slate-600 border-2 rounded-md my-2 flex justify-between hover:bg-slate-200'}>
            {dish.name}
            <span className={'font-bold text-red-500'}>{`Bs.- ${dish.price.now_price}`}</span>
          </li>
        ))}
      </ul>
    )
  }

  const stepMenu = () => <AddMenu toList={toListDish} />

  const stepAddDish = () => <AddDish toList={toListDish} />

  return (
    <div className={'flex w-full h-screen bg-red-500'}>
      <div className={'w-5/6 m-auto bg-white rounded-md p-3 text-center'}>
        <h4 className={'font-medium text-2xl select-none'}>
          <span className={'hover:text-orange-600 cursor-pointer underline decoration-orange-600'} onClick={toHome}>{'Restaurant GUSTOV '}</span>
          <span>{'"PLATOS"'}</span>
        </h4>
        <hr className={'m-2'} />
        <div className={'flex justify-center select-none'}>
          <div className={'bg-slate-700 rounded-md hover:bg-red-400 transition-all px-2 mx-1'}>
            <Image src={Dishes} width={55} height={35} alt={'menu'} className={'cursor-pointer'} onClick={() => setStep(1)} />
            <h4 className={'text-white'}>Lista de platos</h4>
          </div>
          <div className={'bg-slate-700 rounded-md hover:bg-red-400 transition-all px-2 mx-1'}>
            <Image src={Menu} width={55} height={35} alt={'menu'} className={'cursor-pointer'} onClick={() => setStep(2)} />
            <h4 className={'text-white'}>Crear Menu</h4>
          </div>
          <div className={'bg-slate-700 rounded-md hover:bg-red-400 transition-all px-2 mx-1'}>
            <Image src={PlusDish} width={55} height={35} alt={'menu'} className={'cursor-pointer'} onClick={() => setStep(3)} />
            <h4 className={'text-white'}>Agregar Plato</h4>
          </div>
        </div>
        <div className={'flex justify-around select-none'}>
          { (step === 1) && (stepDishes()) }
          { (step === 2) && (stepMenu()) }
          { (step === 3) && (stepAddDish()) }
        </div>
      </div>
    </div>
  )
}

export default Dish