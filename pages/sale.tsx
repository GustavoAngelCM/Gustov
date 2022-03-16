import { useMutation, useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { GET_MENUS } from '../graphql/querys'
import Image from 'next/image'
import Loading from '../public/loading.gif'
import ItemBoxDish from '../components/Box/ItemBoxDish'
import { createContext, useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { UPDATE_MENU } from '../graphql/mutations'
import { format } from 'date-fns'
import es from 'date-fns/locale/es'

interface Dish_Sale {
  "dish": string,
  "quantity": number,
  "subTotal": number
}

const SaleContext = createContext({ dishes: [] as Dish_Sale[], update: (_dishes: Dish_Sale) => {} })
const { Provider } = SaleContext

const Sale: NextPage = () => {
  const { data, loading } = useQuery(GET_MENUS)
  const [updateMenu] = useMutation(UPDATE_MENU)
  const [dishesToMenu, setDishesToMenu] = useState([])
  const [selectedMenu, setSelectedMenu] = useState("")
  const [dishesToSale, setDishesToSale] = useState<Dish_Sale[]>([])
  const router = useRouter()
  const dishFormmik = useFormik({
    initialValues: {
      "ciNit": "0",
      "nameReason": "S/N"
    },
    validationSchema: Yup.object({
      "ciNit": Yup.string().required("CI/NIT  es obligatorio"),
      "nameReason": Yup.string().required("Nombre  es obligatorio")
    }),
    onSubmit: async ({ ciNit, nameReason}) => {
      if (dishesToSale.length > 0) {
        const amountTotal = dishesToSale.reduce((total, dish) => dish.subTotal + total , 0)
        const saveSale = await fetch('http://127.0.0.1:8000/v1/sale/register', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            "dishes": dishesToSale,
            "mount": amountTotal,
            "client": {
              ciNit,
              nameReason
            }
          })
        })
        const { data } = await updateMenu({
          "variables": {
            "dishes": {
              "dishes": dishesToSale,
              "menu": selectedMenu
            }
          }
        })
        if (saveSale.ok) {
          alert('todo blue')
          dishFormmik.resetForm()
          setDishesToSale([])
          setTimeout(() => {
            toHome()
          }, 3000);
        } else {
          alert('No joven')
        }
      } else {
        alert('No se puede vender joven esta vacio')
      }
    }
  })

  const setDishes = (dishes: any, id: string) => {
    console.log(dishes)
    setSelectedMenu(id)
    setDishesToMenu(dishes)
    setDishesToSale([])
  }

  useEffect(() => {
    console.log(dishesToSale)
  }, [dishesToSale])

  const updateDishes = (_dishes: Dish_Sale) => {
    let exist = false
    if (dishesToSale.length > 0) {
      const newDishes = dishesToSale.reduce((prev, current) => {
        if (current.dish === _dishes.dish) {
          exist = true
          const newDish = {
            ...current,
            "quantity": _dishes.quantity,
            "subTotal": _dishes.subTotal
          } as Dish_Sale
          return [
            ...prev,
            newDish
          ]
        }
        return [...prev, current]
      }, [] as Dish_Sale[])
      if (exist) {
        setDishesToSale(newDishes)
      } else {
        setDishesToSale([...dishesToSale, _dishes])
      }
    } else {
      setDishesToSale([_dishes])
    }
  }

  const toHome = () => router.push('/')

  const onSale = () => {
    
  }

  return (
    <Provider value={{ dishes: dishesToSale, update: updateDishes}}>
      <div className={'flex w-full h-screen bg-red-500'}>
        <div className={'w-5/6 m-auto bg-white rounded-md p-3 text-center'}>
          <h4 className={'font-medium text-2xl select-none'}>
            <span className={'hover:text-orange-600 cursor-pointer underline decoration-orange-600'} onClick={toHome}>{'Restaurant GUSTOV '}</span>
            <span>{'"VENTAS"'}</span>
          </h4>
          <hr className={'m-2'} />
          <div className={'flex justify-around select-none flex-wrap'}>
            {
              (loading) ?
                ( <Image src={Loading} width={50} alt={'cargando...'} /> )
                :
                (
                  data.getMenus.map((menu: any) => <div key={menu.id} className={'p-3 m-3 border-2 border-red-800 cursor-pointer'} onClick={() => setDishes(menu.dishes, menu.id)}>{format(new Date(menu.date_menu), 'dd MMMM yyyy', {locale: es}) }</div>)
                )
            }
          </div>
          <div className={'flex justify-around select-none flex-wrap'}>
            {
              (dishesToMenu.length > 0) && dishesToMenu.map(({ id, dish, prepared_quantity }: any) => <ItemBoxDish key={dish.id} id={id} name={dish.name} prepared_quantity={prepared_quantity} price={dish.price.now_price} />)
            }
          </div>
          {
            (dishesToMenu.length > 0) && (
              <form onSubmit={dishFormmik.handleSubmit}>
                <div className={'flex justify-around select-none flex-wrap'}>
                  <input onChange={dishFormmik.handleChange} value={dishFormmik.values.ciNit} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'text'} name={'ciNit'} id={'ciNit'} placeholder={'CI NIT'} />
                  <input onChange={dishFormmik.handleChange} value={dishFormmik.values.nameReason} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'text'} name={'nameReason'} id={'nameReason'} placeholder={'Nombre o Razón'} />
                </div>
                <button className={'p-3 bg-orange-600 text-white rounded-md'} onClick={onSale} type={'submit'} > VENDER </button>
              </form>
            )
          }
        </div>
      </div>
    </Provider>
  )
}

export default Sale

export {
  SaleContext
}

export type {
  Dish_Sale
}