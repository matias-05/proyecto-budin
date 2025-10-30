import carrito from '../../media/logo-carrito.png';
import './CartWidget.css';
import { useContext } from 'react';
import { cartContext } from '../../context/cartContext';

export default function CartWidget() {
  
  const {countCartItems} = useContext(cartContext);

  return (
    <div className="cart">
      <div className='cart-link'>
        <img src={carrito} alt="Cart" />
        <span className="cart-count">{countCartItems()}</span>
      </div>
    </div>
  );
}