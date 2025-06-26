"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OrderHistoryItem {
  orderId: string
  items: any[]
  totalPrice: number
  timestamp: string
  status: "sent" | "processing" | "completed"
}

interface OrderHistoryStore {
  orders: OrderHistoryItem[]
  addOrder: (order: OrderHistoryItem) => void
  getOrderById: (orderId: string) => OrderHistoryItem | undefined
  updateOrderStatus: (orderId: string, status: OrderHistoryItem["status"]) => void
}

export const useOrderHistory = create<OrderHistoryStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }))
      },
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.orderId === orderId)
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.orderId === orderId ? { ...order, status } : order)),
        }))
      },
    }),
    {
      name: "america-express-order-history",
    },
  ),
)
