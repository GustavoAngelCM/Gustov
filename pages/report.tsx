import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Report: NextPage = () => {
  const [ventas, setVentas] = useState([])
  const [total, setTotal] = useState(0)
  const router = useRouter()

  const toHome = () => router.push('/')

  useEffect(() => {
    (async () => {
      const data = await fetch('http://127.0.0.1:8000/v1/sale/report', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      if (data.ok) {
        const response = await data.json()
        setTotal(response.data.reduce((total: any, sale: any) => total + sale.totalAmount, 0))
        setVentas(response.data as [])
      } else {
        alert('algo fallo')
      }
    })()
  }, [ventas])

  return (
    <div className={'flex w-full h-screen bg-red-500'}>
      <div className={'w-5/6 m-auto bg-white rounded-md p-3 text-center'}>
        <h4 className={'font-medium text-2xl select-none'}>
          <span className={'hover:text-orange-600 cursor-pointer underline decoration-orange-600'} onClick={toHome}>{'Restaurant GUSTOV '}</span>
          <span>{'"REPORTES"'}</span>
        </h4>
        <hr className={'m-2'} />
        <div className={'flex justify-around select-none'}>
          <ul className={'lg:w-6/12 md:w-6/12 xs:w-full'}>
            {ventas.map((venta: any) => (
              <li key={venta.id} className={'p-1 border-slate-600 border-2 rounded-md my-2 flex justify-between hover:bg-slate-200'}>
                {venta.keySale}
                <span className={'font-bold text-green-700'}>{`Bs.- ${venta.totalAmount}`}</span>
              </li>
            ))}
          </ul>
          <div className={'font-extrabold text-2xl text-red-700'}>{total}</div>
        </div>
      </div>
    </div>
  )
}

export default Report