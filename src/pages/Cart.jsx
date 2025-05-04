import React, { useState } from 'react';
import '../styles/cart.css';
import { Link } from 'react-router-dom';

const sellers = [
  {
    id: 1,
    name: 'Seny',
    products: [
      {
        id: 1,
        name: 'Dziewczęce, dzianinowe, kontrastowe, luźne, sportowe, swobodne spodnie',
        price: 2499.0,
        oldPrice: 4999.0,
        image: '/assets/shoes.png',
      },
    ],
  },
  {
    id: 2,
    name: 'Selle',
    products: [
      {
        id: 2,
        name: 'Dziewczęce, dzianinowe, kontrastowe, luźne, sportowe, swobodne spodnie',
        price: 2499.0,
        oldPrice: 4999.0,
        image: '/assets/shoes.png',
      },
      {
        id: 3,
        name: 'Dziewczęce, dzianinowe, kontrastowe, luźne, sportowe, swobodne spodnie',
        price: 2499.0,
        oldPrice: 4999.0,
        image: '/assets/shoes.png',
      },
      {
        id: 4,
        name: 'Dziewczęce, dzianinowe, kontrastowe, luźne, sportowe, swobodne spodnie',
        price: 2499.0,
        oldPrice: 4999.0,
        image: '/assets/shoes.png',
      },
      {
        id: 5,
        name: 'Dziewczęce, dzianinowe, kontrastowe, luźne, sportowe, swobodne spodnie',
        price: 2499.0,
        oldPrice: 4999.0,
        image: '/assets/shoes.png',
      },
    ],
  },
];

const Cart = () => {
  const [checkedState, setCheckedState] = useState(() =>
    sellers.map(seller => ({
      sellerId: seller.id,
      checked: true,
      products: seller.products.map(p => ({ productId: p.id, checked: true })),
    }))
  );
  
  const [allCompaniesChecked, setAllCompaniesChecked] = useState(true);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Handle toggle of the "ALL COMPANIES" checkbox
  const handleAllCompaniesToggle = () => {
    const newCheckedState = allCompaniesChecked
      ? sellers.map(seller => ({
          sellerId: seller.id,
          checked: false,
          products: seller.products.map(p => ({ productId: p.id, checked: false })),
        }))
      : sellers.map(seller => ({
          sellerId: seller.id,
          checked: true,
          products: seller.products.map(p => ({ productId: p.id, checked: true })),
        }));

    setCheckedState(newCheckedState);
    setAllCompaniesChecked(!allCompaniesChecked);
  };

  // Handle toggle of individual seller checkbox
  const handleSellerToggle = sellerId => {
    setCheckedState(prev =>
      prev.map(s => {
        if (s.sellerId === sellerId) {
          const updatedProducts = s.products.map(p => ({ ...p, checked: !s.checked }));
          const updatedChecked = !s.checked;
          return { ...s, checked: updatedChecked, products: updatedProducts };
        }
        return s;
      })
    );
    updateAllCompaniesChecked();
  };

  // Handle toggle of individual product checkbox
  const handleProductToggle = (sellerId, productId) => {
    setCheckedState(prev =>
      prev.map(s => {
        if (s.sellerId === sellerId) {
          const updatedProducts = s.products.map(p =>
            p.productId === productId ? { ...p, checked: !p.checked } : p
          );
          const allChecked = updatedProducts.every(p => p.checked);
          return { ...s, products: updatedProducts, checked: allChecked };
        }
        return s;
      })
    );
    updateAllCompaniesChecked();
  };

  // Check if all sellers are checked to update "ALL COMPANIES" checkbox
  const updateAllCompaniesChecked = () => {
    const allChecked = checkedState.every(s => s.checked);
    setAllCompaniesChecked(allChecked);
  };

  const allProducts = sellers.flatMap(s => s.products);
  const previewProducts = allProducts.slice(0, 4);
  const remainingCount = allProducts.length - 4;
  const [selectedShipping, setSelectedShipping] = useState('method-0');
  const [selectedPayment, setSelectedPayment] = useState('payment-0');
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    sellers.forEach(seller => {
      seller.products.forEach(product => {
        initial[product.id] = 1;
      });
    });
    return initial;
  });
  const [isEditing, setIsEditing] = useState(false);
const [address, setAddress] = useState({
  name: 'Valeriia Zlydar',
  phone: '883589324',
  email: 'marsonyteam@gmail.com',
  deliveryPoint: 'LOD51N al. Politechniki 1',
  address: 'al. Politechniki Łódź łódzkie Poland 93-590',
});


  return (
    <div className="cart-container1">
      <h2 className="breadcrumb">Cart &gt; Place order &gt; Pay &gt; Order Completed</h2>
      <div className="cart_all">
        {!checkoutComplete ? (
          <>
            <div className="cart-main">
              <div className="all-items-header">
                <input
                  type="checkbox"
                  checked={allCompaniesChecked}
                  onChange={handleAllCompaniesToggle}
                />
                <span className="all-items-text">ALL COMPANIES ({sellers.length})</span>
              </div>
              {checkedState.map(sellerState => {
                const seller = sellers.find(s => s.id === sellerState.sellerId);
                return (
                  <div key={seller.id} className="seller-section">
                    <div className="seller-header">
                      <input
                        type="checkbox"
                        checked={sellerState.checked}
                        onChange={() => handleSellerToggle(seller.id)}
                      />
                      <span className="seller-name">{seller.name}</span>
                    </div>
                    {seller.products.map(product => {
                      const productState = sellerState.products.find(p => p.productId === product.id);
                      return (
                        <div key={product.id} className="cart-card">
                          <input
                            type="checkbox"
                            checked={productState.checked}
                            onChange={() => handleProductToggle(seller.id, product.id)}
                            className="cart-checkbox"
                          />
                          <img src={product.image} alt="product" className="product-image" />
                          <Link to={`/product/${product.id}`} className="product-info">
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-desc">
                              Lorem ipsum lorem ipsum lorem ipsum lorem ipsumLorem ipsum lorem ipsum lorem ipsum lorem ipsumLorem ipsum lorem ipsum lorem ipsum lorem ipsum
                            </p>
                            <div className="product-price">
                              ${product.price.toFixed(2)}{' '}
                              <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                            </div>
                          </Link>
                          <button className="delete-button">
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="order-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="preview-images">
                {previewProducts.map((product, i) => (
                  <div key={i} className="preview-wrapper">
                    <img src={product.image} alt="preview" className="preview-image" />
                    {i === 3 && remainingCount > 0 && (
                      <div className="overlay">+{remainingCount}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span className="label_lowest">Lowest price:</span>
                  <span className="value_lowest highlight">$2345.00</span>
                </div>
                <div className="summary-row">
                  <span className="label_discount">Discount amount:</span>
                  <span className="value_discount highlight">$99.00</span>
                </div>
                <div className="summary-row">
                  <span className="label_total">Total:</span>
                  <span className="value_total total">$2246.00</span>
                </div>
              </div>
              <button className="checkout-button" onClick={() => setCheckoutComplete(true)}> <i className="fa-brands fa-opencart"></i>Checkout</button>
              <div className="accepting-text">Accepting</div>
              <div className="payment-methods">
                <img src="../assets/mbank.png" alt="Mbank" className="pay-icon" />
                <img src="../assets/mastercard.png" alt="MasterCard" className="pay-icon" />
                <img src="../assets/visa.png" alt="Visa" className="pay-icon" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="cart-main">
            <div className="seller-section padding_cart">
                <div className="address_pickup">
                  <div className="accepting-text">Pickup Address</div>
                  <div className="pickup_address">
                    <div className="address_info">
                      {isEditing ? (
                        <>
                        <div className='editing_row_div'>
                          <div className='editing_col_div first1'>
                            <label>Name</label>
                            <input
                              type="text"
                              value={address.name}
                              onChange={e => setAddress({ ...address, name: e.target.value })}
                            />
                          </div>
                          <div className='editing_col_div'>
                            <label>Phone</label>
                            <input
                              type="text"
                              value={address.phone}
                              onChange={e => setAddress({ ...address, phone: e.target.value })}
                            />
                          </div>
                        </div>
                          
                          <div className='editing_col_div'>
                            <label>Email</label>
                            <input
                              type="email"
                              value={address.email}
                              onChange={e => setAddress({ ...address, email: e.target.value })}
                            />
                          </div>
                          <div className='editing_row_div'>
                            <div className='editing_col_div first1'>
                              <label>Delivery Point</label>
                              <input
                                type="text"
                                value={address.deliveryPoint}
                                onChange={e => setAddress({ ...address, deliveryPoint: e.target.value })}
                              />
                            </div>
                            <div className='editing_col_div'>
                              <label>Full Address</label>
                              <input
                                type="text"
                                value={address.address}
                                onChange={e => setAddress({ ...address, address: e.target.value })}
                              />
                            </div>
                          </div>
                          
                        </>
                      ) : (
                        <>
                          <span className="name_surname">{address.name}</span>
                          <span className="number_address">{address.phone}</span>
                          <span className="email_address">{address.email}</span>
                          <span className="delivery_point">{address.deliveryPoint}</span>
                          <span className="user_address">{address.address}</span>
                        </>
                      )}
                    </div>
                    <button
                      className="edit_address"
                      onClick={() => setIsEditing(prev => !prev)} // Toggle the editing mode
                    >
                      {isEditing ? 'Save Address' : 'Edit Address'}
                    </button>
                  </div>
                </div>
              </div>


              {/* Order Details */}
              <div className="seller-section padding_cart">
                <div className="order_details">
                  <div className="accepting-text">Order Details</div>
                    <div className="all_order_items">
                    {sellers.flatMap(seller => seller.products).map((product, index) => (
                      <div className="order_item" key={product.id}>
                        <div className="order_image">
                          <img src={product.image} alt="order item" />
                        </div>
                        <div className="cost_all">
                          <span className="cost_noww">${product.price.toFixed(2)}</span>
                          <span className="cost_beforee">${product.oldPrice.toFixed(2)}</span>
                        </div>
                        <div className="amount_to_add_order">
                          <div
                            className="amount_minus_order"
                            onClick={() =>
                              setQuantities(prev => ({
                                ...prev,
                                [product.id]: Math.max(1, (prev[product.id] || 1) - 1),
                              }))
                            }
                          >
                            -
                          </div>
                          <div className="amount_number_order">{quantities[product.id] || 1}</div>
                          <div
                            className="amount_plus_order"
                            onClick={() =>
                              setQuantities(prev => ({
                                ...prev,
                                [product.id]: (prev[product.id] || 1) + 1,
                              }))
                            }
                          >
                            +
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Shipping Method */}
                <div className="shipping_methods">
                  <div className="accepting-text">Shipping Method</div>
                  <div className="all_shipping_methods">
                      {[1, 2, 3].map((method, index) => {
                        const methodId = `method-${index}`;
                        return (
                          <div
                            key={index}
                            className={`shipping_method ${selectedShipping === methodId ? 'selected' : ''}`}
                            onClick={() => setSelectedShipping(methodId)}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={methodId}
                              checked={selectedShipping === methodId}
                              readOnly
                            />
                            <div className="info_shipping">
                              <p className="name_of_shipping">InPost Paczkomat 24/7</p>
                              <p className="details_shipping_cost_time">
                                9,90zł (Dostarczenie między Poniedziałek, Kwi 7 – Środa, Kwi 9.)
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                </div>
              </div>

             {/* Payment Methods */}
            <div className="seller-section padding_cart">
              <div className="payment_methods">
                <div className="accepting-text">Payment Method</div>
                <div className="all_payments_methods">
                    {['mastercard', 'visa', 'mbank'].map((method, index) => {
                      const paymentId = `payment-${index}`;
                      return (
                        <div
                          key={index}
                          className={`mayment_method ${selectedPayment === paymentId ? 'selected' : ''}`}
                          onClick={() => setSelectedPayment(paymentId)}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === paymentId}
                            readOnly
                          />
                          <img src={`/assets/${method}.png`} alt={method} />
                        </div>
                      );
                    })}
                  </div>

              </div>
            </div>

            </div>

            <div className="order-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="label_lowest">Lowest price:</span>
                  <span className="value_lowest highlight">$2345.00</span>
                </div>
                <div className="summary-row discount_border">
                  <span className="label_discount">Discount amount:</span>
                  <span className="value_discount highlight">$99.00</span>
                </div>
                <div className="summary-row">
                  <span className="label_total">Total:</span>
                  <span className="value_total total">$2246.00</span>
                </div>
              </div>
              <button className="checkout-button" > <i className="fa-brands fa-opencart"></i>Pay</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
