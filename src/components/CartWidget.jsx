import carrito from '../media/logo-carrito.png';

export default function CartWidget() {
  const count = 0;
  return (
    <div className="cart">
          <a href="" className='cart-link'>
          <img src={carrito} alt="Cart" />
            <span className="cart-count">{count}</span>
          </a>
    </div>
  );
}