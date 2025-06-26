"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  selectedOptions?: {
    color?: string
    size?: string
    storage?: string
    memory?: string
  }
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items

        // Создаем уникальный ID для товара с опциями
        const itemId = `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
        const existingItem = items.find((i) => {
          const existingItemId = `${i.id}-${JSON.stringify(i.selectedOptions || {})}`
          return existingItemId === itemId
        })

        if (existingItem) {
          set({
            items: items.map((i) => {
              const existingItemId = `${i.id}-${JSON.stringify(i.selectedOptions || {})}`
              return existingItemId === itemId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
            }),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
          })
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => {
            const itemId = `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
            return itemId !== id
          }),
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) => {
            const itemId = `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
            return itemId === id ? { ...item, quantity } : item
          }),
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "america-express-cart",
    },
  ),
)
