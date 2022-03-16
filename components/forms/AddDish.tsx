import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { ADD_DISH } from '../../graphql/mutations'
import { GET_DISHES } from '../../graphql/querys'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Loading from '../../public/loading.gif'

const AddDish = ({ toList }: { toList: () => void }) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [classNameDynamic, setClassNameDynamic] = useState('')
  const [typeMessage, setTypeMessage] = useState<'success'|'error'>('error')
  const [ newDish ] = useMutation(ADD_DISH, {
    update(cache, { data: { newDish } } ) {
      const { getDishes } = cache.readQuery({ query: GET_DISHES }) as { getDishes: any }
      cache.writeQuery({
        query: GET_DISHES,
        data: {
          getDishes: [...getDishes, newDish ]
        }
      })
    }
  })

  const dishFormmik = useFormik({
    initialValues: {
      "name": "",
      "detail": "",
      "price": 0,
      "price_before": 0,
    },
    validationSchema: Yup.object({
      "name": Yup.string().required('El nombre del palto es obligatorio.'),
      "detail": Yup.string(),
      "price": Yup.number().required('El precio es obligatorio'),
      "price_before": Yup.number()
    }),
    onSubmit: async ({name, detail, price, price_before}) => {
      try {
        setLoading(true)
        const { data } = await newDish({
          "variables": {
            "dish": {
              name,
              detail,
              "price": {
                "now_price": price,
                "before_price": price_before
              }
            }
          }
        })
        dishFormmik.resetForm()
        setLoading(false)
        setMessage('Plato registrado correctamente.')
        setTypeMessage('success')
        setTimeout(() => {
          toList()
        }, 2000);
      } catch (error) {
        dishFormmik.resetForm()
        setLoading(false)
        console.error(error)
        setTypeMessage('error')
        if (error instanceof Error) {
          setMessage(error.message)
        } else {
          setMessage('Error no controlado.')
        }
      }
    }
  })

  useEffect(() => {
    if (typeMessage === 'error') {
      setClassNameDynamic('bg-red-200 border-2 border-red-500')
    } else {
      setClassNameDynamic('bg-green-200 border-2 border-green-500')
    }
  }, [typeMessage])

  useEffect(() => {
    if (dishFormmik.errors.name !== '' || dishFormmik.errors.detail !== '' || dishFormmik.errors.price !== '' || dishFormmik.errors.detail !== '' || dishFormmik.errors.price_before !== '') {
      setTypeMessage('error')
      if (dishFormmik.errors.name && dishFormmik.errors.name !== '') {
        setMessage(dishFormmik.errors.name)
      }
      if (dishFormmik.errors.detail && dishFormmik.errors.detail !== '') {
        setMessage(dishFormmik.errors.detail)
      }
      if (dishFormmik.errors.price && dishFormmik.errors.price !== '') {
        setMessage(dishFormmik.errors.price)
      }
      if (dishFormmik.errors.price_before && dishFormmik.errors.price_before !== '') {
        setMessage(dishFormmik.errors.price_before)
      } 
      setTimeout(() => {
        setMessage('')
      }, 2500);
    }
  }, [dishFormmik.errors.name, dishFormmik.errors.detail, dishFormmik.errors.price, dishFormmik.errors.price_before])

  return (
    <form onSubmit={dishFormmik.handleSubmit} >
      <h4 className={'font-bold my-2'}>Agregar nuevo plato</h4>
      {
        (loading) ?
          (<Image src={Loading} width={50} alt={'cargando...'} />)
          :
          (
            <div className={'m-3 grid'}>
              <input onChange={dishFormmik.handleChange} value={dishFormmik.values.name} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'text'} name={'name'} id={'name'} placeholder={'Nombre'} />
              <input onChange={dishFormmik.handleChange} value={dishFormmik.values.detail} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'text'} name={'detail'} id={'detail'} placeholder={'Detalle'} />
              <input onChange={dishFormmik.handleChange} value={dishFormmik.values.price} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'number'} name={'price'} id={'price'} placeholder={'Precio regular'} />
              <input onChange={dishFormmik.handleChange} value={dishFormmik.values.price_before} className={'font-semibold rounded-md p-2 border-b-4 border-orange-500 my-3'} type={'number'} name={'price_before'} id={'price_before'} placeholder={'Precio anterior'} />
              <button type={'submit'} className={'p-3 my-2 bg-orange-600 text-white rounded-2xl'}>Registrar Plato</button>
            </div>
          )
      }
      {
        (message  !== '') && (
          <p className={`font-bold text-lg p-2 my-3 rounded-md ${classNameDynamic}`} >{message}</p>
        )
      }
    </form>
  )
}

export default AddDish