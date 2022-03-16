import { useContext, useEffect, useState } from 'react'
import { Dish_Sale, SaleContext } from '../../pages/sale'

const ItemBoxDish = ({ name, price, prepared_quantity, id }: { name: string, price: number, prepared_quantity: number, id: string}) => {
  const [quantity, setQuantity] = useState(0)
  const { dishes, update } = useContext(SaleContext)

  const addQuantity = () => {
    if (prepared_quantity > quantity) {
      setQuantity(quantity + 1)
    }
  }

  useEffect(() => {
    if (quantity > 0) {
      updateContext()
    }
  }, [quantity])

  const updateContext = () => {
    const dishQuantity = {
      "dish":  id,
      "quantity": quantity,
      "subTotal": quantity * price
    } as Dish_Sale
    update(dishQuantity)
  }

  const decreaseQuantity = () => {
    if(quantity > 0) {
      setQuantity(quantity - 1)
    }
  }
  return (
    <div className={'border-4 text-center border-red-500 p-2 m-2 rounded-md'}>
      <h4 className={'font-bold text-lg'}>{name} <span className={'text-red-500 font-bold text-lg'} >{`Bs.- ${price}`}</span> </h4>
      <div className={'inline-block'}>
        <button onClick={addQuantity} className={'rounded-md p-1 bg-yellow-400 border-2 border-amber-700 m-2'} >+</button>
        <span className={'font-bold text-lg'} >{quantity}</span>
        <button onClick={decreaseQuantity} className={'rounded-md p-1 bg-yellow-400 border-2 border-amber-700 m-2'} >-</button>
      </div>
    </div>
  )
}

export default ItemBoxDish