import carrito from '../../media/logo-carrito.png';
import { useContext } from 'react';
import { cartContext } from '../../context/cartContext';

export default function CartWidget() {
  
  const {countCartItems} = useContext(cartContext);

  return (
    <div className="">
      <div className=''>
        <img src={carrito} alt="Cart" />
        <span className="">{countCartItems()}</span>
      </div>
    </div>
  );
}