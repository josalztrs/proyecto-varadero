export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cliente: {
        Row: {
          correo: string | null
          direccion: string | null
          doc_ident: string | null
          id: number
          nacionalidad: string | null
          nombre: string
        }
        Insert: {
          correo?: string | null
          direccion?: string | null
          doc_ident?: string | null
          id?: number
          nacionalidad?: string | null
          nombre: string
        }
        Update: {
          correo?: string | null
          direccion?: string | null
          doc_ident?: string | null
          id?: number
          nacionalidad?: string | null
          nombre?: string
        }
        Relationships: []
      }
      datos_pago: {
        Row: {
          conc: string
          est: string
          id: number
          modo_pago: string
          ref: string
        }
        Insert: {
          conc: string
          est: string
          id?: number
          modo_pago: string
          ref: string
        }
        Update: {
          conc?: string
          est?: string
          id?: number
          modo_pago?: string
          ref?: string
        }
        Relationships: []
      }
      datos_varadero: {
        Row: {
          direccion: string | null
          doc_fisc: string
          email: string | null
          nombre: string
          tlf: string | null
        }
        Insert: {
          direccion?: string | null
          doc_fisc: string
          email?: string | null
          nombre: string
          tlf?: string | null
        }
        Update: {
          direccion?: string | null
          doc_fisc?: string
          email?: string | null
          nombre?: string
          tlf?: string | null
        }
        Relationships: []
      }
      detalles_emb: {
        Row: {
          amarres_asign: string | null
          calado: string | null
          cant_pasaj: string | null
          cert_nav: string
          cuadr_asign: string | null
          edo_antes: string | null
          edo_despues: string | null
          eslora: string | null
          id: number
          manga: string | null
          mat_emb: string
          num_seguro: string
          tonelaje: string | null
        }
        Insert: {
          amarres_asign?: string | null
          calado?: string | null
          cant_pasaj?: string | null
          cert_nav: string
          cuadr_asign?: string | null
          edo_antes?: string | null
          edo_despues?: string | null
          eslora?: string | null
          id?: number
          manga?: string | null
          mat_emb: string
          num_seguro: string
          tonelaje?: string | null
        }
        Update: {
          amarres_asign?: string | null
          calado?: string | null
          cant_pasaj?: string | null
          cert_nav?: string
          cuadr_asign?: string | null
          edo_antes?: string | null
          edo_despues?: string | null
          eslora?: string | null
          id?: number
          manga?: string | null
          mat_emb?: string
          num_seguro?: string
          tonelaje?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "datos_emb_mat_emb_fkey"
            columns: ["mat_emb"]
            isOneToOne: true
            referencedRelation: "embarcacion"
            referencedColumns: ["matricula"]
          },
        ]
      }
      embarcacion: {
        Row: {
          caracteristicas: string | null
          id_cliente: number | null
          marca: string | null
          matricula: string
          modelo: string | null
          nacionalidad: string | null
          nombre: string | null
          tipo: string | null
          year: string | null
        }
        Insert: {
          caracteristicas?: string | null
          id_cliente?: number | null
          marca?: string | null
          matricula: string
          modelo?: string | null
          nacionalidad?: string | null
          nombre?: string | null
          tipo?: string | null
          year?: string | null
        }
        Update: {
          caracteristicas?: string | null
          id_cliente?: number | null
          marca?: string | null
          matricula?: string
          modelo?: string | null
          nacionalidad?: string | null
          nombre?: string | null
          tipo?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "embarcacion_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
        ]
      }
      personal: {
        Row: {
          cedula: string
          email: string
          id: number
          nombre: string
          ocupacion: string | null
          salario: number | null
          telefono: string
        }
        Insert: {
          cedula: string
          email: string
          id?: number
          nombre: string
          ocupacion?: string | null
          salario?: number | null
          telefono: string
        }
        Update: {
          cedula?: string
          email?: string
          id?: number
          nombre?: string
          ocupacion?: string | null
          salario?: number | null
          telefono?: string
        }
        Relationships: []
      }
      servicios: {
        Row: {
          fecha: string | null
          id: number
          notas: string | null
          personal_enc: string | null
          precio: string | null
          tipo: string | null
        }
        Insert: {
          fecha?: string | null
          id?: number
          notas?: string | null
          personal_enc?: string | null
          precio?: string | null
          tipo?: string | null
        }
        Update: {
          fecha?: string | null
          id?: number
          notas?: string | null
          personal_enc?: string | null
          precio?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servicios_personal_enc_fkey"
            columns: ["personal_enc"]
            isOneToOne: false
            referencedRelation: "personal"
            referencedColumns: ["cedula"]
          },
        ]
      }
      transacciones: {
        Row: {
          fecha: string
          id: number
          id_cliente: number
          id_pago: number
          id_servicio: number | null
          monto_total: string
          varadero: string | null
        }
        Insert: {
          fecha?: string
          id?: number
          id_cliente: number
          id_pago: number
          id_servicio?: number | null
          monto_total: string
          varadero?: string | null
        }
        Update: {
          fecha?: string
          id?: number
          id_cliente?: number
          id_pago?: number
          id_servicio?: number | null
          monto_total?: string
          varadero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: true
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_id_pago_fkey"
            columns: ["id_pago"]
            isOneToOne: true
            referencedRelation: "datos_pago"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_varadero_fkey"
            columns: ["varadero"]
            isOneToOne: false
            referencedRelation: "datos_varadero"
            referencedColumns: ["doc_fisc"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
