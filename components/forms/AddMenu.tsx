import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQuery } from '@apollo/client'
import { GET_DISHES } from '../../graphql/querys'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { ADD_MENU } from '../../graphql/mutations'

interface DishForMenu {
  "dish": string,
  "name": string,
  "quantity": number
}

const AddMenu = ({ toList }: { toList: () => void }) => {
  const [dishesForMenu, setDishesForMenu] = useState<DishForMenu[]>([])
  const [menuCompleteShow, setMenuCompleteShow] = useState(false)
  const [dateMenu, setDateMenu] = useState(new Date())
  const { data } = useQuery(GET_DISHES)
  const [registerMenu] = useMutation(ADD_MENU)

  const removeItemForDishes = (id: string) => setDishesForMenu(dishesForMenu.filter(_dish => _dish.dish !== id))

  const menuFormmik = useFormik({
    initialValues: {
      "dish": "",
      "quantity": 0
    },
    validationSchema: Yup.object({
      "dish": Yup.string().required('El plato debe estar seleccionado.'),
      "quantity": Yup.number().required('El precio es obligatorio')
    }),
    onSubmit: ({dish, quantity}) => {
      let existDish = false
      dishesForMenu.forEach(_dish => {
        if (dish.split('+')[0] === _dish.dish) {
          existDish = true
        }
      })
      if (!existDish) {
        setDishesForMenu([...dishesForMenu, {
          "dish": dish.split('+')[0],
          quantity,
          "name": dish.split('+')[1]
        }])
        menuFormmik.resetForm()
      } else {
        alert('Ya se encuentra en el menu.')
      }
    }
  })

  const onSaveMenu = async () => {
    const dishesCasting = dishesForMenu.map(_dish => {
      return {
        "dish": _dish.dish,
        "prepared_quantity": _dish.quantity
      }
    })
    try {
      const { data } = await registerMenu({
        "variables": {
          "menu": {
            "date_menu": dateMenu.getTime(),
            "dishes": dishesCasting
          }
        }
      })
      setTimeout(() => {
        toList()
      }, 2000);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={'flex justify-between'}>
      <div className={'border-2 rounded-md border-orange-800 m-2'}>
        {
          (!menuCompleteShow) ? 
            (
              <form onSubmit={menuFormmik.handleSubmit} >
                <h4 className={'font-bold my-2'}>Agregar plato al menu</h4>
                <div className={'m-3 grid'}>
                  <select onChange={menuFormmik.handleChange} value={menuFormmik.values.dish} name={'dish'} id={'dish'} placeholder={'Selecciona un plato'} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} >
                    <option value={''} selected disabled >{'Selecciona un plato'}</option>
                    {data.getDishes.map((dish: any) => (
                      <option key={dish.id} value={`${dish.id}+${dish.name}`} >
                        {dish.name}
                      </option>
                    ))}
                  </select>
                  <input onChange={menuFormmik.handleChange} value={menuFormmik.values.quantity} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'number'} name={'quantity'} id={'quantity'} placeholder={'Cantidad'} />
                  <button type={'submit'} className={'p-3 my-2 bg-orange-600 text-white rounded-2xl'}>Agregar Plato</button>
                </div>
              </form>
            )
            :
            (
              <div>
                <h4 className={'font-bold my-2'}>Seleccione una fecha para el menu</h4>
                <Calendar onChange={setDateMenu} value={dateMenu} />
                <button type={'submit'} className={'p-3 my-2 bg-cyan-400 text-white rounded-2xl'} onClick={() => setMenuCompleteShow(false)} >Seguir agregando platos</button>
                <button type={'submit'} className={'p-3 my-2 bg-green-600 text-white rounded-2xl'} onClick={onSaveMenu} >Registrar Menu</button>
              </div>
            )
        }
      </div>
      <div className={'border-2 rounded-md border-orange-800 m-2'}>
        {
          (dishesForMenu.length > 0) ?
            (
              dishesForMenu.map(dish => (
                <li key={dish.dish} onDoubleClick={() => removeItemForDishes(dish.dish)} className={'p-1 cursor-pointer border-slate-600 border-2 rounded-md my-3 flex justify-between hover:bg-slate-200'}>
                  {dish.name}
                  <span className={'font-bold text-red-500 pl-5'}>{`${dish.quantity}`}</span>
                </li>
              ))
            )
            :
            (
              <li className={'p-1 border-slate-600 border-2 rounded-md my-3 flex justify-between hover:bg-slate-200'}>
                <span className={'font-bold text-red-500'}>{`Menu vacío`}</span>
              </li>
            )
        }
        {
          (dishesForMenu.length > 0) && <button onClick={() => setMenuCompleteShow(true)} className={'p-3 my-2 bg-orange-600 text-white rounded-2xl'}>Siguiente</button>
        }
      </div>
    </div>
  )
}

export default AddMenu