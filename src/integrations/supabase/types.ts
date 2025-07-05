export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          date_registered: string | null
          email: string | null
          id: number
          last_visit: string | null
          name: string
          phone: string | null
          prescriptions: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_registered?: string | null
          email?: string | null
          id?: number
          last_visit?: string | null
          name: string
          phone?: string | null
          prescriptions?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_registered?: string | null
          email?: string | null
          id?: number
          last_visit?: string | null
          name?: string
          phone?: string | null
          prescriptions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      e_prescriptions: {
        Row: {
          created_at: string | null
          date: string | null
          doctor_name: string
          hospital_name: string
          id: string
          medications: Json
          notes: string | null
          patient_id: number | null
          patient_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          doctor_name: string
          hospital_name: string
          id: string
          medications: Json
          notes?: string | null
          patient_id?: number | null
          patient_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          doctor_name?: string
          hospital_name?: string
          id?: string
          medications?: Json
          notes?: string | null
          patient_id?: number | null
          patient_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string | null
          expiry_date: string | null
          id: number
          manufacturer: string | null
          medicine_type: string | null
          name: string
          reorder_level: number
          sku: string
          stock: number
          strip_price: number | null
          tablets_per_strip: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          manufacturer?: string | null
          medicine_type?: string | null
          name: string
          reorder_level?: number
          sku: string
          stock?: number
          strip_price?: number | null
          tablets_per_strip?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          manufacturer?: string | null
          medicine_type?: string | null
          name?: string
          reorder_level?: number
          sku?: string
          stock?: number
          strip_price?: number | null
          tablets_per_strip?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string | null
          date: string | null
          doctor_name: string
          id: string
          medications: Json
          notes: string | null
          patient_id: number | null
          patient_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          doctor_name: string
          id: string
          medications: Json
          notes?: string | null
          patient_id?: number | null
          patient_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          doctor_name?: string
          id?: string
          medications?: Json
          notes?: string | null
          patient_id?: number | null
          patient_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          last_login: string | null
          name: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          last_login?: string | null
          name: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_login?: string | null
          name?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          date: string
          id: string
          items: number
          status: string | null
          supplier_id: number | null
          supplier_name: string
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id: string
          items: number
          status?: string | null
          supplier_id?: number | null
          supplier_name: string
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          items?: number
          status?: string | null
          supplier_id?: number | null
          supplier_name?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string | null
          customer: string
          date: string | null
          id: string
          product: string
          quantity: number
          reason: string
          refund_amount: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer: string
          date?: string | null
          id: string
          product: string
          quantity: number
          reason: string
          refund_amount: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer?: string
          date?: string | null
          id?: string
          product?: string
          quantity?: number
          reason?: string
          refund_amount?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string | null
          customer_id: number | null
          date: string | null
          id: string
          items: Json
          payment_method: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          date?: string | null
          id: string
          items: Json
          payment_method?: string | null
          total_amount: number
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          date?: string | null
          id?: string
          items?: Json
          payment_method?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
