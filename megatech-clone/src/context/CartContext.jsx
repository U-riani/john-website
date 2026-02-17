// frontend/src/context/CartContext.jsx
import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext(null);

const initialState = {
  items: [], // { id, title, price, thumbnail, quantity }
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case "CHANGE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    const stored = localStorage.getItem("cart");
    if (!stored) return init;

    const parsed = JSON.parse(stored);

    return {
      ...parsed,
      items: parsed.items.map((i) => ({
        ...i,
        title:
          typeof i.title === "string"
            ? { en: i.title } // migrate old format
            : i.title,
      })),
    };
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const value = {
    items: state.items,
    addToCart: (product) => dispatch({ type: "ADD_ITEM", payload: product }),
    removeFromCart: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    changeQty: (id, quantity) =>
      dispatch({ type: "CHANGE_QTY", payload: { id, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
