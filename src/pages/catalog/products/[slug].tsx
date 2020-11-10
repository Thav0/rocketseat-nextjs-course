import {useRouter} from 'next/router'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import SEO from '@/components/SEO'

const AddToCartModal = dynamic(
  () => import('@/components/AddToCartModal'),
  { loading: () => <p>Loading...</p> }
)

export default function Product(){
  const router = useRouter()

  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false)

  function handleAddToCart(){
    setIsAddToCartModalVisible(true)
  }

  return (
    <div>
      <SEO />
      <h1>{router.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>

      { isAddToCartModalVisible && <AddToCartModal /> }
    </div>
  )
}